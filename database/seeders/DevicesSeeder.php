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
                'imei' => '123456789012345',
                'imei2' => '123456789012346',
                'serial_number' => 'C02XF0N3JGH5',
                'storage' => 256,
                'status_id' => 1,
            ],
            [
                'imei' => '123456789012347',
                'imei2' => '123456789012348',
                'serial_number' => 'C02XF0N3JGH6',
                'storage' => 512,
                'status_id' => 1,
            ],
        ]);
    }
}