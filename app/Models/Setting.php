<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Throwable;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null)
    {
        $settings = self::getAllCached();
        return $settings[$key] ?? $default;
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value): void
    {
        self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
        self::clearCache();
    }

    /**
     * Get all settings as a flat array
     */
    public static function getAllCached(): array
    {
        if (!Schema::hasTable('settings')) {
            return [];
        }

        try {
            return Cache::rememberForever('settings', function () {
                return self::query()->pluck('value', 'key')->toArray();
            });
        } catch (Throwable $e) {
            // Fallback when cache store is database but `cache` table is not ready yet.
            return self::query()->pluck('value', 'key')->toArray();
        }
    }

    /**
     * Clear settings cache
     */
    public static function clearCache(): void
    {
        try {
            Cache::forget('settings');
        } catch (Throwable $e) {
            // Ignore cache store errors during bootstrap/migration phases.
        }
    }
}
