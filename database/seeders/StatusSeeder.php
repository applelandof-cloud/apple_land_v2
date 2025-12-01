<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('status')->insert([
            [
                'name' => 'RESERVADO',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'DISPONIBLE',
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
