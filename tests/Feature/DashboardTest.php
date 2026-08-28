<?php

use App\Models\User;

test('guests are redirected from the admin dashboard to login', function () {
    $this->get('/admin')->assertRedirect('/login');
});

test('administrators can visit the admin dashboard', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->get('/admin')->assertOk();
});
