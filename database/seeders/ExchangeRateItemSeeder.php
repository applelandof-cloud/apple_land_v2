<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExchangeRateItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('exchange_rate_items')->insert([
            [
                'exchange_rate_id' => 1,
                'value' => 1.2,
                'user_id' => 1,
                'deactivated_at' => null,
            ],
            [
                'exchange_rate_id' => 2,
                'value' => 0.8,
                'user_id' => 1,
                'deactivated_at' => null,
            ],
        ]);
    }
}