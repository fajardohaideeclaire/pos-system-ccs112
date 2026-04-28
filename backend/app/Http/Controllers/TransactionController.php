<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\{Transaction, TransactionItem, Product, AuditLog, Discount};

class TransactionController extends Controller
{
    /**
     * Stage 1: Create a pending order (hitting this from "Checkout" button)
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount_id' => 'nullable|exists:discounts,id',
        ]);

        return DB::transaction(function () use ($request) {
            $txnNumber = 'TXN-' . strtoupper(Str::random(8)) . '-' . date('Ymd');

            // 1. Initialize Transaction
            $transaction = Transaction::create([
                'transaction_number' => $txnNumber,
                'cashier_id' => $request->user()->id,
                'discount_id' => $request->discount_id,
                'status' => 'pending',
            ]);

            $runningSubtotal = 0;

            // 2. Process Items & Verify Stock
            foreach ($request->items as $itemData) {
                $product = Product::lockForUpdate()->findOrFail($itemData['product_id']);

                if ($product->stock_quantity < $itemData['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}.");
                }

                $itemSubtotal = $product->price * $itemData['quantity'];
                $runningSubtotal += $itemSubtotal;

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $itemData['quantity'],
                    'subtotal' => $itemSubtotal,
                ]);
            }

            // 3. Calculate Discount Dynamically
            $discountAmount = 0;
            if ($request->discount_id) {
                $discount = Discount::find($request->discount_id);
                $discountAmount = $runningSubtotal * ($discount->percentage / 100);
            }

            // 4. Finalize Totals
            $transaction->update([
                'subtotal' => $runningSubtotal,
                'discount_amount' => $discountAmount,
                'total_amount' => $runningSubtotal - $discountAmount,
            ]);

            return response()->json($transaction->load('items'), 201);
        });
    }

    /**
     * Stage 2: Finalize payment & deduct stock (hitting this from "Complete Payment" button)
     */
    public function complete(Request $request, $id)
    {
        $request->validate(['amount_paid' => 'required|numeric']);

        return DB::transaction(function () use ($request, $id) {
            $transaction = Transaction::with('items')->findOrFail($id);

            if ($transaction->status !== 'pending') {
                return response()->json(['message' => 'Transaction already processed'], 422);
            }

            if ($request->amount_paid < $transaction->total_amount) {
                return response()->json(['message' => 'Insufficient payment'], 422);
            }

            $change = $request->amount_paid - $transaction->total_amount;

            // 5. DEDUCT STOCK (This makes your Dashboard dynamic!)
            foreach ($transaction->items as $item) {
                $product = Product::findOrFail($item->product_id);
                $product->decrement('stock_quantity', $item->quantity);
            }

            $transaction->update([
                'amount_paid' => $request->amount_paid,
                'change_amount' => $change,
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'module' => 'Sales',
                'action' => 'Complete Sale',
                'description' => "Completed Sale #{$transaction->transaction_number}",
                'ip_address' => $request->ip()
            ]);

            return response()->json($transaction->fresh('items'));
        });
    }

    public function index()
    {
        return Transaction::with(['items', 'cashier'])->latest()->get();
    }
}