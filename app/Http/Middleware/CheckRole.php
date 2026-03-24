<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if user is logged in AND has the required role
        if (!$request->user() || $request->user()->role !== $role) {
            // If they are not the right role, send them away (or return 403)
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}