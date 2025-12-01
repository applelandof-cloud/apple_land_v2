<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlacesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('places')->insert([
            [
                'name' => 'Central',
                'address' => 'Cala Cala',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Paseo',
                'address' => 'America',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Tarija',
                'address' => 'Tarija',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}