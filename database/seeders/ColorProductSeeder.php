<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('color_product')->truncate();
        DB::table('color_product')->insert([
            // Samsung Note 8 (product_id: 1)
            [
                'product_id' => 1,
                'color_id' => 1, // Black
            ],
            [
                'product_id' => 1,
                'color_id' => 2, // White
            ],
            [
                'product_id' => 1,
                'color_id' => 5, // Space Gray
            ],

            // Samsung S23 Ultra (product_id: 2)
            [
                'product_id' => 2,
                'color_id' => 1, // Black
            ],
            [
                'product_id' => 2,
                'color_id' => 4, // Gold
            ],
            [
                'product_id' => 2,
                'color_id' => 12, // Purple
            ],

            // Samsung S24 (product_id: 3)
            [
                'product_id' => 3,
                'color_id' => 1, // Black
            ],
            [
                'product_id' => 3,
                'color_id' => 2, // White
            ],
            [
                'product_id' => 3,
                'color_id' => 3, // Silver
            ],
            [
                'product_id' => 3,
                'color_id' => 13, // Red
            ],

            // iPhone 15 (product_id: 4)
            [
                'product_id' => 4,
                'color_id' => 1, // Black
            ],
            [
                'product_id' => 4,
                'color_id' => 2, // White
            ],
            [
                'product_id' => 4,
                'color_id' => 5, // Space Gray
            ],
            [
                'product_id' => 4,
                'color_id' => 6, // Rose Gold
            ],
            [
                'product_id' => 4,
                'color_id' => 7, // Midnight Green
            ],
            [
                'product_id' => 4,
                'color_id' => 8, // Pacific Blue
            ],
            [
                'product_id' => 4,
                'color_id' => 9, // Graphite
            ],
            [
                'product_id' => 4,
                'color_id' => 10, // Sierra Blue
            ],
            [
                'product_id' => 4,
                'color_id' => 11, // Alpine Green
            ],
            [
                'product_id' => 4,
                'color_id' => 12, // Purple
            ],
            [
                'product_id' => 4,
                'color_id' => 13, // Red
            ],

            // Funda ipad
            [
                'product_id' => 5,
                'color_id' => 11, // Alpine Green
            ],
            [
                'product_id' => 5,
                'color_id' => 13, // Red
            ],
            
        ]);
    }
}