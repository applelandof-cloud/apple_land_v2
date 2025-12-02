<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('permissions')->insert([
            [
                'module' => 'Dashboard',
                'name' => 'ver_dashboard',
                'description' => 'Permitir ver el panel de control',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Sucursales',
                'name' => 'ver_sucursales',
                'description' => 'Permitir ver las sucursales',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Sucursales',
                'name' => 'crear_sucursales',
                'description' => 'Permitir crear sucursales',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Sucursales',
                'name' => 'editar_sucursales',
                'description' => 'Permitir editar sucursales',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Sucursales',
                'name' => 'eliminar_sucursales',
                'description' => 'Permitir eliminar sucursales',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Productos',
                'name' => 'ver_productos',
                'description' => 'Permitir eliminar sucursales',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Ventas',
                'name' => 'crear_ventas',
                'description' => 'Permitir crear nueva venta',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Ventas',
                'name' => 'editar_ventas',
                'description' => 'Permitir editar ventas',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Usuarios',
                'name' => 'gestionar_usuarios',
                'description' => 'Permitir gestionar usuarios del sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Reportes',
                'name' => 'ver_reportes',
                'description' => 'Permitir ver reportes del sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Usuarios',
                'name' => 'crear_usuarios',
                'description' => 'Permitir crear nuevos usuarios',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Usuarios',
                'name' => 'update_usuarios',
                'description' => 'Permitir modificar usuarios existentes',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Usuarios',
                'name' => 'eliminar_usuarios',
                'description' => 'Permitir eliminar usuarios del sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'module' => 'Settings',
                'name' => 'reset_password',
                'description' => 'Permitir cambiar el Password',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}