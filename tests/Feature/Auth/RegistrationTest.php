<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('legacy direct registration endpoint is disabled', function () {
    $this->post('/register')->assertMethodNotAllowed();
});
