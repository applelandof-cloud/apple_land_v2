<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MakerSeeder::class,
            ColorSeeder::class,
            TypeSeeder::class,
            ModelSeeder::class,
            UserSeeder::class,
            RoleSeeder::class,
            PermissionSeeder::class,
            UserRolePermissionSeeder::class
        ]);
    }
}
