<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('price_stock')->insert([
            [
                'stock_id' => 1,
                'price_id' => 1,
                'value' => 1200,
                'currency_id' => 1,
            ],
            [
                'stock_id' => 2,
                'price_id' => 1,
                'value' => 1400,
                'currency_id' => 1,
            ],
        ]);
    }
}