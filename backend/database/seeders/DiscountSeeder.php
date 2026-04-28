<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Discount; // Ensure this model exists!

class DiscountSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing to avoid duplicates during testing
        Discount::truncate(); 

        Discount::create([
            'name' => 'Senior Citizen',
            'type' => 'senior_citizen',
            'percentage' => 20,
            'is_active' => true
        ]);

        Discount::create([
            'name' => 'PWD',
            'type' => 'pwd',
            'percentage' => 20,
            'is_active' => true
        ]);

        Discount::create([
            'name' => 'Student',
            'type' => 'student',
            'percentage' => 10,
            'is_active' => true
        ]);
    }
}