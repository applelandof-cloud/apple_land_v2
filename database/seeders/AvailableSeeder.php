<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class AvailableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('available')->insert([
            [
                'imei' => '123456789012345',
                'imei2' => '543210987654321',
                'serial_number' => 'SN1234567890',
                'color' => 'Negro',
                'is_gift' => false,
                'is_visible' => true,
                'storage' => '128GB',
                'productID' => 1,
                'status_id' => 2,
                'stock_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null
            ],
            [
                'imei' => null,
                'imei2' => null,
                'serial_number' => null,
                'color' => 'Negro',
                'is_gift' => true,
                'is_visible' => true,
                'storage' => null,
                'productID' => 2,
                'status_id' => 2,
                'stock_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null
            ],
            [
                'imei' => null,
                'imei2' => null,
                'serial_number' => 'SN1234567890',
                'color' => null,
                'is_gift' => false,
                'is_visible' => true,
                'storage' => null,
                'productID' => 3,
                'status_id' => 2,
                'stock_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null
            ]
        ]);
    }
}
