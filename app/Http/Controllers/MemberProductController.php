<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Models\UserPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemberProductController extends Controller
{
    /**
     * Show member's product library/catalog
     */
    public function index(Request $request)
    {
        $userId = auth()->id();

        // Get user's owned products
        $ownedProducts = Product::whereHas('purchases', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->where('status', 'active')
            ->with(['courses' => function ($query) {
                $query->where('status', 'active')->with('modules');
            }])
            ->orderBy('order', 'asc')
            ->get()
            ->map(function ($product) use ($userId) {
                // Add user completion data for ecourses
                if ($product->type === 'ecourse') {
                    $product->courses->each(function ($course) use ($userId) {
                        $userProgress = \App\Models\UserProgress::where('user_id', $userId)
                            ->where('course_id', $course->id)
                            ->first();
                        $course->completion_percentage = $userProgress ? $userProgress->course_completion_percentage : 0;
                    });
                }
                return $product;
            });

        // Get products user hasn't purchased (for catalog)
        $availableProducts = Product::whereDoesntHave('purchases', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->where('status', 'active')
            ->orderBy('order', 'asc')
            ->get();

        // Filter by selected product if provided
        $selectedProductId = $request->query('product_id');
        $selectedProduct = null;

        if ($selectedProductId) {
            $selectedProduct = Product::with(['courses' => function ($query) {
                $query->where('status', 'active');
            }])
                ->find($selectedProductId);
        }

        $duitkuScriptUrl = Setting::get('duitku_script_url', env('VITE_DUITKU_SCRIPT_URL', ''));

        // Survey trigger: tampilkan jika user belum pernah isi survey (customer_age masih null).
        // Lebih reliable daripada session flash yang tidak bekerja di webhook context.
        $triggerSurvey = is_null(auth()->user()->customer_age);

        // Purchase pixel: cek apakah ada order completed yang belum di-fire pixel-nya.
        // Ini akan dikirim ke frontend untuk fire fbq('track', 'Purchase') sekali saja.
        //
        // PENTING:
        // 1. Cutoff date: order sebelum tanggal ini diabaikan (sebelum fitur pixel di-deploy).
        // 2. Hanya order BARU (< 3 hari) yang bisa trigger pixel — cegah ghost event dari
        //    member lama yang login berulang dengan pixel_fired yang belum ter-set.
        // 3. Gunakan DB transaction + lockForUpdate untuk cegah race condition
        //    (user buka 2 tab bersamaan → 2 ghost event).
        $pixelCutoffDate = '2026-05-14 00:00:00';
        $pixelMaxAgeDays = 3; // hanya order dalam 3 hari terakhir yang bisa trigger pixel

        $purchasePixelData = null;

        DB::transaction(function () use ($userId, $pixelCutoffDate, $pixelMaxAgeDays, &$purchasePixelData) {
            $pendingPixelOrder = Order::where('user_id', $userId)
                ->where('status', 'completed')
                ->where('type', 'registration')
                ->whereJsonContains('meta->registration_type', 'standard')
                ->where('created_at', '>=', $pixelCutoffDate)
                ->where('created_at', '>=', now()->subDays($pixelMaxAgeDays)) // max 3 hari lalu
                ->where(function ($q) {
                    $q->whereNull('meta->pixel_fired')
                        ->orWhere('meta->pixel_fired', false);
                })
                ->orderBy('updated_at', 'desc')
                ->lockForUpdate() // cegah race condition: 2 request bersamaan
                ->first();

            if ($pendingPixelOrder) {
                // Mark pixel as fired SEBELUM set purchasePixelData,
                // agar jika ada exception saat render, tidak ada ghost event.
                $meta = $pendingPixelOrder->meta;
                $meta['pixel_fired'] = true;
                $pendingPixelOrder->meta = $meta;
                $pendingPixelOrder->save();

                $purchasePixelData = [
                    'event_id' => 'purchase-' . $pendingPixelOrder->order_id,
                    'amount' => (float) $pendingPixelOrder->amount,
                    'order_id' => $pendingPixelOrder->order_id,
                ];
            }
        });

        return Inertia::render('member/index', [
            'ownedProducts' => $ownedProducts,
            'availableProducts' => $availableProducts,
            'selectedProduct' => $selectedProduct,
            'duitkuScriptUrl' => $duitkuScriptUrl,
            'triggerSurvey' => $triggerSurvey,
            'purchasePixelData' => $purchasePixelData,
        ]);
    }

    /**
     * Show specific product courses (for owned ecourses)
     */
    public function showProduct(Product $product)
    {
        $userId = auth()->id();

        // Check if user owns this product
        if (!$product->isOwnedBy($userId)) {
            abort(403, 'You do not own this product.');
        }

        // Load product with courses
        $product->load(['courses' => function ($query) use ($userId) {
            $query->where('status', 'active')
                ->withCount('modules as module_count')
                ->orderBy('order', 'asc')
                ->orderBy('name', 'asc');
        }]);

        // Add completion data
        $product->courses->transform(function ($course) use ($userId) {
            $userProgress = \App\Models\UserProgress::where('user_id', $userId)
                ->where('course_id', $course->id)
                ->first();

            $course->completion_percentage = $userProgress ? $userProgress->course_completion_percentage : 0;
            return $course;
        });

        return Inertia::render('member/product-detail', [
            'product' => $product,
        ]);
    }
}
