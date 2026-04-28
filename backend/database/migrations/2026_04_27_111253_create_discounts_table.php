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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();

            // DISCOUNT INFO
            $table->string('name');
            $table->string('type')->unique(); // Slug-style: senior_citizen, pwd, promo_valantine
            
            // Percentage: 8 digits total, 2 after decimal (e.g., 20.00)
            $table->decimal('percentage', 8, 2)->default(0.00);
            
            // Added: Description for frontend tooltips or receipt notes
            $table->text('description')->nullable();

            // STATUS
            // Using boolean is perfect for the dynamic toggle in your React UI
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};