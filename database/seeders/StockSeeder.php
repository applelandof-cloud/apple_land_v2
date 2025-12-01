<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('stock')->insert([
            [
                'quantity' => 4,
                'batch_id' => 1,
                'place_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'quantity' => 5,
                'batch_id' => 2,
                'place_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'quantity' => 2,
                'batch_id' => 3,
                'place_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
