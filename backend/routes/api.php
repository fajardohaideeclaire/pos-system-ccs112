<?php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\AuditLogController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🔓 Public
Route::post('/login', [AuthController::class, 'login']);


// 🔐 Protected (requires login)
Route::middleware(['auth:sanctum'])->group(function () {

    // AUTH
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/verify-supervisor', [AuthController::class, 'verifySupervisor']);

    // 📦 PRODUCTS
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/search', [ProductController::class, 'search']);

    Route::middleware(['role:admin'])->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::patch('/products/{id}/deactivate', [ProductController::class, 'deactivate']);
        Route::patch('/products/{id}/activate', [ProductController::class, 'activate']);
    });

    // 👤 USERS (ADMIN ONLY)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::patch('/users/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::patch('/users/{id}/unlock', [UserController::class, 'unlock']);
    });

    // 🧾 TRANSACTIONS
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::post('/transactions/{id}/complete', [TransactionController::class, 'complete']);
    Route::post('/transactions/{id}/cancel', [TransactionController::class, 'cancel']);
    Route::post('/transactions/{id}/void-item', [TransactionController::class, 'voidItem']);
    Route::post('/transactions/{id}/post-void', [TransactionController::class, 'postVoid']);
    Route::post('/transactions/{id}/reprint', [TransactionController::class, 'reprint']);

    // 🎯 DISCOUNTS
    Route::get('/discounts', [DiscountController::class, 'index']);
    Route::post('/transactions/{id}/apply-discount', [DiscountController::class, 'apply']);

    // 📊 AUDIT LOGS (ADMIN + SUPERVISOR)
    Route::middleware(['role:admin,supervisor'])->group(function () {
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
    });

});