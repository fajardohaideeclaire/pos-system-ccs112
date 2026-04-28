<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required',
                'password' => 'required',
            ]);

            // 1. Attempt login with username
            if (!Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $user = Auth::user();

            // 2. Check if account is active
            if (in_array($user->status, ['inactive', 'deactivated'])) {
                Auth::logout();
                return response()->json(['message' => 'Account is deactivated'], 403);
            }

            // 3. Check for Sanctum Trait and create token
            if (!method_exists($user, 'createToken')) {
                return response()->json(['message' => 'Internal Error: User model missing HasApiTokens trait'], 500);
            }

            $token = $user->createToken('pos_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}