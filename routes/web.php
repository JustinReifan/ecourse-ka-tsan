<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\LabsController;
use App\Http\Controllers\MemberProductController;
use App\Http\Controllers\ModuleMaterialController;
use App\Http\Controllers\ProductPurchaseController;
use App\Http\Controllers\Auth\RegisteredUserController;




Route::get('/mbd', function () {
    return Inertia::render('mbd');
})->name('mbd');

Route::get('/jago-canva', function () {
    $settings = \App\Models\Setting::getAllCached();

    return Inertia::render('canva', [
        'coursePrice' => $settings['jago_canva_price'] ?? $settings['course_price'] ?? 0,
    ]);
})->name('canva');


Route::get('/', function (\Illuminate\Http\Request $request) {
    $settings = \App\Models\Setting::getAllCached();
    $variant = 'benefit';

    $response = Inertia::render('test3', [
        'landingBadge' => $settings['landing_badge'] ?? 'OPEN BATCH',
        'coursePrice' => 399000,
        'abVariant' => $variant,
    ])->toResponse($request);

    // Varian B is the active campaign headline. Keep the cookie for analytics attribution.
    return $response->withCookie(cookie(
        'gumpreneur_ab_variant',
        $variant,
        60 * 24 * 30,
        '/',
        null,
        $request->isSecure(),
        true,
        false,
        'Lax',
    ));
})->name('home');



Route::post('/register/get-snap-token', [RegisteredUserController::class, 'getSnapToken'])->name('register.get-snap-token');
Route::post('/register/create-payment', [RegisteredUserController::class, 'createPaymentRequest'])
    ->name('register.create-payment');

Route::post('/api/payments/confirm-registration', [ProductPurchaseController::class, 'confirmInstantPayment'])
    ->name('payments.confirm-registration');

// Payment status page — Waiting Room setelah user kembali dari Duitku
// Public: user belum tentu login saat landing di sini
Route::get('/payment/status', function (\Illuminate\Http\Request $request) {
    // Duitku mengirim merchantOrderId sebagai query param ke returnUrl
    $orderId = $request->query('merchantOrderId') ?? $request->query('order_id');
    return \Inertia\Inertia::render('payment/status', [
        'orderId' => $orderId,
    ]);
})->name('payment.status');

// Public polling endpoint — digunakan halaman /payment/status untuk cek status order
Route::get('/api/payment/check/{orderId}', function (string $orderId) {
    $order = \App\Models\Order::where('order_id', $orderId)
        ->select('order_id', 'status', 'type')
        ->first();

    if (!$order) {
        return response()->json(['status' => 'not_found'], 404);
    }

    return response()->json(['status' => $order->status]);
})->name('payment.check');

// Auto-login route — dipanggil setelah user klik "Lanjutkan ke Member Area" di status page.
// Webhook tidak bisa Auth::login() (session konteks berbeda), jadi kita login di sini.
Route::get('/payment/login/{orderId}', function (string $orderId) {
    // Cari order yang sudah completed dan punya user
    $order = \App\Models\Order::where('order_id', $orderId)
        ->where('status', 'completed')
        ->whereNotNull('user_id')
        ->first();

    if (!$order) {
        return redirect()->route('login')
            ->with('error', 'Order belum terkonfirmasi. Silakan coba beberapa saat lagi.');
    }

    $user = \App\Models\User::find($order->user_id);

    if (!$user) {
        return redirect()->route('login');
    }

    // Jika sudah login sebagai user yang sama, langsung ke member
    if (\Illuminate\Support\Facades\Auth::check() && \Illuminate\Support\Facades\Auth::id() === $user->id) {
        return redirect()->route('member.index');
    }

    \Illuminate\Support\Facades\Auth::login($user, true); // remember = true

    return redirect()->intended(route('member.index'));
})->name('payment.login');

// Product purchase routes (public, requires auth)
Route::middleware('auth')->group(function () {
    Route::post('/products/create-payment', [ProductPurchaseController::class, 'createPaymentRequest'])
        ->name('products.create-payment');
    Route::post('/api/payments/confirm-instant', [ProductPurchaseController::class, 'confirmInstantPayment']);
    Route::post('/api/products/purchase', [\App\Http\Controllers\ProductPurchaseController::class, 'forcePurchase'])->name('products.force-purchase');
    Route::get('/api/products/{product}/download', [\App\Http\Controllers\ProductPurchaseController::class, 'download'])->name('products.download');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Member routes
    Route::prefix('member')->name('member.')->group(function () {
        Route::get('/', [MemberProductController::class, 'index'])->name('index');
        Route::get('/products', [MemberProductController::class, 'index'])->name('products');
        Route::get('/products/{product:slug}', [MemberProductController::class, 'showProduct'])->name('product.show');
        Route::post('/survey', [UserController::class, 'updateSurvey'])->name('survey');
        Route::get('course/{course:slug}', [MemberController::class, 'course'])->name('course');
        Route::get('module/{module:slug}', [MemberController::class, 'module'])->name('module');
        Route::post('module/complete/{module}', [MemberController::class, 'markComplete'])->name('module.complete');
    });

    // Admin routes
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        // Dashboard route
        Route::get('/', function () {
            $stats = [
                'total_users' => \App\Models\User::count(),
                'total_courses' => \App\Models\Course::count(),
                'total_modules' => \App\Models\Module::count(),
                'active_courses' => \App\Models\Course::where('status', 'active')->count(),
            ];

            return Inertia::render('admin/dashboard', [
                'stats' => $stats
            ]);
        })->name('dashboard');

        // Analytics routes
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
        Route::get('/analytics/export', [AnalyticsController::class, 'export'])->name('analytics.export');

        // A/B Testing Labs routes
        Route::get('/labs', [LabsController::class, 'index'])->name('labs');
        Route::post('/labs/clear-cache', [LabsController::class, 'clearCache'])->name('labs.clear-cache');

        // Resource routes
        Route::resource('products', ProductController::class);
        Route::resource('courses', CourseController::class);
        Route::resource('modules', ModuleController::class);
        Route::resource('module-materials', ModuleMaterialController::class);

        // Users (export route before resource to avoid ID collision)
        Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
        Route::resource('users', UserController::class);
        Route::resource('vouchers', \App\Http\Controllers\VoucherController::class);

        // Orders (export route before resource to avoid ID collision)
        Route::get('/orders/export', [\App\Http\Controllers\OrderController::class, 'export'])->name('orders.export');
        Route::resource('orders', \App\Http\Controllers\OrderController::class);

        // Payout Methods
        Route::resource('payout-methods', \App\Http\Controllers\PayoutMethodController::class);

        // Web Configuration
        Route::get('/config', [\App\Http\Controllers\WebConfigController::class, 'index'])->name('config');
        Route::post('/config', [\App\Http\Controllers\WebConfigController::class, 'update'])->name('config.update');
    });
});

// Analytics tracking API
Route::post('/api/analytics/track', [AnalyticsController::class, 'track'])->name('analytics.track');

// Voucher validation API
Route::post('/api/vouchers/validate', [\App\Http\Controllers\VoucherController::class, 'validate'])->name('vouchers.validate');

// Payment callback (public, no auth required)
Route::post('/api/callback/payment', [\App\Http\Controllers\PaymentController::class, 'callback'])->name('payment.callback');

// Manual conversion trigger (for testing - should be protected in production)
Route::post('/api/affiliate/trigger-conversion', [\App\Http\Controllers\PaymentController::class, 'triggerConversion'])->name('affiliate.trigger-conversion')->middleware('auth');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/affiliate.php';
