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
            // Change: nullOnDelete prevents deleting the evidence if a user is removed.
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            // ACTION DETAILS
            $table->string('action');      // e.g. LOGIN, LOGOUT, CREATE, UPDATE, VOID
            $table->string('module');      // e.g. inventory, sales, settings
            $table->text('description');

            // DATA CHANGES (Store as JSON for deep tracking)
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();

            // EXTRA INFO
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable(); // Added: Tracks browser/device used

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