<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('category_stock')->insert([
            [
                'category_id' => 1,
                'stock_id' => 1,
            ],
            [
                'category_id' => 2,
                'stock_id' => 2,
            ],
        ]);
    }
}