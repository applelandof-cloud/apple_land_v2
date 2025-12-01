<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('model')->insert([
            [
                'model_number' => 'SM-N950',
                'sku' => 'note8',
                'name' => 'Samsung note 8',
                'image_url' => null,
                'maker_id' => 2,
                'type_sim' => 'SIM',
                'type_id' => 2
            ],
            [
                'model_number' => 'SM-S918',
                'sku' => 's23ultra',
                'name' => 'Samsung S23ultra',
                'image_url' => null,
                'maker_id' => 2,
                'type_sim' => 'eSIM',
                'type_id' => 2
            ],
            [
                'model_number' => 'SM-S921B',
                'sku' => 's24normal',
                'name' => 'Samsung S24',
                'image_url' => null,
                'maker_id' => 2,
                'type_sim' => 'eSIM',
                'type_id' => 2
            ]
        ]);
    }
}
