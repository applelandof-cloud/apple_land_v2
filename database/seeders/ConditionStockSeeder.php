<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConditionStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('condition_stock')->truncate();

        DB::table('condition_stock')->insert([
            [
                'condition_id' => 1,
                'stock_id' => 1,
                'description'=> 'Buen estado',
            ],
            [
                'condition_id' => 2,
                'stock_id' => 2,
                'description'=> 'Poca batería',

            ],
        ]);
    }
}