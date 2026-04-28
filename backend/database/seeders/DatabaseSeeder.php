<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,     // 1. Create Staff (Admin/Cashier)
            DiscountSeeder::class, // 2. Create Discount Types (Senior/PWD)
            ProductSeeder::class,  // 3. Create Inventory Items
        ]);
    }
}