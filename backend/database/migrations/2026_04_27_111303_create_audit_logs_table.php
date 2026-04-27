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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // USER REFERENCE
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // ACTION DETAILS
            $table->string('action');      // e.g. CREATE, UPDATE, DELETE, LOGIN
            $table->string('module');      // e.g. products, transactions, users
            $table->text('description');

            // DATA CHANGES
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();

            // EXTRA INFO
            $table->string('ip_address')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};