<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('price_product')->truncate();
        DB::table('price_product')->insert([
            // Product 1 with prices from Currency 1
            [
                'product_id' => 1,
                'price_type_id' => 1,
                'value' => 1200,
                'currency_id' => 2
            ],
            [
                'product_id' => 1,
                'price_type_id' => 2,
                'value' => 1400,
                'currency_id' => 2
            ],
            [
                'product_id' => 1,
                'price_type_id' => 3,
                'value' => 1250,
                'currency_id' => 2
            ],
            // Product 2 with prices from Currency 2
            [
                'product_id' => 2,
                'price_type_id' => 1,
                'value' => 600,
                'currency_id' => 3
            ],
            [
                'product_id' => 2,
                'price_type_id' => 2,
                'value' => 800,
                'currency_id' => 3
            ],
            [
                'product_id' => 2,
                'price_type_id' => 3,
                'value' => 760,
                'currency_id' => 3
            ],
            // Product 3 with prices from Currency 1
            [
                'product_id' => 3,
                'price_type_id' => 1,
                'value' => 11100,
                'currency_id' => 1
            ],
            [
                'product_id' => 3,
                'price_type_id' => 2,
                'value' => 11400,
                'currency_id' => 1
            ],
            [
                'product_id' => 3,
                'price_type_id' => 3,
                'value' => 11340,
                'currency_id' => 1
            ],
            // Product 4 with prices from Currency 2
            [
                'product_id' => 4,
                'price_type_id' => 1,
                'value' => 1340,
                'currency_id' => 2
            ],
            [
                'product_id' => 4,
                'price_type_id' => 2,
                'value' => 1500,
                'currency_id' => 2
            ],
            [
                'product_id' => 4,
                'price_type_id' => 3,
                'value' => 1430.50,
                'currency_id' => 2
            ],
            // Product 4 with prices from Currency 2
            [
                'product_id' => 5,
                'price_type_id' => 1,
                'value' => 25,
                'currency_id' => 2
            ],
            [
                'product_id' => 5,
                'price_type_id' => 2,
                'value' => 35,
                'currency_id' => 2
            ],
            [
                'product_id' => 5,
                'price_type_id' => 3,
                'value' => 30,
                'currency_id' => 2
            ]
        ]);
    }
}