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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // PRODUCT INFO
            $table->string('name');
            // Change: Nullable barcode to prevent crashes on non-barcoded items
            $table->string('barcode')->nullable()->unique(); 
            $table->decimal('price', 10, 2)->default(0.00);
            $table->integer('stock_quantity')->default(0);

            // STATUS
            $table->enum('status', ['active', 'inactive'])->default('active');

            // TRACKING (USER REFERENCES)
            // Change: Use nullOnDelete so product history stays even if a user is deleted
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};