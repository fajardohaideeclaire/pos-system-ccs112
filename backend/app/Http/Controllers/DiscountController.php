<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Discount;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class DiscountController extends Controller
{
    /**
     * 🎯 FETCH ALL DISCOUNTS
     * This is the missing piece that populates your dropdown.
     */
    public function index()
    {
        // Using the 'active' scope we defined in the Model
        return response()->json(Discount::where('is_active', true)->get());
    }

    /**
     * 🎯 APPLY DISCOUNT TO TRANSACTION
     */
    public function apply(Request $request, $id)
    {
        $request->validate([
            'discount_type' => 'required|exists:discounts,type',
        ]);

        try {
            return DB::transaction(function () use ($request, $id) {
                $transaction = Transaction::findOrFail($id);

                // 1. Logic Guard: Prevent applying discounts to finished transactions
                if ($transaction->status !== 'pending') {
                    return response()->json([
                        'message' => "Cannot apply discount to a {$transaction->status} transaction."
                    ], 422);
                }

                // 2. Logic Guard: Prevent double discounting
                if ($transaction->discount_type) {
                    return response()->json(['message' => 'A discount has already been applied.'], 422);
                }

                // 3. Find the active discount
                $discount = Discount::where('type', $request->discount_type)
                    ->where('is_active', true)
                    ->first();

                if (!$discount) {
                    return response()->json(['message' => 'Discount type unavailable.'], 404);
                }

                // 4. Calculate amounts
                $subtotal = $transaction->subtotal;
                $discountAmount = $subtotal * ($discount->percentage / 100);
                $newTotal = $subtotal - $discountAmount;

                // 5. Atomic Update
                $transaction->update([
                    'discount_id' => $discount->id, // Matching our new migration
                    'discount_amount' => $discountAmount,
                    'total_amount' => $newTotal,
                ]);

                // 6. Audit Logging
                AuditLog::create([
                    'user_id' => auth()->id(),
                    'module' => 'Sales',
                    'action' => 'Apply Discount',
                    'description' => "Applied {$discount->name} to Txn #{$transaction->transaction_number}",
                    'ip_address' => $request->ip()
                ]);

                return response()->json([
                    'message' => 'Discount applied successfully',
                    'transaction' => $transaction->fresh()
                ]);
            });

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to apply discount',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}