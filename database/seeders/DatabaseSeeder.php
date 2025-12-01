<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->call([
            PlacesSeeder::class,
            UsersSeeder::class,
            RolesSeeder::class,
            PermissionsSeeder::class,
            UserRoleSeeder::class,
            RolePermissionSeeder::class,
            PlaceUserSeeder::class,
            MakerSeeder::class,
            ColorSeeder::class,
            ProductsSeeder::class,
            ProductTypesSeeder::class,
            DeviceModelsSeeder::class,
            CurrenciesSeeder::class,
            PriceTypesSeeder::class,
            PricesSeeder::class,
            PriceProductSeeder::class,
            ColorProductSeeder::class,
            MakerProductSeeder::class,
            ImageSeeder::class,
            ImageProductSeeder::class,
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}