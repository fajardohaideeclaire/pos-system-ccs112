<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\AuditLog;

class UserController extends Controller
{
    /**
     * Get all users for the management table.
     */
    public function index()
    {
        return response()->json(
            User::orderBy('name', 'asc')->get()
        );
    }

    /**
     * Create new staff and log the event.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|in:cashier,supervisor,admin',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                ...$request->only(['name', 'username', 'email', 'role']),
                'password' => Hash::make($request->password),
                'status' => 'active',
                'is_locked' => false,
                'failed_attempts' => 0
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'module' => 'User Management',
                'action' => 'Create User',
                'description' => "Created new {$user->role}: {$user->username}",
                'ip_address' => $request->ip()
            ]);

            return response()->json($user, 201);
        });
    }

    /**
     * Update user details and log changes.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // If updating password, hash it
        $data = $request->all();
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'module' => 'User Management',
            'action' => 'Update User',
            'description' => "Updated profile for user: {$user->username}",
            'ip_address' => $request->ip()
        ]);

        return response()->json($user);
    }

    /**
     * Deactivate staff access.
     */
    public function deactivate(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent users from deactivating themselves
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot deactivate your own account.'], 422);
        }

        $user->update(['status' => 'inactive']);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'module' => 'User Management',
            'action' => 'Deactivate User',
            'description' => "Deactivated account: {$user->username}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'User deactivated successfully.']);
    }

    /**
     * Unlock accounts (Matches the "Unlock" button in the frontend).
     */
    public function unlock(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'is_locked' => false,
            'failed_attempts' => 0
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'module' => 'User Management',
            'action' => 'Unlock User',
            'description' => "Unlocked account for: {$user->username}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => "Account @{$user->username} has been unlocked."]);
    }
}