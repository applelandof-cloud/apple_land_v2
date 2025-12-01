<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('role')->insert([
            [
                'name' => 'vendedor',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'admin',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'owner',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
