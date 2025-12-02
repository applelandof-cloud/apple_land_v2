<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function switchRole(Request $request, User $user, Role $role)
    {
        $user->active_role = $role->name;
        $user->save();

        session(['active_role' => $role->name]);

        return response()->json(Null, 204);
    }
}
