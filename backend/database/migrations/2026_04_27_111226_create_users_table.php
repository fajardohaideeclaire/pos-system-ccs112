<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // USER INFO
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');

            // ROLE & STATUS
            $table->enum('role', ['cashier', 'supervisor', 'admin'])->default('cashier');
            $table->enum('status', ['active', 'inactive'])->default('active');

            // SECURITY
            $table->integer('failed_attempts')->default(0);
            $table->boolean('is_locked')->default(false);

            // LARAVEL AUTH
            $table->rememberToken();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};