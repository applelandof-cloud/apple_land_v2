<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('price_types')->truncate();
        DB::table('price_types')->insert([
            [
                'name' => 'Costo Unitario'
            ],
            [
                'name' => 'Precio Unitario'
            ],
            [
                'name' => 'Precio por Mayor'
            ]
        ]);
    }
}