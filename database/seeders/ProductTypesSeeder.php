<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_types')->truncate();
        DB::table('product_types')->insert([
            [
                'id' => 1,
                'name' => 'Dispositivo',
            ],
            [
                'id' => 2,
                'name' => 'Accesorio',
            ]
        ]);
    }
}