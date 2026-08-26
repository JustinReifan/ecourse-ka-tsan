<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Voucher;
use Inertia\Response;
use App\Models\Product;
use Illuminate\Support\Str;
use App\Models\UserAnalytic;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Services\AffiliateService;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use App\Services\PaymentGatewayService;
use App\Services\MetaConversionService;
use App\Services\OrderFinalizationService;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */

    protected $orderFinalizationService;

    public function __construct(OrderFinalizationService $orderFinalizationService)
    {
        $this->orderFinalizationService = $orderFinalizationService;
    }

    public function create(): Response
    {
        $registrationType = $this->normalizeRegistrationType(request()->query('type', 'standard'));
        $product = $this->resolveRegistrationProduct($registrationType);

        if ($registrationType === 'lead_magnet') {
            $coursePrice = $product ? $product->price : 0;
        } elseif ($registrationType === 'jago_canva') {
            $coursePrice = \App\Models\Setting::get(
                'jago_canva_price',
                \App\Models\Setting::get('course_price', env('VITE_COURSE_PRICE', 500000))
            );
        } else {
            $coursePrice = 399000;
        }

        $duitkuScriptUrl = \App\Models\Setting::get('duitku_script_url', env('VITE_DUITKU_SCRIPT_URL', ''));
        $minLeadMagnetPrice = \App\Models\Setting::get('min_lead_magnet_price', 1);

        return Inertia::render('auth/register', [
            'coursePrice' => $coursePrice,
            'duitkuScriptUrl' => $duitkuScriptUrl,
            'registrationType' => $registrationType,
            'minLeadMagnetPrice' => (int) $minLeadMagnetPrice,
            'registrationProductId' => $product?->id,
        ]);
    }

    public function createPaymentRequest(Request $request, PaymentGatewayService $paymentGateway, AffiliateService $affiliateService)
    {
        // 1. Validasi form
        $validated = $request->validate([
            'gateway' => 'required|string|in:duitku,midtrans',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255|min_digits:8|unique:users',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::min(8)],
            'registration_type' => 'nullable|string|in:standard,lead_magnet,jago_canva',
            'payment_amount' => 'nullable|numeric',
            'final_price' => 'nullable|numeric',
            'voucher_code' => 'nullable|string|max:50',
            'discount_amount' => 'nullable|numeric|min:0',
            'landing_source' => 'nullable|string|max:255',
        ]);

        $gatewayDriver = $request->input('gateway');
        $registrationType = $this->normalizeRegistrationType($request->input('registration_type', 'standard'));
        $isLeadMagnet = $registrationType === 'lead_magnet';

        // 2. Determine product and price based on registration type

        if ($isLeadMagnet) {
            $product = $this->resolveRegistrationProduct($registrationType);
            if (!$product) {
                return response()->json([
                    'message' => 'Produk lead magnet belum dikonfigurasi. Silakan hubungi admin.'
                ], 422);
            }

            $minPrice = \App\Models\Setting::get('min_lead_magnet_price', 1);
            $paymentAmount = $request->input('payment_amount', $minPrice);

            // Validate minimum price for lead magnet
            if ($paymentAmount < $minPrice) {
                return response()->json([
                    'message' => "Minimal pembayaran adalah Rp " . number_format($minPrice, 0, ',', '.')
                ], 422);
            }

            $orderAmount = $paymentAmount;
            $appliedVoucherCode = null;
            $calculatedDiscountAmount = 0;
        } else {
            $product = $this->resolveRegistrationProduct($registrationType);
            if (!$product) {
                return response()->json([
                    'message' => $registrationType === 'jago_canva'
                        ? 'Produk Jago Canva belum dikonfigurasi. Silakan hubungi admin.'
                        : 'Produk default belum dikonfigurasi. Silakan hubungi admin.'
                ], 422);
            }

            $basePrice = $this->getBaseRegistrationPrice($registrationType);
            [$appliedVoucherCode, $calculatedDiscountAmount] = $this->resolveVoucherForRegistration(
                $request->input('voucher_code'),
                $basePrice,
                $product->id
            );
            $orderAmount = max($basePrice - $calculatedDiscountAmount, 0);
        }

        $click = $affiliateService->getLastValidClickForSession($request);

        // 3. Buat Order 'pending'
        $order = Order::create([
            'order_id' => 'REG-' . Str::uuid(),
            'user_id' => null,
            'amount' => $orderAmount,
            'status' => 'pending',
            'type' => 'registration',
            'payment_method' => $gatewayDriver,
            'meta' => [
                'form_data' => $validated,
                'voucher_code' => $appliedVoucherCode,
                'discount_amount' => $calculatedDiscountAmount,
                'follow_up_sent' => false,
                'payment_url' => null,
                'affiliate_click_id' => $click ? $click->id : null,
                'registration_type' => $registrationType,
                'product_id' => $product ? $product->id : null,
                'session_id' => request()->session()->getId(),
                'landing_source' => $request->landing_source,
                '_fbp' => $request->cookie('_fbp'),
                '_fbc' => $request->cookie('_fbc'),
            ],
        ]);

        try {
            // 4. Pilih Gateway secara dinamis
            $gateway = $paymentGateway->getGateway($gatewayDriver);

            // 5. Buat permintaan pembayaran
            $paymentDetails = $gateway->createPaymentRequest($order, $validated);

            // 6. Simpan URL pembayaran ke Order 
            if (isset($paymentDetails['paymentUrl'])) {
                $meta = $order->meta;
                $meta['payment_url'] = $paymentDetails['paymentUrl'];
                $order->meta = $meta;
                $order->save();
            }

            try {
                UserAnalytic::create([
                    'session_id' => $request->session()->getId(),
                    'event_type' => 'conversion',
                    'event_data' => [
                        'type' => 'registration',
                        'registration_type' => $registrationType,
                        'order_id' => $order->order_id,
                        'name' => $validated['name'],
                        'email' => $validated['email'],
                        'step' => 'payment_request_created',
                        'landing_source' => $request->landing_source
                    ],
                    'ip_hash' => hash('sha256', $request->ip() . config('app.key')),
                    'user_agent' => $request->userAgent(),
                    'user_id' => null,
                    'created_at' => now(),
                ]);
            } catch (\Exception $e) {
                // Silent fail agar tidak mengganggu proses pembayaran utama
                Log::error('Analytics Conversion Tracking Failed: ' . $e->getMessage());
            }

            // 7. Kirim AddToCart event ke Meta CAPI (hanya untuk produk standard/default)
            if ($registrationType === 'standard') {
                try {
                    $metaService = app(MetaConversionService::class);
                    // Event ID deterministik: retry aman, Meta auto-dedup
                    $eventId = 'addtocart-' . $order->order_id;
                    $metaService->sendAddToCartServer(
                        eventId: $eventId,
                        amount: (float) $orderAmount,
                        email: $validated['email'],
                        phone: $validated['phone'],
                        clientIp: $request->ip(),
                        clientUserAgent: $request->userAgent(),
                        sourceUrl: $request->header('Referer', $request->url()),
                        fbp: $request->cookie('_fbp'),
                        fbc: $request->cookie('_fbc'),
                    );
                } catch (\Exception $e) {
                    Log::error('[Meta CAPI] AddToCart failed on createPaymentRequest: ' . $e->getMessage());
                }
            }

            // 8. Kirim data ke front-end (include orderId for Meta Pixel dedup)
            return response()->json(array_merge($paymentDetails, [
                'orderId' => $order->order_id,
            ]));
        } catch (\Exception $e) {
            logger()->error("Failed to create payment request: " . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle an incoming registration request (free/voucher).
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function forceRegister(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:255|min_digits:8|unique:users',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', Rules\Password::min(8)],
                'registration_type' => 'nullable|string|in:standard,lead_magnet,jago_canva',
                'voucher_code' => 'nullable|string|max:50',
                'landing_source' => 'nullable|string|max:255',
            ]);

            $registrationType = $this->normalizeRegistrationType($request->input('registration_type', 'standard'));

            if ($registrationType === 'lead_magnet') {
                return response()->json([
                    'success' => false,
                    'message' => 'Lead magnet tidak mendukung registrasi gratis tanpa pembayaran.'
                ], 422);
            }

            $product = $this->resolveRegistrationProduct($registrationType);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => $registrationType === 'jago_canva'
                        ? 'Produk Jago Canva belum dikonfigurasi. Silakan hubungi admin.'
                        : 'Produk default belum dikonfigurasi. Silakan hubungi admin.'
                ], 422);
            }

            $basePrice = $this->getBaseRegistrationPrice($registrationType);
            [$appliedVoucherCode, $calculatedDiscountAmount] = $this->resolveVoucherForRegistration(
                $request->input('voucher_code'),
                $basePrice,
                $product->id
            );
            $finalPrice = max($basePrice - $calculatedDiscountAmount, 0);

            if ($finalPrice > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order belum gratis. Lanjutkan pembayaran melalui gateway.'
                ], 422);
            }

            $order = Order::create([
                'order_id' => 'REGFREE-' . Str::uuid(),
                'user_id' => null,
                'amount' => 0,
                'status' => 'completed',
                'type' => 'registration',
                'payment_method' => $request->gateway ?? null,
                'meta' => [
                    'form_data' => $validated,
                    'voucher_code' => $appliedVoucherCode,
                    'discount_amount' => $calculatedDiscountAmount,
                    'follow_up_sent' => false,
                    'payment_url' => null,
                    'registration_type' => $registrationType,
                    'product_id' => $product ? $product->id : null,
                    'session_id' => request()->session()->getId(),
                    'landing_source' => $request->landing_source,
                    '_fbp' => $request->cookie('_fbp'),
                    '_fbc' => $request->cookie('_fbc'),
                ],
            ]);

            try {
                UserAnalytic::create([
                    'session_id' => $request->session()->getId(),
                    'event_type' => 'conversion',
                    'event_data' => [
                        'type' => 'registration',
                        'registration_type' => $registrationType,
                        'order_id' => $order->order_id,
                        'name' => $validated['name'],
                        'email' => $validated['email'],
                        'step' => 'force_register',
                        'landing_source' => $request->landing_source
                    ],
                    'ip_hash' => hash('sha256', $request->ip() . config('app.key')),
                    'user_agent' => $request->userAgent(),
                    'user_id' => null,
                    'created_at' => now(),
                ]);
            } catch (\Exception $e) {
                // Silent fail agar tidak mengganggu proses pembayaran utama
                Log::error('Analytics Conversion Tracking Failed on force register: ' . $e->getMessage());
            }

            // Kirim AddToCart event ke Meta CAPI (hanya untuk produk standard/default)
            if ($registrationType === 'standard') {
                try {
                    $metaService = app(MetaConversionService::class);
                    // Event ID deterministik: retry aman, Meta auto-dedup
                    $eventId = 'addtocart-' . $order->order_id;
                    $metaService->sendAddToCartServer(
                        eventId: $eventId,
                        amount: (float) 0, // free registration
                        email: $validated['email'],
                        phone: $validated['phone'],
                        clientIp: $request->ip(),
                        clientUserAgent: $request->userAgent(),
                        sourceUrl: $request->header('Referer', $request->url()),
                        fbp: $request->cookie('_fbp'),
                        fbc: $request->cookie('_fbc'),
                    );
                } catch (\Exception $e) {
                    Log::error('[Meta CAPI] AddToCart failed on forceRegister: ' . $e->getMessage());
                }
            }

            $user = $this->orderFinalizationService->finalizeRegistration($order);

            event(new Registered($user));
            Auth::login($user);

            return response()->json(['success' => true, 'message' => 'Registrasi berhasil diproses.', 'order_id' => $order->order_id]);
        } catch (\Exception $e) {
            Log::error('Gagal melakukan registrasi: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses order: ' . $e->getMessage()
            ], 500);
        }
    }

    protected function normalizeRegistrationType(string $registrationType): string
    {
        return match ($registrationType) {
            'lead-magnet', 'lead_magnet' => 'lead_magnet',
            'jago-canva', 'jago_canva' => 'jago_canva',
            default => 'standard',
        };
    }

    protected function resolveRegistrationProduct(string $registrationType): ?Product
    {
        return match ($registrationType) {
            'lead_magnet' => Product::getLeadMagnetProduct(),
            'jago_canva' => Product::getJagoCanvaProduct(),
            default => Product::getDefaultProduct(),
        };
    }

    protected function getBaseRegistrationPrice(string $registrationType): float
    {
        if ($registrationType === 'jago_canva') {
            return (float) \App\Models\Setting::get(
                'jago_canva_price',
                \App\Models\Setting::get('course_price', env('VITE_COURSE_PRICE', 500000))
            );
        }

        return 399000.0;
    }

    protected function resolveVoucherForRegistration(?string $voucherCode, float $basePrice, ?int $productId = null): array
    {
        if (!$voucherCode) {
            return [null, 0];
        }

        $voucher = Voucher::where('code', strtoupper($voucherCode))->first();
        if (!$voucher || !$voucher->isValid()) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'voucher_code' => 'Voucher tidak valid atau sudah kadaluarsa.',
            ]);
        }

        if ($productId && !$voucher->isApplicableToProduct($productId)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'voucher_code' => 'Voucher tidak berlaku untuk produk pendaftaran ini.',
            ]);
        }

        $discountAmount = (float) $voucher->calculateDiscount($basePrice);

        return [$voucher->code, $discountAmount];
    }
}
