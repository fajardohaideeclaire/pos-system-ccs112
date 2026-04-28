<?php

namespace Database\Seeders;

<<<<<<< HEAD
=======
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
>>>>>>> fc86e44 (feat: initial project structure, migrations, auth backend + React frontend scaffold)
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
<<<<<<< HEAD
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            DiscountSeeder::class,
        ]);
    }
}
=======
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
>>>>>>> fc86e44 (feat: initial project structure, migrations, auth backend + React frontend scaffold)
