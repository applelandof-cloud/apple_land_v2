<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RolePermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$permissions
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();
        $userActiveRole = $user->active_role;

        if (!$userActiveRole) {
            abort(403, 'Your account does not have an active role.');
        }

        $userRoles = $user->roles->keyBy('name');

        if (!$userRoles->has($userActiveRole)) {
            abort(403, 'Your active role is not assigned to your account.');
        }

        $role = $userRoles->get($userActiveRole);

        if (!$role) {
            abort(403, 'The selected role does not exist.');
        }

        $rolePermissions = $role->permissions->pluck('name')->toArray();

        foreach ($permissions as $permission) {
            if (in_array($permission, $rolePermissions)) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized action.');
    }
}

