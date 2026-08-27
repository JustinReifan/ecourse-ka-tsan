<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResponseCompression
{
    /**
     * Compress the response body with gzip when the client supports it.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        // Only compress if the client accepts gzip encoding and output is not already compressed
        if (
            $request->headers->has('Accept-Encoding')
            && str_contains($request->headers->get('Accept-Encoding'), 'gzip')
            && ! $response->headers->has('Content-Encoding')
            && ! $response->headers->has('X-Accel-Buffering')
            && $response->getContent() !== null
            && strlen($response->getContent()) > 0
        ) {
            $content = $response->getContent();

            // Compress text-based content types
            $contentType = $response->headers->get('Content-Type', '');
            if (preg_match('#(text/html|text/css|text/javascript|application/javascript|application/json|text/xml|application/xml|image/svg\+xml|text/plain|text/xml)#i', $contentType)) {
                $compressed = @gzencode($content, 6); // level 6 = good balance of speed/ratio

                if ($compressed !== false && strlen($compressed) < strlen($content)) {
                    $response->setContent($compressed);
                    $response->headers->set('Content-Encoding', 'gzip');
                    $response->headers->set('Content-Length', strlen($compressed));
                    // Remove Vary header potentially added by other middleware
                    $response->headers->set('Vary', 'Accept-Encoding');
                }
            }
        }

        return $response;
    }
}
