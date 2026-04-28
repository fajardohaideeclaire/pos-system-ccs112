<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\AuditLog;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string',
            ]);

            $user = User::where('username', $request->username)->first();

            // 1. Check if user exists
            if (!$user) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // 2. Check if account is locked (Security Feature)
            if ($user->is_locked) {
                return response()->json(['message' => 'Account is locked due to too many failed attempts. Contact Admin.'], 403);
            }

            // 3. Attempt login
            if (!Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
                // Increment failed attempts logic could go here
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $user = Auth::user();

            // 4. Check if account is active
            if ($user->status !== 'active') {
                Auth::logout();
                return response()->json(['message' => 'Account is deactivated. Please contact your supervisor.'], 403);
            }

            // 5. Create Sanctum Token
            $token = $user->createToken('pos_token')->plainTextToken;

            // 6. Create Audit Log for login
            AuditLog::create([
                'user_id' => $user->id,
                'module' => 'Auth',
                'action' => 'Login',
                'description' => 'User logged into the system',
                'ip_address' => $request->ip()
            ]);

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                ]
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An unexpected server error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Create Audit Log before deleting token
            AuditLog::create([
                'user_id' => $request->user()->id,
                'module' => 'Auth',
                'action' => 'Logout',
                'description' => 'User logged out',
                'ip_address' => $request->ip()
            ]);

            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Logout failed'], 500);
        }
    }
}