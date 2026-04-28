<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'transaction_number',
        'cashier_id',
        'subtotal',
        'discount_amount',
        'discount_type',
        'total_amount',
        'amount_paid',
        'change_amount',
        'status',
        'void_reason',
        'voided_by',
        'voided_at',
        'reprint_count',
    ];

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
