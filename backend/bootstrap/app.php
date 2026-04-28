<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))

    ->withRouting(
        web: __DIR__.'/../routes/web.php',
<<<<<<< HEAD
        api: __DIR__.'/../routes/api.php', // ✅ ADD THIS LINE
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {
        // Register custom middleware aliases
=======
<<<<<<< HEAD
        api: __DIR__.'/../routes/api.php', // make sure API routes are enabled
=======
>>>>>>> 89a777c35af571bd7a32dc5fef4633952232604e
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
<<<<<<< HEAD
>>>>>>> origin/fernandez
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

<<<<<<< HEAD
        // Enable Sanctum stateful API
        $middleware->statefulApi();
=======
        // Required for Sanctum API authentication
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
=======
        //
>>>>>>> origin/fernandez
    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
<<<<<<< HEAD
    })

    ->create();
=======
    })->create();
>>>>>>> 89a777c35af571bd7a32dc5fef4633952232604e
>>>>>>> origin/fernandez
