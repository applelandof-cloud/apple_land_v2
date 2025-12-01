<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceBatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('price_batch')->insert([
            [
                'batch_id' => 1,
                'value' => 1000,
                'currency_id' => 1,
                'exchange_rate_item_id' => 1,
            ],
            [
                'batch_id' => 2,
                'value' => 1200,
                'currency_id' => 1,
                'exchange_rate_item_id' => 1,
            ],
        ]);
    }
}