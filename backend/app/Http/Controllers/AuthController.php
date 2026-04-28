<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
<<<<<<< HEAD
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\AuditLog;
=======
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;
>>>>>>> origin/fernandez

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

<<<<<<< HEAD
        if (!$user) return response()->json(['message' => 'Invalid credentials.'], 401);
        if ($user->is_locked) return response()->json(['message' => 'Account is locked.'], 403);
        if ($user->status === 'inactive') return response()->json(['message' => 'Account is deactivated.'], 403);
=======
        if (!$user) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->is_locked) {
            return response()->json(['message' => 'Account is locked.'], 403);
        }

        if ($user->status === 'inactive') {
            return response()->json(['message' => 'Account is deactivated.'], 403);
        }
>>>>>>> origin/fernandez

        if (!Hash::check($request->password, $user->password)) {
            $user->increment('failed_attempts');

            if ($user->failed_attempts >= 5) {
                $user->update(['is_locked' => true]);
<<<<<<< HEAD
                return response()->json(['message' => 'Account locked after 5 failed attempts.'], 403);
=======

                return response()->json([
                    'message' => 'Account locked after 5 failed attempts.'
                ], 403);
>>>>>>> origin/fernandez
            }

            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

<<<<<<< HEAD
        $user->update(['failed_attempts' => 0]);

        $token = $user->createToken('pos-token')->plainTextToken;

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'LOGIN',
            'module' => 'AUTH',
            'description' => 'User logged in',
            'ip_address' => request()->ip(),
=======
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
>>>>>>> origin/fernandez
        ]);

        return response()->json([
            'token' => $token,
<<<<<<< HEAD
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->tokens()->delete();

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'LOGOUT',
            'module' => 'AUTH',
            'description' => 'User logged out',
            'ip_address' => request()->ip(),
        ]);

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function verifySupervisor(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || $user->role !== 'supervisor') {
            return response()->json(['message' => 'Supervisor not found'], 403);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid supervisor credentials'], 403);
        }

        return response()->json(['message' => 'Supervisor verified']);
    }
=======
            'user'  => $user
        ]);
    }
>>>>>>> origin/fernandez
}