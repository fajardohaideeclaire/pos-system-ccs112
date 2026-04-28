<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'System Administrator',
            'username' => 'admin',
            'email'    => 'admin@pos.com',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        User::create([
            'name'     => 'Store Supervisor',
            'username' => 'supervisor',
            'email'    => 'supervisor@pos.com',
            'password' => Hash::make('super123'),
            'role'     => 'supervisor',
            'status'   => 'active',
        ]);

        User::create([
            'name'     => 'Cashier One',
            'username' => 'cashier1',
            'email'    => 'cashier1@pos.com',
            'password' => Hash::make('cashier123'),
            'role'     => 'cashier',
            'status'   => 'active',
        ]);
    }
}