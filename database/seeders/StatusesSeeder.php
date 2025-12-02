<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class StatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('statuses')->truncate();

        DB::table('statuses')->insert([
            [
                'name' => 'DISPONIBLE',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'RESERVADO',
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'name' => 'VENDIDO',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
