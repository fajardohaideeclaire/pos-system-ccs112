<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('name');
            $table->enum('role', ['admin', 'supervisor', 'cashier'])->default('cashier');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('failed_attempts')->default(0);
            $table->boolean('is_locked')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'role',
                'status',
                'failed_attempts',
                'is_locked'
            ]);
        });
    }
};