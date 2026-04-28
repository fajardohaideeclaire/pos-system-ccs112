<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|in:cashier,supervisor,admin',
        ]);

        $user = User::create([
            ...$request->only(['name','username','email','role']),
            'password' => Hash::make($request->password),
            'status' => 'active',
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());

        return response()->json($user);
    }

    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'inactive']);

        return response()->json(['message' => 'User deactivated.']);
    }

    public function unlock($id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'is_locked' => false,
            'failed_attempts' => 0
        ]);

        return response()->json(['message' => 'Account unlocked.']);
    }
}