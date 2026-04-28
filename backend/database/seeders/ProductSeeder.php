<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get the admin user ID to assign as the creator
        $adminId = User::where('role', 'admin')->first()->id ?? 1;

        $products = [
            [
                'name' => 'Coca-Cola 1.5L',
                'barcode' => '4800012345678',
                'price' => 65.00,
                'stock_quantity' => 50,
                'status' => 'active',
                'created_by' => $adminId
            ],
            [
                'name' => 'Gardenia White Bread',
                'barcode' => '4800087654321',
                'price' => 72.50,
                'stock_quantity' => 20,
                'status' => 'active',
                'created_by' => $adminId
            ],
            [
                'name' => 'Lucky Me Instant Noodles',
                'barcode' => '4800011122233',
                'price' => 15.75,
                'stock_quantity' => 100,
                'status' => 'active',
                'created_by' => $adminId
            ],
            [
                'name' => 'Kopiko Lucky Day',
                'barcode' => '4800044455566',
                'price' => 25.00,
                'stock_quantity' => 5, // Low stock to test dashboard warnings
                'status' => 'active',
                'created_by' => $adminId
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['barcode' => $product['barcode']], $product);
        }
    }
}