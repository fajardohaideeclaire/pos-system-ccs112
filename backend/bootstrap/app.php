<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Register the 'role' alias so we can use it in routes/api.php
        // Example: ->middleware(['auth:sanctum', 'role:admin'])
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        
        // Professional Grade: Global API Error Handler
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                // Determine the correct status code
                $statusCode = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;
                
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => class_basename($e),
                    'status' => $statusCode
                ], $statusCode);
            }
        });

    })->create();