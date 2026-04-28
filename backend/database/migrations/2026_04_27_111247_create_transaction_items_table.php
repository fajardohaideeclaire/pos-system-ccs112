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
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();

            // RELATIONSHIPS
            // If the transaction is deleted, the items go with it.
            $table->foreignId('transaction_id')->constrained('transactions')->cascadeOnDelete();
            
            // CHANGE: Use nullOnDelete. If a product is deleted, the sales record stays.
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();

            // SNAPSHOT DATA (The most important part of this model)
            $table->string('product_name');
            $table->decimal('unit_price', 12, 2); // Increased precision to match Transactions

            // QUANTITY & TOTAL
            $table->integer('quantity');
            $table->decimal('subtotal', 12, 2);

            // VOID CONTROL (per item)
            $table->boolean('is_voided')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};