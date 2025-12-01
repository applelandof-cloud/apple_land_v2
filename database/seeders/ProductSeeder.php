<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product')->insert([
            [
                'name' => 'Samsung note 8',
                'model_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Samsung s23ultra',
                'model_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Samsung S24',
                'model_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
