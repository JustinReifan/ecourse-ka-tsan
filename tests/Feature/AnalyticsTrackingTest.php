<?php

use App\Models\UserAnalytic;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('analytics endpoint stores supported events', function () {
    $response = $this
        ->withSession(['_token' => 'test-token'])
        ->postJson('/api/analytics/track', [
            'event_type' => 'section_view',
            'event_data' => [
                'section_id' => 'hero',
                'landing_source' => '/',
            ],
        ], ['X-CSRF-TOKEN' => 'test-token']);

    $response->assertOk()->assertJson(['success' => true]);

    expect(UserAnalytic::query()->where('event_type', 'section_view')->count())->toBe(1);
});

test('analytics endpoint rejects unsupported events', function () {
    $this->withSession(['_token' => 'test-token'])
        ->postJson('/api/analytics/track', [
            'event_type' => 'arbitrary_event',
            'event_data' => [],
        ], ['X-CSRF-TOKEN' => 'test-token'])
        ->assertUnprocessable();

    expect(UserAnalytic::query()->count())->toBe(0);
});

test('analytics endpoint stores full nested event_data payloads', function () {
    $response = $this
        ->withSession(['_token' => 'test-token-abc'])
        ->postJson('/api/analytics/track', [
            'event_type' => 'engagement',
            'event_data' => [
                'type' => 'dwell_ping',
                'duration' => 30000,
                'is_initial' => false,
                'landing_source' => '/',
                'page' => '/',
            ],
        ], ['X-CSRF-TOKEN' => 'test-token-abc']);

    $response->assertOk();

    $row = UserAnalytic::query()->where('event_type', 'engagement')->first();

    expect($row)->not->toBeNull()
        ->and($row->event_data['type'])->toBe('dwell_ping')
        ->and((int) $row->event_data['duration'])->toBe(30000)
        ->and($row->event_data['landing_source'])->toBe('/');
});

test('analytics endpoint keeps scroll depth for heatmap analysis', function () {
    $this->withSession(['_token' => 'tok2'])
        ->postJson('/api/analytics/track', [
            'event_type' => 'scroll',
            'event_data' => [
                'depth' => 50,
                'landing_source' => '/mbd',
            ],
        ], ['X-CSRF-TOKEN' => 'tok2'])
        ->assertOk();

    $row = UserAnalytic::query()->where('event_type', 'scroll')->first();

    expect((int) $row->event_data['depth'])->toBe(50);
});
