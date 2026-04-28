<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionItem extends Model
{
    /**
     * The attributes that are mass assignable.
     * @var array
     */
    protected $fillable = [
        'transaction_id',
        'product_id',
        'product_name',
        'unit_price',
        'quantity',
        'subtotal',
        'is_voided',
    ];

    /**
     * The attributes that should be cast.
     * Ensures line-item financials are precise and the void status is a boolean.
     */
    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'quantity' => 'integer',
        'is_voided' => 'boolean',
    ];

    /**
     * Relationship: The parent transaction this line item belongs to.
     * @return BelongsTo
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Relationship: The original product (useful for stock movement reports).
     * @return BelongsTo
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}