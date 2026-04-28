<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $roles)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $roleArray = explode('|', $roles);

        if (!in_array($request->user()->role, $roleArray)) {
            return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        return $next($request);
    }
}