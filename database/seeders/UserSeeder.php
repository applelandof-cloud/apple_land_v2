<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user')->insert([
            [
                'name' => 'Ivo',
                'last_name' => 'Rojas',
                'email' => 'ivo@gmail.com',
                'username' => 'ivo',
                'password' => bcrypt('123456'),
                'identification' => '1234567890',
                'phone_number' => '77654321',
                'is_active' => true,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Ela',
                'last_name' => 'Ocana',
                'email' => 'ela@gmail.com',
                'username' => 'ela',
                'password' => bcrypt('123456'),
                'identification' => '0987654321',
                'phone_number' => '71234567',
                'is_active' => true,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Sonia',
                'last_name' => 'Veizaga',
                'email' => 'sonia@gmail.com',
                'username' => 'Sonia',
                'password' => bcrypt('123456'),
                'identification' => '0987654321',
                'phone_number' => '71234567',
                'is_active' => true,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
