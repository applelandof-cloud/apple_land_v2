<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('type')->insert([
            [
                'name' => 'ACCESORIO'
            ],
            [
                'name' => 'DISPOSITIVO'
            ]
        ]);
    }
}
