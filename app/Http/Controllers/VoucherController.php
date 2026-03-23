<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function index()
    {
        $vouchers = Voucher::with('products:id,title')
            ->orderBy('created_at', 'desc')
            ->get();

        $products = Product::select('id', 'title', 'status')
            ->orderBy('title')
            ->get();

        return Inertia::render('admin/vouchers', [
            'vouchers' => $vouchers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:vouchers,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'required|integer|min:1',
            'expires_at' => 'nullable|date|after:now',
            'status' => 'required|in:active,inactive',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'required|integer|exists:products,id',
        ]);

        $productIds = $validated['product_ids'];
        unset($validated['product_ids']);

        $voucher = Voucher::create($validated);
        $voucher->products()->sync($productIds);

        return redirect()->back()->with('success', 'Voucher created successfully');
    }

    public function update(Request $request, Voucher $voucher)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:vouchers,code,' . $voucher->id,
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'required|integer|min:1',
            'expires_at' => 'nullable|date|after:now',
            'status' => 'required|in:active,inactive',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'required|integer|exists:products,id',
        ]);

        $productIds = $validated['product_ids'];
        unset($validated['product_ids']);

        $voucher->update($validated);
        $voucher->products()->sync($productIds);

        return redirect()->back()->with('success', 'Voucher updated successfully');
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return redirect()->back()->with('success', 'Voucher deleted successfully');
    }

    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'registration_type' => 'nullable|string|in:standard,lead_magnet,jago_canva,lead-magnet,jago-canva',
            'product_id' => 'nullable|integer|exists:products,id',
        ]);

        $voucher = Voucher::with('products:id,title')->where('code', strtoupper($request->code))->first();

        if (!$voucher) {
            return response()->json(['error' => 'Voucher not found'], 404);
        }

        if (!$voucher->isValid()) {
            return response()->json(['error' => 'Voucher is not valid or has expired'], 400);
        }

        $productId = $request->input('product_id');
        if ($productId && !$voucher->isApplicableToProduct((int) $productId)) {
            return response()->json(['error' => 'Voucher ini tidak berlaku untuk produk yang dipilih.'], 400);
        }

        if ($request->filled('registration_type')) {
            $registrationType = $request->input('registration_type', 'standard');
            $registrationType = match ($registrationType) {
                'lead-magnet', 'lead_magnet' => 'lead_magnet',
                'jago-canva', 'jago_canva' => 'jago_canva',
                default => 'standard',
            };

            if ($registrationType === 'lead_magnet') {
                $originalPrice = (float) Setting::get('min_lead_magnet_price', 1);
            } elseif ($registrationType === 'jago_canva') {
                $originalPrice = (float) Setting::get('jago_canva_price', Setting::get('course_price', 100000));
            } else {
                $originalPrice = (float) Setting::get('course_price', 100000);
            }
        } elseif ($productId) {
            $product = Product::find($productId);
            $originalPrice = (float) ($product?->price ?? 0);
        } else {
            $originalPrice = (float) Setting::get('course_price', 100000);
        }

        $discount = $voucher->calculateDiscount($originalPrice);
        $finalPrice = $originalPrice - $discount;

        return response()->json([
            'voucher' => $voucher,
            'discount' => $discount,
            'final_price' => $finalPrice,
            'original_price' => $originalPrice
        ]);
    }
}
