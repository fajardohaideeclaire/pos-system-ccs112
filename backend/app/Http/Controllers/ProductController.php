<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\AuditLog;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => 'required|string|unique:products,barcode',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            ...$request->only(['name','barcode','price','stock_quantity']),
            'status' => 'active',
            'created_by' => $request->user()->id,
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE',
            'module' => 'PRODUCT',
            'description' => 'Created product: '.$product->name,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());

        return response()->json($product);
    }

    public function deactivate($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['status' => 'inactive']);

        return response()->json(['message' => 'Product deactivated.']);
    }

    public function activate($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['status' => 'active']);

        return response()->json(['message' => 'Product activated.']);
    }

    public function search(Request $request)
    {
        $q = $request->get('q', '');

        return Product::where('status', 'active')
            ->where(function ($query) use ($q) {
                $query->where('name', 'LIKE', "%$q%")
                      ->orWhere('barcode', 'LIKE', "%$q%");
            })
            ->get();
    }
}