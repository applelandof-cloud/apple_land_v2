<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('role_permission')->delete();

        $roles = DB::table('roles')->pluck('id', 'name');
        $permissions = DB::table('permissions')->pluck('id', 'name');

        $rolePermission = [
            'owner' => [
                'ver_dashboard',
                'ver_sucursales',
                'crear_sucursales',
                'editar_sucursales',
                'eliminar_sucursales',
                'ver_productos',
                'crear_ventas',
                'editar_ventas',
                'gestionar_usuarios',
                'ver_reportes',
                'crear_usuarios',
                'update_usuarios',
                'eliminar_usuarios',
                'reset_password',
                'ver_productos_admin',
                'ver_ventas_admin',
                'ver_inventario_vendedor',
                'ver_pagina_vendedor',
            ],
            'admin' => [
                'ver_dashboard',
                'ver_productos',
                'ver_productos_admin',
                'ver_ventas_admin',
            ],
            'seller' => [
                'ver_dashboard',
                'ver_productos',
                'ver_inventario_vendedor',
                'ver_pagina_vendedor',
            ],
            'external_client' => [
                'ver_productos',
            ],
            'external_seller' => [
                'ver_productos',
            ],
            'external_visitor' => [
                'ver_productos',
            ],
        ];

        foreach ($rolePermission as $roleName => $permissionNames) {
            $roleId = $roles[$roleName] ?? null;

            if (!$roleId) {
                $this->command->warn("Role '{$roleName}' not found, skipping...");
                continue;
            }

            foreach ($permissionNames as $permName) {
                $permId = $permissions[$permName] ?? null;
                if (!$permId) {
                    $this->command->warn("Permission '{$permName}' not found, skipping...");
                    continue;
                }

                DB::table('role_permission')->insert([
                    'role_id' => $roleId,
                    'permission_id' => $permId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('RolesPermissionSeeder: roles–permissions associations seeded successfully.');
    }
}
