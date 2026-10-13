<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Demo accounts (password for all: "password"):
     *   admin@example.com   - Admin
     *   manager@example.com - Manager
     *   staff@example.com   - Staff
     */
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        $accounts = [
            ['Admin User', 'admin@example.com', 'Admin'],
            ['Manager User', 'manager@example.com', 'Manager'],
            ['Staff User', 'staff@example.com', 'Staff'],
        ];

        foreach ($accounts as [$name, $email, $role]) {
            User::factory()
                ->create(['name' => $name, 'email' => $email])
                ->assignRole($role);
        }

        $this->call(InventorySeeder::class);
    }
}
