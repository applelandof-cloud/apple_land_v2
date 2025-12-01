<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('device_stock')->insert([
            [
                'device_id' => 1,
                'stock_id' => 1,
            ],
            [
                'device_id' => 2,
                'stock_id' => 2,
            ],
            [
                'device_id' => 3, // Assuming device_id 3 exists
                'stock_id' => 3,
            ],
            [
                'device_id' => 4, // Assuming device_id 4 exists
                'stock_id' => 4,
            ],
        ]);
    }
}