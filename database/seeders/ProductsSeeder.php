<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->truncate();
        DB::table('products')->insert([
            [
                'id' => 1,
                'name' => 'Samsung note 8',
                'is_active' => true,
                'product_type_id' => 1,
                'maker_id' => 2, // Samsung
            ],
            [
                'id' => 2,
                'name' => 'Samsung s23ultra',
                'is_active' => true,
                'product_type_id' => 1,
                'maker_id' => 2, // Samsung
            ],
            [
                'id' => 3,
                'name' => 'Samsung S24',
                'is_active' => true,
                'product_type_id' => 1,
                'maker_id' => 2, // Samsung
            ],
            [
                'id' => 4,
                'name' => 'iPhone 15',
                'is_active' => true,
                'product_type_id' => 1,
                'maker_id' => 1, // Apple
            ],
            [
                'id' => 5,
                'name' => 'Funda para Ipad',
                'is_active' => true,
                'product_type_id' => 2,
                'maker_id' => 1, // Apple, assuming it's for Apple iPad
            ]
        ]);
    }
}