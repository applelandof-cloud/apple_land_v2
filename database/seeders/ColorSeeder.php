<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('color')->insert([
            [
                'name' => 'rojo',
                'hex_code' => '#FF0000'
            ],
            [
                'name' => 'amarillo',
                'hex_code' => '#FFFF00'
            ],
            [
                'name' => 'azul',
                'hex_code' => '#0000FF'
            ]
        ]);
    }
}
