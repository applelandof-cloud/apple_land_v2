<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear the table before seeding
        DB::table('roles')->delete();
        DB::table('roles')->truncate();

        DB::table('roles')->insert([
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
            ],
            [
                'name' => 'cliente_externo',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'vendedor_externo',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'visitante_externo',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}