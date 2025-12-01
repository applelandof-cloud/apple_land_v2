<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('username', 'sonia')->first();

        $roles = DB::table('roles')->pluck('id', 'name');

        $userRoles = [
            $roles['owner'] ?? null,
            $roles['admin'] ?? null,
            $roles['vendedor'] ?? null,
        ];

        $userRoles = array_filter($userRoles);

        foreach ($userRoles as $roleId) {
            DB::table('user_role')->insert([
                'user_id' => $user->id,
                'role_id' => $roleId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('UserRoleSeeder: Roles assigned to user "juan".');
    }
}