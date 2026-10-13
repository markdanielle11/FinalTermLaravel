<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // permissions
        $permissions = [
            'view products',
            'create products',
            'edit products',
            'delete products',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
            ]);
        }

        // roles
        $admin = Role::firstOrCreate([
            'name' => 'admin',
        ]);

        $user = Role::firstOrCreate([
            'name' => 'user',
        ]);

        // Admin gets all permissions
        $admin->givePermissionTo($permissions);

        // User can only view Products
        $user->givePermissionTo([
            'view products',
        ]);
    }
}