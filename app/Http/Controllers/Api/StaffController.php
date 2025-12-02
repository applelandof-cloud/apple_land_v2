<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    public function index()
    {
        $users = User::where('is_active', 1)
            ->with(['roles:id,name', 'places:id,name'])
            ->get();

        $roles = Role::where('is_active', 1)->get();
        $places = Place::where('is_active', 1)->get();

        return response()->json([
            'users'=> $users,
            'roles' => $roles,
            'places' => $places
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'identification' => 'nullable|string|max:15',
            'phone_number' => 'nullable|string|max:20',
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|string|email|max:100|unique:users',
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,id',
            'place_ids' => 'array',
            'place_ids.*' => 'exists:places,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'identification' => $request->identification,
            'phone_number' => $request->phone_number,
            'username' => $request->username,
            'email' => $request->email,
            'is_active' => true,
            'password' => Hash::make('admin_root')
        ]);

        $user->roles()->attach($request->role_ids);
        $user->places()->attach($request->place_ids);

        $user->load('roles:id,name', 'places:id,name');

        return response()->json([
            'users'=> $user
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'username' => 'sometimes|string|max:50|unique:users,username,' . $user->id,
            'email' => 'sometimes|string|email|max:100|unique:users,email,' . $user->id,
            'phone_number' => 'nullable|string|max:20',
            'identification' => 'nullable|string|max:15',
            'roles' => 'sometimes|array',
            'roles.*.id' => 'exists:roles,id',
            'places' => 'sometimes|array',
            'places.*.id' => 'exists:places,id',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($validatedData);

        if ($request->has('roles')) {
            $user->roles()->sync(collect($validatedData['roles'])->pluck('id')->toArray());
        }

        if ($request->has('places')) {
            $user->places()->sync(collect($validatedData['places'])->pluck('id')->toArray());
        }

        $user->load('roles:id,name', 'places:id,name');

        return response()->json($user, 200);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
        ]);

        $users = User::whereIn('id', $request->ids)->get();

        foreach ($users as $user) {
            $user->update([
                'is_active' => false,
                'password'=> Hash::make('admin_root')]);
            $user->roles()->detach();
            $user->places()->detach();
        }

        return response()->json(null, 204);
    }

    public function updatePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $users = User::where('is_active', 1)
            ->when($query, function ($q) use ($query) {
                $q->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('last_name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%")
                        ->orWhereHas('roles', function ($q) use ($query) {
                            $q->where('name', 'like', "%{$query}%");
                        })
                        ->orWhereHas('places', function ($q) use ($query) {
                            $q->where('name', 'like', "%{$query}%");
                        });
                });
            })
            ->with(['roles:id,name', 'places:id,name'])
            ->get();

        return response()->json($users);
    }
}
