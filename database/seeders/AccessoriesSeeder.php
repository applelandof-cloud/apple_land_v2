<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccessoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('accessories')->insert([
            [
                'stock_id'=> 3,
                'serial_number' => '11111111111',
                'size' => '13"',
                'description' => 'Accesorio de funda para tablet',
            ],
            
        ]);
    }
}