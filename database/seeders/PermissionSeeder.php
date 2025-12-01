<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('permission')->insert([
            [
                'name' => 'create_user',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'edit_user',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'delete_user',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'view_reports',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'manage_settings',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
