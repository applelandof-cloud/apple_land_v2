<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExchangeRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('exchange_rates')->insert([
            [
                'origin_currency_id' => 1,
                'destiny_currency_id' => 2,
            ],
            [
                'origin_currency_id' => 2,
                'destiny_currency_id' => 1,
            ],
        ]);
    }
}