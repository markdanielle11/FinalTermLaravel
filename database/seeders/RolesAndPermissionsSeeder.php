<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Admin   - everything, including user management.
     * Manager - full CRUD on products, categories, suppliers, plus stock.
     * Staff   - view only, plus stock in/out (same as the old "staff" role
     *           that could only update quantity).
     */
    public function run(): void
    {
        // Spatie caches roles/permissions; clear it before changing them.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'view dashboard',

            'view products',
            'create products',
            'edit products',
            'delete products',

            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            'view suppliers',
            'create suppliers',
            'edit suppliers',
            'delete suppliers',

            'adjust stock',
            'view stock movements',

            'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // DatabaseSeeder runs WithoutModelEvents, so Spatie's automatic
        // cache reset after creating permissions does not fire. Reset it
        // manually so the new permissions can be found below.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $admin = Role::findOrCreate('Admin', 'web');
        $manager = Role::findOrCreate('Manager', 'web');
        $staff = Role::findOrCreate('Staff', 'web');

        $admin->syncPermissions($permissions);

        $manager->syncPermissions(array_values(array_diff($permissions, ['manage users'])));

        $staff->syncPermissions([
            'view dashboard',
            'view products',
            'view categories',
            'view suppliers',
            'adjust stock',
            'view stock movements',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
