<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PricesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('prices')->truncate();

        DB::table('prices')->insert([
            [
                'id' => 1,
                'value' => 1000,
                'currency_id' => 1,
            ],
            [
                'id' => 2,
                'value' => 800,
                'currency_id' => 1,
            ],
            [
                'id' => 3,
                'value' => 700,
                'currency_id' => 1,
            ],
            [
                'id' => 4,
                'value' => 1200,
                'currency_id' => 2,
            ],
            [
                'id' => 5,
                'value' => 1000,
                'currency_id' => 2,
            ],
            [
                'id' => 6,
                'value' => 900,
                'currency_id' => 2,
            ],
            // New prices for Product 3 (Currency 1)
            [
                'id' => 7,
                'value' => 1100,
                'currency_id' => 1,
            ],
            [
                'id' => 8,
                'value' => 900,
                'currency_id' => 1,
            ],
            [
                'id' => 9,
                'value' => 800,
                'currency_id' => 1,
            ],
            // New prices for Product 4 (Currency 2)
            [
                'id' => 10,
                'value' => 1300,
                'currency_id' => 2,
            ],
            [
                'id' => 11,
                'value' => 1100,
                'currency_id' => 2,
            ],
            [
                'id' => 12,
                'value' => 1000,
                'currency_id' => 2,
            ]
        ]);
    }
}
