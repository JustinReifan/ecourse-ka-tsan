<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class FixPixelFiredOrders extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'pixel:fix-fired-orders
                            {--dry-run : Preview tanpa mengubah data}
                            {--days=3 : Tandai order yang lebih tua dari N hari sebagai pixel_fired=true}';

    /**
     * The console command description.
     */
    protected $description = 'Mark semua order lama (> N hari) yang pixel_fired masih NULL sebagai fired=true untuk mencegah ghost Purchase event';

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $days = (int) $this->option('days');
        $pixelCutoffDate = '2026-05-14 00:00:00';
        $olderThan = now()->subDays($days);

        $this->info("=== Fix Ghost Purchase Pixel Events ===");
        $this->info("Cutoff date : {$pixelCutoffDate}");
        $this->info("Order lebih lama dari : {$days} hari ({$olderThan})");
        $this->info("Mode : " . ($isDryRun ? 'DRY RUN (tidak ada perubahan)' : 'LIVE'));
        $this->newLine();

        // Cari semua order yang akan di-fix
        $orders = Order::where('status', 'completed')
            ->where('type', 'registration')
            ->whereJsonContains('meta->registration_type', 'standard')
            ->where('created_at', '>=', $pixelCutoffDate)
            ->where('created_at', '<', $olderThan) // hanya yang lebih dari N hari
            ->where(function ($q) {
                $q->whereNull('meta->pixel_fired')
                    ->orWhere('meta->pixel_fired', false);
            })
            ->orderBy('created_at', 'asc')
            ->get(['id', 'order_id', 'user_id', 'amount', 'created_at', 'meta']);

        if ($orders->isEmpty()) {
            $this->info("✅ Tidak ada order yang perlu di-fix.");
            return self::SUCCESS;
        }

        $this->info("Ditemukan {$orders->count()} order yang akan di-fix:");
        $this->newLine();

        $headers = ['Order ID', 'User ID', 'Amount', 'Created At', 'pixel_fired saat ini'];
        $rows = $orders->map(function ($order) {
            $meta = $order->meta ?? [];
            return [
                $order->order_id,
                $order->user_id ?? 'NULL',
                'Rp ' . number_format($order->amount, 0, ',', '.'),
                $order->created_at,
                isset($meta['pixel_fired']) ? var_export($meta['pixel_fired'], true) : 'NULL',
            ];
        })->toArray();

        $this->table($headers, $rows);
        $this->newLine();

        if ($isDryRun) {
            $this->warn("DRY RUN: Tidak ada perubahan. Jalankan tanpa --dry-run untuk apply.");
            return self::SUCCESS;
        }

        if (!$this->confirm("Lanjutkan marking {$orders->count()} order sebagai pixel_fired=true?")) {
            $this->info("Dibatalkan.");
            return self::SUCCESS;
        }

        $fixed = 0;
        foreach ($orders as $order) {
            $meta = $order->meta ?? [];
            $meta['pixel_fired'] = true;
            $order->meta = $meta;
            $order->save();
            $fixed++;

            $this->line("  ✓ Fixed: {$order->order_id} (user: {$order->user_id})");
        }

        $this->newLine();
        $this->info("✅ Berhasil mark {$fixed} order sebagai pixel_fired=true.");

        Log::info('[PixelFix] Fixed ghost pixel orders', [
            'count' => $fixed,
            'order_ids' => $orders->pluck('order_id')->toArray(),
        ]);

        return self::SUCCESS;
    }
}
