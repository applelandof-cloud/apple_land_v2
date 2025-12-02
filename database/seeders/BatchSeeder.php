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
        DB::table('batches')->insert([
            [
                'id'=> 1,
                'product_id' => 1,
                'entry_date' => Carbon::create(2023, 04, 07),
                'expiration_date' => Carbon::create(2025, 12, 07),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id'=> 2,
                'product_id' => 5,
                'entry_date' => Carbon::create(2022, 12, 14),
                'expiration_date' => Carbon::create(2025, 12, 07),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id'=> 3,
                'product_id' => 4,
                'entry_date' => Carbon::create(2024, 12, 23),
                'expiration_date' => Carbon::create(2025, 12, 07),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
