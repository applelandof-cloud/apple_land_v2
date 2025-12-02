<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DevicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('devices')->insert([
            [
                'stock_id'=> 1,
                'imei' => '123456789012345',
                'imei2' => '123456789012346',
                'serial_number' => 'C02XF0N3JGH5',
                'storage' => 256,
                // 'status_id' => 1,
            ],
            [
                'stock_id'=> 2,
                'imei' => '123456789012347',
                'imei2' => '123456789012348',
                'serial_number' => 'C02XF0N3JGH6',
                'storage' => 512,
                // 'status_id' => 1,
            ],
            [
                'stock_id'=> 3,
                'imei' => '11111111111',
                'imei2' => '11111111111a',
                'serial_number' => 'C02XF0N3JGH7',
                'storage' => 512,
                // 'status_id' => 1,
            ],
            [
                'stock_id'=> 4,
                'imei' => '222222222222',
                'imei2' => '222222222222b',
                'serial_number' => 'C02XF0N3JGH8',
                'storage' => 512,
                // 'status_id' => 1,
            ],
            [
                'stock_id'=> 5,
                'imei' => '3333333333333',
                'imei2' => '3333333333333c',
                'serial_number' => 'C02XF0N3JGH9',
                'storage' => 512,
                // 'status_id' => 1,
            ],
        ]);
    }
}