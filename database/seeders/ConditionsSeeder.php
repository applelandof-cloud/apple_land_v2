<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConditionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('conditions')->insert([
            ['name' => 'New'],
            ['name' => 'Used'],
            ['name' => 'Refurbished'],
        ]);
    }
}