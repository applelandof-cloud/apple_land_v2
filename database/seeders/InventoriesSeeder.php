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
                'count' => 3,
            ],
            [
                'id' => 2,
                'product_id' => 5,
                'batch_id' => 2,
                'place_id' => 3,
                'count' => 1,
            ],
            [
                'id' => 3,
                'product_id' => 4,
                'batch_id' => 3,
                'place_id' => 2,
                'count' => 2,
            ],

        ]);
    }
}