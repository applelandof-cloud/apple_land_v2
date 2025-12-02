<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('device_models')->truncate();
        DB::table('device_models')->insert([
            [
                'product_id' => 1,
                'model_number' => 'SM-G998',
                'sku' => 'note8',
                'sim' => 'SIM',
                'storage'=> '512GB',
            ],
            [
                'product_id' => 2,
                'model_number' => 'SM-S918',
                'sku' => 's23ultra',
                'sim' => 'eSIM',
                'storage'=> '128GB',

            ],
            [
                'product_id' => 3,
                'model_number' => 'SM-S921B',
                'sku' => 's24normal',
                'sim' => 'eSIM',
                'storage'=> '256GB',

            ],
            [
                'product_id' => 4,
                'model_number' => 'A3090',
                'sku' => 'O20332DQ4t',
                'sim' => 'eSIM',
                'storage'=> '512GB',

            ]

        ]);
    }
}