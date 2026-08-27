<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <title inertia>{{ config('app.name') }}</title>
    <meta name="description" content="Gumpreneur - Program bimbingan 1-on-1 untuk mulai hasilkan Rp 10 Juta Pertamamu dari Sosmed. Dibimbing langsung oleh mentor berpengalaman.">

    <link rel="icon" href="/favicon.svg" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    {{-- Preload critical LCP image --}}
    <link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

    {{-- Font loading: non-blocking with font-display:swap --}}
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link rel="preload" as="style" href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap"></noscript>

    {{-- Inline critical above-the-fold CSS to eliminate render-blocking --}}
    <style>
        body{margin:0;background:#f9f5f2;color:#746a6b}
        .font-sans{font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif}
        .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
        *,::after,::before{box-sizing:border-box}
    </style>

    {{-- Intercept Vite CSS to make it non-blocking (saves 2000ms+ render-blocking) --}}
    <script>
        (function() {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet' &&
                            node.getAttribute('href') && node.getAttribute('href').indexOf('/build/') !== -1) {
                            node.setAttribute('media', 'print');
                            node.onload = function() { this.media = 'all'; };
                        }
                    });
                });
            });
            observer.observe(document.head, { childList: true });
        })();
    </script>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead

    <!-- Meta Pixel Code (deferred to avoid render blocking) -->
    <script>
        window.addEventListener('load', function() {
            ! function(f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function() {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1991594924771887');

            window.__META_PAGE_VIEW_EVENT_ID = crypto.randomUUID ? crypto.randomUUID() :
                Date.now() + '-' + Math.random().toString(36).substring(2, 11);
            fbq('track', 'PageView', {}, {
                eventID: window.__META_PAGE_VIEW_EVENT_ID
            });
        });
    </script>
    <noscript><img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=1401992591015898&ev=PageView&noscript=1" /></noscript>
    <!-- End Meta Pixel Code -->
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
