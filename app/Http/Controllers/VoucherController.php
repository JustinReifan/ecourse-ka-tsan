<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Setting;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function index()
    {
        $vouchers = Voucher::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/vouchers', [
            'vouchers' => $vouchers
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
            'status' => 'required|in:active,inactive'
        ]);

        Voucher::create($validated);

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
            'status' => 'required|in:active,inactive'
        ]);

        $voucher->update($validated);

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
        ]);

        $voucher = Voucher::where('code', $request->code)->first();

        if (!$voucher) {
            return response()->json(['error' => 'Voucher not found'], 404);
        }

        if (!$voucher->isValid()) {
            return response()->json(['error' => 'Voucher is not valid or has expired'], 400);
        }

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
