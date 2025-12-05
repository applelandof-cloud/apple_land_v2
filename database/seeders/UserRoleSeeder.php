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
        $userRolesMap = [
            'sonia' => ['owner', 'admin', 'seller'],
            'ela' => ['seller'],
        ];

        $roles = DB::table('roles')->pluck('id', 'name')->all();

        $users = User::whereIn('username', array_keys($userRolesMap))->get()->keyBy('username');

        $userRoleInserts = [];

        foreach ($userRolesMap as $username => $userRoleNames) {
            if (!isset($users[$username])) {
                $this->command->warn("UserRoleSeeder: User '{$username}' not found. Skipping.");
                continue;
            }
            $userId = $users[$username]->id;

            DB::table('user_role')->where('user_id', $userId)->delete();

            foreach ($userRoleNames as $roleName) {
                if (!isset($roles[$roleName])) {
                    $this->command->warn("UserRoleSeeder: Role '{$roleName}' not found. Skipping for user '{$username}'.");
                    continue;
                }
                $roleId = $roles[$roleName];

                $userRoleInserts[] = [
                    'user_id' => $userId,
                    'role_id' => $roleId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($userRoleInserts)) {
            DB::table('user_role')->insert($userRoleInserts);
            $this->command->info('UserRoleSeeder: Roles assigned successfully.');
        } else {
            $this->command->info('UserRoleSeeder: No roles to assign.');
        }
    }
}