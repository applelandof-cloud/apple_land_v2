<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('currency')->insert([
            [
                'name' => 'bolivianos',
                'symbol' => 'Bs'
            ],
            [
                'name' => 'dolares',
                'symbol' => 'USD'
            ],
            [
                'name' => 'usdt',
                'symbol' => 'USDT'
            ]
        ]);
    }
}
