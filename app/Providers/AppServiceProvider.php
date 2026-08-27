<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Settings are loaded lazily via Setting::getAllCached() where needed
        // (uses Cache::rememberForever). Avoid eager loading here to keep
        // the TTFB fast on every request.
    }
}
