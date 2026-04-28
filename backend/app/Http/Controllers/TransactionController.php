<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Product; // may error for now (OK)
use App\Models\AuditLog;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $txnNumber = 'TXN-' . strtoupper(Str::random(8)) . '-' . date('Ymd');

        $transaction = Transaction::create([
            'transaction_number' => $txnNumber,
            'cashier_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        $subtotal = 0;

        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']); // may fail (OK)

            $itemSubtotal = $product->price * $item['quantity'];
            $subtotal += $itemSubtotal;

            TransactionItem::create([
                'transaction_id' => $transaction->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'unit_price' => $product->price,
                'quantity' => $item['quantity'],
                'subtotal' => $itemSubtotal,
            ]);
        }

        $transaction->update([
            'subtotal' => $subtotal,
            'total_amount' => $subtotal,
        ]);

        return response()->json($transaction->load('items'), 201);
    }

    public function complete(Request $request, $id)
    {
        $transaction = Transaction::with('items')->findOrFail($id);

        $change = $request->amount_paid - $transaction->total_amount;

        $transaction->update([
            'amount_paid' => $request->amount_paid,
            'change_amount' => $change,
            'status' => 'completed',
        ]);

        return response()->json($transaction->fresh());
    }

    public function voidItem(Request $request, $id)
    {
        $item = TransactionItem::where('id', $request->item_id)
            ->where('transaction_id', $id)
            ->firstOrFail();

        $item->update(['is_voided' => true]);

        return response()->json(['message' => 'Item voided']);
    }

    public function postVoid(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $transaction->update([
            'status' => 'voided',
            'void_reason' => $request->void_reason,
        ]);

        return response()->json($transaction);
    }

    public function reprint($id)
    {
        $transaction = Transaction::findOrFail($id);

        $transaction->increment('reprint_count');

        return response()->json([
            'transaction' => $transaction,
            'is_reprint' => true,
        ]);
    }
}
