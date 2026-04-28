<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
<<<<<<< HEAD

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
=======
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // CHECK AUTH + ROLE
        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
>>>>>>> fc86e44 (feat: initial project structure, migrations, auth backend + React frontend scaffold)
        }

        return $next($request);
    }
}