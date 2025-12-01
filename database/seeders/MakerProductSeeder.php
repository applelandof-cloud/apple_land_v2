<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MakerProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('maker_product')->truncate();
        DB::table('maker_product')->insert([
            [
                'maker_id' => 2,
                'product_id' => 1,
            ],
            [
                'maker_id' => 2,
                'product_id' => 2,
            ],
            [
                'maker_id' => 2,
                'product_id' => 3,
            ],
            [
                'maker_id' => 1,
                'product_id' => 4,
            ],
        ]);
    }
}