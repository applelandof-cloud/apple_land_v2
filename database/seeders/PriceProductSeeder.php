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
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 1,
                'price_type_id' => 2,
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 1,
                'price_type_id' => 3,
                'value' => 99.99,
                'currency_id' => 1
            ],
            // Product 2 with prices from Currency 2
            [
                'product_id' => 2,
                'price_type_id' => 1,
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 2,
                'price_type_id' => 2,
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 2,
                'price_type_id' => 3,
                'value' => 99.99,
                'currency_id' => 1
            ],
            // Product 3 with prices from Currency 1
            [
                'product_id' => 3,
                'price_type_id' => 1,
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 3,
                'price_type_id' => 2,
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 3,
                'price_type_id' => 3,
                'value' => 99.99,
                'currency_id' => 1
            ],
            // Product 4 with prices from Currency 2
            [
                'product_id' => 4,
                'price_type_id' => 1,
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 4,
                'price_type_id' => 2,
                'value' => 99.99,
                'currency_id' => 1
            ],
            [
                'product_id' => 4,
                'price_type_id' => 3,
                'value' => 99.99,
                'currency_id' => 1
            ]
        ]);
    }
}