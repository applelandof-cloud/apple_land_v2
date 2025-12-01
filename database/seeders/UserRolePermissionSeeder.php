<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_role_permission')->insert([
            [
                'role_id' => 2,
                'user_id' => 1,
                'permission_id' => 1
            ],
            [
                'role_id' => 2,
                'user_id' => 2,
                'permission_id' => 1
            ],
            [
                'role_id' => 3,
                'user_id' => 3,
                'permission_id' => 1
            ],
            [
                'role_id' => 3,
                'user_id' => 3,
                'permission_id' => 2
            ],
            [
                'role_id' => 3,
                'user_id' => 3,
                'permission_id' => 3
            ]
        ]);
    }
}
