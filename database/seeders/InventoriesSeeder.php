<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('inventories')->insert([
            [
                'id' => 1,                
                'product_id' => 1,
                'batch_id' => 1,
                'place_id' => 1,
                'count' => 2, // Two stocks for this combination
            ],
            [
                'id' => 2,
                'product_id' => 2,
                'batch_id' => 2,
                'place_id' => 2,
                'count' => 1, // One stock for this combination
            ]
        ]);
    }
}