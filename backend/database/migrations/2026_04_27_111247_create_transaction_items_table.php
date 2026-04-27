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
            $table->foreignId('transaction_id')->constrained('transactions')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');

            // SNAPSHOT DATA (important for history)
            $table->string('product_name');
            $table->decimal('unit_price', 10, 2);

            // QUANTITY & TOTAL
            $table->integer('quantity');
            $table->decimal('subtotal', 10, 2);

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