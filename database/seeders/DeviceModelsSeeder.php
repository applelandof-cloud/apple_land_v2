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
            ],
            [
                'product_id' => 2,
                'model_number' => 'SM-S918',
                'sku' => 's23ultra',
                'sim' => 'eSIM',
            ],
            [
                'product_id' => 3,
                'model_number' => 'SM-S921B',
                'sku' => 's24normal',
                'sim' => 'eSIM',
            ]
        ]);
    }
}