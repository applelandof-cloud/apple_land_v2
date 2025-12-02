<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->delete();
        User::create([
            'name' => 'Juan',
            'last_name' => 'Rojas',
            'username' => 'juan',
            'email' => 'juan@gmail.com',
            'password' => Hash::make('123456'),
            'identification' => '1234567890',
            'phone_number' => '77654321',
        ]);

        User::create([
            'name' => 'Ela',
            'last_name' => 'Ocana',
            'username' => 'ela',
            'email' => 'ela@gmail.com',
            'password' => Hash::make('123456'),
            'identification' => '0987654321',
            'phone_number' => '71234567',
        ]);

        User::create([
            'name' => 'Sonia',
            'last_name' => 'Veizaga',
            'username' => 'sonia',
            'email' => 'sonia@gmail.com',
            'password' => Hash::make('123456'),
            'identification' => '0987654322',
            'phone_number' => '71234567',
        ]);
    }
}
