<?php

namespace App\Http\Controllers;

use App\Models\Place;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $users = User::with([
                        'roles:id,name',
                        'places:id,name'
                    ])->get();

        $roles = Role::where('is_active', 1)->get();
        $places = Place::where('is_active', 1)->get();

        return Inertia::render('staff', [
            'users' => $users,
            'roles' => $roles,
            'places' => $places
        ]);
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
            'password' => 'required|string|min:8|max:100',
            'role_id' => 'required|exists:roles,id',
            'place_id' => 'required|exists:places,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'identification' => $request->identification,
            'phone_number' => $request->phone_number,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $user->roles()->attach($request->role_id);
        $user->places()->attach($request->place_id);

        return redirect()->route('staff');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'roles' => 'required|array',
            'roles.*.id' => 'required|exists:roles,id',
            'places' => 'required|array',
            'is_active' => 'boolean',
        ]);

        $user->update([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'is_active' => $request->is_active,
        ]);

        $user->roles()->sync(collect($request->roles)->pluck('id')->toArray());
        $user->places()->sync([$request->places[0]['id']]);

        return redirect()->route('staff');
    }
}
