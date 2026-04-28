<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Discount;

class DiscountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $discounts = [
            ['name' => 'Senior Citizen',              'type' => 'senior_citizen', 'percentage' => 20.00],
            ['name' => 'Person With Disability (PWD)','type' => 'pwd',            'percentage' => 20.00],
            ['name' => 'Athlete',                     'type' => 'athlete',        'percentage' => 10.00],
            ['name' => 'Solo Parent',                 'type' => 'solo_parent',    'percentage' => 10.00],
        ];

        foreach ($discounts as $d) {
            Discount::create($d);
        }
    }
}