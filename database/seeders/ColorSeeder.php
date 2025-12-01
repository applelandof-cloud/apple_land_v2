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
        DB::table('colors')->truncate();
        DB::table('colors')->insert([
            [
                'name' => 'Negro',
                'hex_code' => '#000000'
            ],
            [
                'name' => 'Blanco',
                'hex_code' => '#FFFFFF'
            ],
            [
                'name' => 'Plata',
                'hex_code' => '#C0C0C0'
            ],
            [
                'name' => 'Oro',
                'hex_code' => '#FFD700'
            ],
            [
                'name' => 'Gris Espacial',
                'hex_code' => '#505050'
            ],
            [
                'name' => 'Oro Rosa',
                'hex_code' => '#B76E79'
            ],
            [
                'name' => 'Verde Medianoche',
                'hex_code' => '#3A4F4A'
            ],
            [
                'name' => 'Azul Pacífico',
                'hex_code' => '#36454F'
            ],
            [
                'name' => 'Grafito',
                'hex_code' => '#383838'
            ],
            [
                'name' => 'Azul Sierra',
                'hex_code' => '#6EB0E6'
            ],
            [
                'name' => 'Verde Alpino',
                'hex_code' => '#2C5F2D'
            ],
            [
                'name' => 'Morado',
                'hex_code' => '#800080'
            ],
            [
                'name' => 'Rojo',
                'hex_code' => '#FF0000'
            ],
        ]);
    }
}