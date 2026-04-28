<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. System Administrator
        User::create([
            'name'            => 'System Administrator',
            'username'        => 'admin',
            'email'           => 'admin@pos.com',
            'password'        => Hash::make('admin123'),
            'role'            => 'admin',
            'status'          => 'active',
            'is_locked'       => false, // Explicitly unlocked
            'failed_attempts' => 0,     // Fresh start
        ]);

        // 2. Store Supervisor
        User::create([
            'name'            => 'Store Supervisor',
            'username'        => 'supervisor',
            'email'           => 'supervisor@pos.com',
            'password'        => Hash::make('super123'),
            'role'            => 'supervisor',
            'status'          => 'active',
            'is_locked'       => false,
            'failed_attempts' => 0,
        ]);

        // 3. Cashier One
        User::create([
            'name'            => 'Cashier One',
            'username'        => 'cashier1',
            'email'           => 'cashier1@pos.com',
            'password'        => Hash::make('cashier123'),
            'role'            => 'cashier',
            'status'          => 'active',
            'is_locked'       => false,
            'failed_attempts' => 0,
        ]);
    }
}