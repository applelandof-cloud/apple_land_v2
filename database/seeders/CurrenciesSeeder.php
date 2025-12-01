<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrenciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('currencies')->truncate();
        DB::table('currencies')->insert([
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