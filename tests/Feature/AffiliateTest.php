<?php

use App\Models\User;
use App\Models\Affiliate;
use App\Models\AffiliateClick;
use App\Models\AffiliateConversion;
use App\Models\Order;
use App\Services\AffiliateService;

test('affiliate click is captured and cookie is set', function () {
    $affiliate = Affiliate::factory()->create([
        'status' => 'active',
        'aff_key' => 'TEST123',
    ]);

    $response = $this->get('/?aff=TEST123');

    expect(AffiliateClick::where('affiliate_id', $affiliate->id)->count())->toBe(1);
    
    $response->assertCookie(config('affiliate.cookie_name'));
});

test('conversion is awarded to last valid click', function () {
    $affiliate = Affiliate::factory()->create(['status' => 'active']);
    $buyer = User::factory()->create();
    $order = Order::factory()->create([
        'order_id' => 'ORDER123',
        'user_id' => $buyer->id,
        'amount' => 1000000,
        'status' => 'completed',
        'meta' => ['affiliate_click_id' => null],
    ]);

    // Create a click
    $click = AffiliateClick::factory()->create([
        'affiliate_id' => $affiliate->id,
        'cookie_id' => 'test-cookie-123',
        'created_at' => now()->subDays(5),
    ]);
    $order->update(['meta' => ['affiliate_click_id' => $click->id]]);

    $service = app(AffiliateService::class);
    $conversion = $service->awardConversion($order, $buyer, 1000000);

    expect($conversion)->not->toBeNull()
        ->and($conversion->affiliate_id)->toBe($affiliate->id)
        ->and($conversion->order_id)->toBe('ORDER123')
        ->and((float) $conversion->commission_amount)->toBe(100000.0) // 10% of 1M
        ->and($conversion->status)->toBe('approved');

    $affiliate->refresh();
    expect((float) $affiliate->pending_balance)->toBe(0.0)
        ->and((float) $affiliate->balance)->toBe(100000.0);
});

test('self-referral is blocked', function () {
    $user = User::factory()->create();
    $affiliate = Affiliate::factory()->create([
        'user_id' => $user->id,
        'status' => 'active',
    ]);

    $order = Order::factory()->create([
        'order_id' => 'ORDER124',
        'user_id' => $user->id,
        'amount' => 1000000,
        'meta' => ['affiliate_click_id' => null],
    ]);

    $click = AffiliateClick::factory()->create([
        'affiliate_id' => $affiliate->id,
        'cookie_id' => 'test-cookie-124',
    ]);
    $order->update(['meta' => ['affiliate_click_id' => $click->id]]);

    $service = app(AffiliateService::class);
    $conversion = $service->awardConversion($order, $user, 1000000);

    expect($conversion)->toBeNull();
    expect(AffiliateConversion::where('order_id', 'ORDER124')->count())->toBe(0);
});

test('duplicate conversion is prevented', function () {
    $affiliate = Affiliate::factory()->create(['status' => 'active']);
    $buyer = User::factory()->create();
    $order = Order::factory()->create([
        'order_id' => 'ORDER125',
        'user_id' => $buyer->id,
        'amount' => 1000000,
        'meta' => ['affiliate_click_id' => null],
    ]);

    $click = AffiliateClick::factory()->create([
        'affiliate_id' => $affiliate->id,
        'cookie_id' => 'test-cookie-125',
    ]);
    $order->update(['meta' => ['affiliate_click_id' => $click->id]]);

    $service = app(AffiliateService::class);
    
    // First conversion
    $conversion1 = $service->awardConversion($order, $buyer, 1000000);
    expect($conversion1)->not->toBeNull();

    // Second attempt should return existing
    $conversion2 = $service->awardConversion($order, $buyer, 1000000);
    expect($conversion2->id)->toBe($conversion1->id);

    expect(AffiliateConversion::where('order_id', 'ORDER125')->count())->toBe(1);
});

test('commission is approved and moved to available balance', function () {
    $affiliate = Affiliate::factory()->create([
        'pending_balance' => 100000,
        'balance' => 0,
    ]);

    $conversion = AffiliateConversion::factory()->create([
        'affiliate_id' => $affiliate->id,
        'commission_amount' => 100000,
        'status' => 'pending',
    ]);

    $service = app(AffiliateService::class);
    $success = $service->approveCommission($conversion->id);

    expect($success)->toBeTrue();

    $affiliate->refresh();
    $conversion->refresh();

    expect((float) $affiliate->pending_balance)->toBe(0.0)
        ->and((float) $affiliate->balance)->toBe(100000.0)
        ->and($conversion->status)->toBe('approved');
});

test('payout request validates minimum amount', function () {
    $affiliate = Affiliate::factory()->create(['balance' => 50000]);

    $service = app(AffiliateService::class);

    expect(fn() => $service->requestPayout($affiliate->id, 50000, [
        'type' => 'bank',
        'account_name' => 'Test',
        'account_number' => '123',
    ]))->toThrow(\Exception::class);
});

test('payout request validates available balance', function () {
    $affiliate = Affiliate::factory()->create(['balance' => 200000]);

    $service = app(AffiliateService::class);

    expect(fn() => $service->requestPayout($affiliate->id, 300000, [
        'type' => 'bank',
        'account_name' => 'Test',
        'account_number' => '123',
    ]))->toThrow(\Exception::class);
});

test('valid payout request is created', function () {
    $affiliate = Affiliate::factory()->create(['balance' => 500000]);

    $service = app(AffiliateService::class);
    $payout = $service->requestPayout($affiliate->id, 200000, [
        'type' => 'bank',
        'account_name' => 'Test',
        'account_number' => '123',
    ]);

    expect($payout)->not->toBeNull()
        ->and((float) $payout->amount)->toBe(200000.0)
        ->and($payout->status)->toBe('requested');

    $affiliate->refresh();
    expect((float) $affiliate->balance)->toBe(300000.0);
});
