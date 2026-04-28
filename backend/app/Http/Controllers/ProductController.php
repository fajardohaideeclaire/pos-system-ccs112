<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Get all products for the Inventory Management table.
     */
    public function index()
    {
        return response()->json(
            Product::orderBy('name', 'asc')->get()
        );
    }

    /**
     * Store a new product and log the action.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|unique:products,barcode',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        return DB::transaction(function () use ($request) {
            $product = Product::create([
                ...$request->only(['name', 'barcode', 'price', 'stock_quantity']),
                'status' => 'active',
                'created_by' => $request->user()->id,
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'module' => 'Products',
                'action' => 'Create',
                'description' => "Created product: {$product->name} (Barcode: {$product->barcode})",
                'ip_address' => $request->ip()
            ]);

            return response()->json($product, 201);
        });
    }

    /**
     * Update product details.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $product->update($request->all());

        AuditLog::create([
            'user_id' => $request->user()->id,
            'module' => 'Products',
            'action' => 'Update',
            'description' => "Updated details for: {$product->name}",
            'ip_address' => $request->ip()
        ]);

        return response()->json($product);
    }

    /**
     * Set status to inactive.
     */
    public function deactivate(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['status' => 'inactive']);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'module' => 'Products',
            'action' => 'Deactivate',
            'description' => "Deactivated product: {$product->name}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Product deactivated successfully.']);
    }

    /**
     * Set status to active.
     */
    public function activate(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['status' => 'active']);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'module' => 'Products',
            'action' => 'Activate',
            'description' => "Activated product: {$product->name}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Product activated successfully.']);
    }

    /**
     * Real-time search for the Sales/Terminal frontend.
     */
    public function search(Request $request)
    {
        $q = $request->get('q', '');

        // Only return active products for the Sales terminal
        return Product::where('status', 'active')
            ->where(function ($query) use ($q) {
                $query->where('name', 'LIKE', "%$q%")
                      ->orWhere('barcode', 'LIKE', "%$q%");
            })
            ->limit(10)
            ->get();
    }
}