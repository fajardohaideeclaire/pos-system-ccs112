<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'transaction_number',
        'cashier_id',
        'discount_id',
        'subtotal',
        'discount_amount',
        'total_amount',
        'amount_paid',
        'change_amount',
        'status',
        'completed_at'
    ];

    public function items() {
        return $this->hasMany(TransactionItem::class);
    }

    public function cashier() {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function discount() {
        return $this->belongsTo(Discount::class);
    }
}