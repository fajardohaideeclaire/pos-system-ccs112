<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',    // Standard React (CRA/Vite)
        'http://127.0.0.1:3000',   // Alternate Localhost
        'http://localhost:5173',    // Vite default port
        'http://127.0.0.1:5173',   // Vite alternate
        env('FRONTEND_URL', 'http://localhost:3000'), // Production URL from .env
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // CRITICAL: Must be true for Sanctum tokens/cookies

];