<?php

use App\Models\UserAnalytic;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('analytics endpoint stores supported events', function () {
    $response = $this->postJson('/api/analytics/track', [
        'event_type' => 'section_view',
        'event_data' => [
            'section_id' => 'hero',
            'landing_source' => '/',
        ],
    ]);

    $response->assertOk()->assertJson(['success' => true]);

    expect(UserAnalytic::query()->where('event_type', 'section_view')->count())->toBe(1);
});

test('analytics endpoint rejects unsupported events', function () {
    $this->postJson('/api/analytics/track', [
        'event_type' => 'arbitrary_event',
        'event_data' => [],
    ])->assertUnprocessable();

    expect(UserAnalytic::query()->count())->toBe(0);
});
