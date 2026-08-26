<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertCookie('gumpreneur_ab_variant');
});

it('uses the approved Gumpreneur benefit headline variant', function () {
    $response = $this->withCookie('gumpreneur_ab_variant', 'fomo')->get('/');

    $response->assertOk();
    $response->assertCookie('gumpreneur_ab_variant', 'benefit');
    $response->assertInertia(fn ($page) => $page
        ->component('test3')
        ->where('coursePrice', 399000)
        ->where('abVariant', 'benefit'));
});
