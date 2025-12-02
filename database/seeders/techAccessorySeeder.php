<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TechAccessorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tech_accessories')->truncate();
        DB::table('tech_accessories')->insert([
            [
                'product_id' => 5,
                'model_number' => 'A1a21ddw',
                'size' => '20cm',
                'description' => 'Accesorio de funda para tablet',
            ],
        ]);
    }
}