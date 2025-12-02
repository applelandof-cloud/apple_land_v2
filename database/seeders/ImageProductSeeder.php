<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('image_product')->truncate();
        DB::table('image_product')->insert([
            [
                'image_id' => 1,
                'product_id' => 1,
            ],
            [
                'image_id' => 2,
                'product_id' => 2,
            ],
            [
                'image_id' => 3,
                'product_id' => 3,
            ],
            [
                'image_id' => 4,
                'product_id' => 4,
            ],
            [
                'image_id' => 5,
                'product_id' => 5,
            ],
        ]);
    }
}