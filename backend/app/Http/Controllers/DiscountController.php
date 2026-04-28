<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Discount;

class DiscountController extends Controller
{
    public function apply(Request $request, $id)
    {
        $request->validate([
            'discount_type' => 'required|exists:discounts,type',
        ]);

        $transaction = Transaction::findOrFail($id);

        if ($transaction->discount_type) {
            return response()->json(['message' => 'Discount already applied'], 422);
        }

        $discount = Discount::where('type', $request->discount_type)->first();

        $discountAmount = $transaction->subtotal * ($discount->percentage / 100);

        $transaction->update([
            'discount_type' => $discount->type,
            'discount_amount' => $discountAmount,
            'total_amount' => $transaction->subtotal - $discountAmount,
        ]);

        return response()->json($transaction);
    }
}
