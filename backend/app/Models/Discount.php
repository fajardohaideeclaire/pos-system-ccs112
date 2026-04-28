<?php

namespace App\Models; // Only this one!

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Discount extends Model
{
    protected $fillable = [
        'name',
        'type',
        'percentage',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'percentage' => 'decimal:2',
    ];

    public function transactions(): HasMany
    {
        // IMPORTANT: In the migration we just updated, we used 'discount_id'.
        // If you are using the ID as the foreign key, change this to:
        return $this->hasMany(Transaction::class, 'discount_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}