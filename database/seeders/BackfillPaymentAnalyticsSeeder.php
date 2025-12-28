<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\UserAnalytic;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BackfillPaymentAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = public_path('orders.json');

        if (!File::exists($jsonPath)) {
            $this->command->error("File tidak ditemukan: {$jsonPath}");
            return;
        }

        $jsonContent = File::get($jsonPath);
        $decodedJson = json_decode($jsonContent, true);

        // --- PERBAIKAN DI SINI ---
        // Cari elemen yang memiliki key 'data' (karena struktur phpMyAdmin)
        $orders = [];
        if (is_array($decodedJson)) {
            foreach ($decodedJson as $element) {
                if (isset($element['type']) && $element['type'] === 'table' && $element['name'] === 'orders') {
                    $orders = $element['data'] ?? [];
                    break;
                }
            }
        }

        // Fallback: Jika ternyata strukturnya beda, coba anggap langsung array
        if (empty($orders) && is_array($decodedJson) && isset($decodedJson[0]['order_id'])) {
            $orders = $decodedJson;
        }

        if (empty($orders)) {
            $this->command->error("Tidak dapat menemukan data orders di dalam JSON. Pastikan format benar.");
            return;
        }
        // -------------------------

        $count = 0;
        $skipped = 0;

        $this->command->info("Memulai proses backfill analytics dari " . count($orders) . " data order...");

        foreach ($orders as $orderData) {
            // Filter: Hanya yang statusnya COMPLETED
            if (($orderData['status'] ?? '') !== 'completed') {
                continue;
            }

            $sessionId = 'webhook_' . ($orderData['order_id'] ?? 'unknown');

            // Cek Duplikat
            if (UserAnalytic::where('session_id', $sessionId)->exists()) {
                $skipped++;
                continue;
            }

            try {
                // Decode META
                $meta = isset($orderData['meta']) && is_string($orderData['meta'])
                    ? json_decode($orderData['meta'], true)
                    : ($orderData['meta'] ?? []);

                // Tentukan Product Title
                $productTitle = 'Unknown Product';
                if (($orderData['type'] ?? '') === 'registration') {
                    $productTitle = 'Registration Fee';
                } elseif (isset($meta['product_title'])) {
                    $productTitle = $meta['product_title'];
                } elseif (isset($meta['product']['title'])) {
                    $productTitle = $meta['product']['title'];
                }

                // Siapkan Event Data
                $eventData = [
                    'status' => 'success',
                    'amount' => $orderData['amount'] ?? 0,
                    'payment_method' => $orderData['payment_method'] ?? 'unknown',
                    'order_id' => $orderData['order_id'],
                    'voucher_code' => $meta['voucher_code'] ?? null,
                    'discount_amount' => $meta['discount_amount'] ?? 0,
                    'product_title' => $productTitle,
                    'is_backfill' => true,
                ];

                $ipAddress = '127.0.0.1';
                $userAgent = 'System/Backfill_Seeder';

                // Gunakan tanggal asli order
                $createdAt = isset($orderData['created_at'])
                    ? Carbon::parse($orderData['created_at'])
                    : now();

                UserAnalytic::create([
                    'session_id' => $sessionId,
                    'user_id' => $orderData['user_id'], // Pastikan user_id tidak null di DB, atau handle jika null
                    'event_type' => 'payment',
                    'event_data' => $eventData,
                    'ip_hash' => hash('sha256', $ipAddress . config('app.key')),
                    'user_agent' => $userAgent,
                    'created_at' => $createdAt,
                ]);

                $count++;
            } catch (\Exception $e) {
                $this->command->warn("Skip Order ID {$orderData['order_id']}: " . $e->getMessage());
            }
        }

        $this->command->info("Selesai! Berhasil: {$count}. Skipped (duplikat): {$skipped}.");
    }
}
