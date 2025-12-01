<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('batch')->insert([
            [
                'product_id' => 1,
                'entry_date' => now(),
                'expiration_date' => Carbon::create(2025, 12, 07),
                'unit_cost_batch' => 800, #moneda?
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'product_id' => 2,
                'entry_date' => now(),
                'expiration_date' => Carbon::create(2025, 12, 07),
                'unit_cost_batch' => 1000, #moneda?
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'product_id' => 3,
                'entry_date' => now(),
                'expiration_date' => Carbon::create(2025, 12, 07),
                'unit_cost_batch' => 1200, #moneda?
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
