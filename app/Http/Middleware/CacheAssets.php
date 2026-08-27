<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CacheAssets
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): SymfonyResponse
    {
        /** @var SymfonyResponse $response */
        $response = $next($request);

        $path = $request->getPathInfo();

        // Cache Vite build assets for 1 year (they have hashed filenames)
        if (preg_match('#^/build/assets/#', $path)) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
        }
        // Cache images for 1 week
        elseif (preg_match('#\.(webp|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$#i', $path)) {
            $response->headers->set('Cache-Control', 'public, max-age=604800');
        }
        // HTML responses: no-cache (always revalidate)
        elseif (preg_match('#\.(html?)$#i', $path) || $path === '/') {
            $response->headers->set('Cache-Control', 'no-cache');
        }

        return $response;
    }
}
