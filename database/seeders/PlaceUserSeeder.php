<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlaceUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('place_user')->insert([
            [
                'place_id' => 1,
                'user_id' => 1
            ],
            [
                'place_id' => 1,
                'user_id' => 2
            ],
            [
                'place_id' => 1,
                'user_id' => 3
            ],
            [
                'place_id' => 2,
                'user_id' => 3
            ],
            [
                'place_id' => 3,
                'user_id' => 3
            ]
        ]);
    }
}
