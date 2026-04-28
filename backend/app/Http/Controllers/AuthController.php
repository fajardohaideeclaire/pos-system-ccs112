<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->is_locked) {
            return response()->json(['message' => 'Account is locked.'], 403);
        }

        if ($user->status === 'inactive') {
            return response()->json(['message' => 'Account is deactivated.'], 403);
        }

        if (!Hash::check($request->password, $user->password)) {
            $user->increment('failed_attempts');

            if ($user->failed_attempts >= 5) {
                $user->update(['is_locked' => true]);

                return response()->json([
                    'message' => 'Account locked after 5 failed attempts.'
                ], 403);
            }

            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        // RESET FAILED ATTEMPTS
        $user->update(['failed_attempts' => 0]);

        // GENERATE TOKEN (Laravel Sanctum)
        $token = $user->createToken('pos-token')->plainTextToken;

        // AUDIT LOG
        AuditLog::create([
            'user_id'     => $user->id,
            'action'      => 'LOGIN',
            'module'      => 'auth',
            'description' => 'User logged in',
            'ip_address'  => $request->ip(),
        ]);

        return response()->json([
            'token' => $token,
            'user'  => $user
        ]);
    }
}