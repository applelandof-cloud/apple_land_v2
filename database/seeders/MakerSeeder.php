<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MakerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('makers')->truncate();
        DB::table('makers')->insert([
            [
                'name' => 'APPLE',
                'origin' => 'USA'
            ],
            [
                'name' => 'SAMSUNG',
                'origin' => 'South Korea'
            ]
        ]);
    }
}