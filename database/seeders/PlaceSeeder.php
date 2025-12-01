<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('place')->insert([
            [
                'name' => 'Central',
                'address' => 'Cala Cala',
                'is_active' => true
            ],
            [
                'name' => 'Paseo',
                'address' => 'America',
                'is_active' => true
            ],
            [
                'name' => 'Tarija',
                'address' => 'Tarija',
                'is_active' => true
            ],
            [
                'name' => 'Example',
                'address' => 'Examples',
                'is_active' => false
            ]
        ]);
    }
}
