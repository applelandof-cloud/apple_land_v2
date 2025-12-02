<?php

namespace Database\Seeders;

use App\Models\Inventory; // Import the Inventory model
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("stocks")->insert([
            [
                'is_gift' => false,
                'is_visible' => true,
                'color_id' => 1,
                'status_id' => 2,
                'inventory_id' => 1,
                'batch_id' => 1,
                'product_id' => 1,
                'place_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'is_gift' => false,
                'is_visible' => true,
                'color_id' => 3,
                'status_id' => 3,
                'inventory_id' => 1,
                'batch_id' => 1,
                'product_id' => 1,
                'place_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'is_gift' => false,
                'is_visible' => true,
                'color_id' => 7,
                'status_id' => 1,
                'inventory_id' => 1,
                'batch_id' => 1,
                'product_id' => 1,
                'place_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'is_gift' => false,
                'is_visible' => true,
                'color_id' => 10,
                'status_id' => 2,
                'inventory_id' => 2,
                'batch_id' => 2,
                'product_id' => 2,
                'place_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],[
                'is_gift' => true,
                'is_visible' => true,
                'color_id' => 11,
                'status_id' => 1,
                'inventory_id' => 2,
                'batch_id' => 2,
                'product_id' => 2,
                'place_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

    }
}