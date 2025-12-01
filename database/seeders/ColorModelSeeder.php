<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('color_model')->insert([
            [
                'color_id' => 1,
                'model_id' => 1
            ],
            [
                'color_id' => 1,
                'model_id' => 2
            ],
            [
                'color_id' => 1,
                'model_id' => 3
            ],
            [
                'color_id' => 2,
                'model_id' => 3
            ]
        ]);
    }
}
