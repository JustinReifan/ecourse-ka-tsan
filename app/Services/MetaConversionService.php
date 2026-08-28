<?php

namespace App\Services;

use FacebookAds\Api;
use FacebookAds\Object\ServerSide\ActionSource;
use FacebookAds\Object\ServerSide\Content;
use FacebookAds\Object\ServerSide\CustomData;
use FacebookAds\Object\ServerSide\Event;
use FacebookAds\Object\ServerSide\EventRequest;
use FacebookAds\Object\ServerSide\UserData;
use Illuminate\Http\Request;
use Log;

class MetaConversionService
{
    private string $pixelId;

    private string $accessToken;

    public function __construct()
    {
        $this->pixelId = (string) config('services.meta.pixel_id', '');
        $this->accessToken = (string) config('services.meta.access_token', '');

        if ($this->isConfigured()) {
            try {
                Api::init(null, null, $this->accessToken, false);
            } catch (\Throwable $e) {
                Log::warning('Meta CAPI SDK init failed', ['error' => $e->getMessage()]);
            }
        }
    }

    /**
     * Check if CAPI is properly configured.
     */
    public function isConfigured(): bool
    {
        return $this->pixelId !== '' && $this->accessToken !== '';
    }

    /**
     * Send a PageView event to Meta Conversions API.
     */
    public function sendPageView(Request $request, string $eventId): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $userData = $this->buildUserData($request);

        $event = (new Event)
            ->setEventName('PageView')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($userData);

        Log::info('[Meta CAPI] Sending PageView event', ['event_id' => $eventId]);

        $this->sendEvents([$event]);
    }


    /**
     * Send an AddToCart event to Meta Conversions API (server-side, from registration form submit).
     */
    public function sendAddToCartServer(
        string $eventId,
        float $amount,
        ?string $email = null,
        ?string $phone = null,
        ?string $clientIp = null,
        ?string $clientUserAgent = null,
        ?string $sourceUrl = null,
        ?string $fbp = null,
        ?string $fbc = null,
    ): void {
        if (! $this->isConfigured()) {
            return;
        }

        $userData = $this->buildUserDataFromParams($email, $phone, $clientIp, $clientUserAgent, $fbp, $fbc);

        $content = (new Content)
            ->setProductId((string) config('services.meta.content_id', 'gumpreneur'))
            ->setQuantity(1);

        $customData = (new CustomData)
            ->setContentName((string) config('services.meta.content_name', 'Gumpreneur'))
            ->setContentType('product')
            ->setValue($amount)
            ->setCurrency('IDR')
            ->setContents([$content]);

        $event = (new Event)
            ->setEventName('AddToCart')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($sourceUrl ?? url('/register'))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($userData)
            ->setCustomData($customData);

        Log::info('[Meta CAPI] Sending AddToCart event (server-side registration)', [
            'event_id' => $eventId,
            'amount' => $amount,
            'email' => $email ? substr($email, 0, 3) . '***' : null,
        ]);

        $this->sendEvents([$event]);
    }

    public function sendInitiateCheckout(
        string $eventId,
        float $amount,
        ?string $email = null,
        ?string $phone = null,
        ?string $clientIp = null,
        ?string $clientUserAgent = null,
        ?string $sourceUrl = null,
        ?string $fbp = null,
        ?string $fbc = null,
    ): void {
        if (! $this->isConfigured()) {
            return;
        }

        $content = (new Content)
            ->setProductId((string) config('services.meta.content_id', 'gumpreneur'))
            ->setQuantity(1);

        $event = (new Event)
            ->setEventName('InitiateCheckout')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($sourceUrl ?? url('/register'))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($this->buildUserDataFromParams($email, $phone, $clientIp, $clientUserAgent, $fbp, $fbc))
            ->setCustomData(
                (new CustomData)
                    ->setContentName((string) config('services.meta.content_name', 'Gumpreneur'))
                    ->setContentType('product')
                    ->setValue($amount)
                    ->setCurrency('IDR')
                    ->setContents([$content])
            );

        $this->sendEvents([$event]);
    }

    /**
     * Send a Purchase event to Meta Conversions API (server-side, from payment callback).
     */
    public function sendPurchase(
        string $eventId,
        float $amount,
        ?string $email = null,
        ?string $phone = null,
        ?string $clientIp = null,
        ?string $clientUserAgent = null,
        ?string $sourceUrl = null,
        ?string $fbp = null,
        ?string $fbc = null,
    ): void {
        if (! $this->isConfigured()) {
            return;
        }

        $userData = $this->buildUserDataFromParams($email, $phone, $clientIp, $clientUserAgent, $fbp, $fbc);

        $content = (new Content)
            ->setProductId((string) config('services.meta.content_id', 'gumpreneur'))
            ->setQuantity(1);

        $customData = (new CustomData)
            ->setContentName((string) config('services.meta.content_name', 'Gumpreneur'))
            ->setContentType('product')
            ->setValue($amount)
            ->setCurrency('IDR')
            ->setContents([$content]);

        $event = (new Event)
            ->setEventName('Purchase')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($sourceUrl ?? url('/register'))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($userData)
            ->setCustomData($customData);

        Log::info('[Meta CAPI] Sending Purchase event (server-side callback)', [
            'event_id' => $eventId,
            'amount' => $amount,
            'email' => $email ? substr($email, 0, 3) . '***' : null,
        ]);

        $this->sendEvents([$event]);
    }

    /**
     * Build UserData from the HTTP request with browser cookie matching.
     */
    private function buildUserData(Request $request): UserData
    {
        $userData = (new UserData)
            ->setClientIpAddress($request->ip())
            ->setClientUserAgent($request->userAgent());

        // Set _fbp cookie for browser matching
        $fbp = $request->input('event_data._fbp') ?? $request->cookie('_fbp');
        if ($fbp) {
            $userData->setFbp($fbp);
        }

        // Set _fbc cookie for click ID matching
        $fbc = $request->input('event_data._fbc') ?? $request->cookie('_fbc');
        if ($fbc) {
            $userData->setFbc($fbc);
        }

        return $userData;
    }

    /**
     * Build UserData from explicit parameters (for server-side events without browser cookies).
     * Email and phone are hashed with SHA-256 as required by Meta CAPI.
     */
    private function buildUserDataFromParams(
        ?string $email,
        ?string $phone,
        ?string $clientIp,
        ?string $clientUserAgent,
        ?string $fbp = null,
        ?string $fbc = null,
    ): UserData {
        $userData = new UserData;

        if ($email) {
            // Meta requires lowercase, trimmed, SHA-256 hashed email
            $userData->setEmail(strtolower(trim($email)));
        }

        if ($phone) {
            // Normalize phone: remove spaces/dashes, ensure starts with country code
            $normalizedPhone = preg_replace('/[^0-9]/', '', $phone);
            // Convert 08xx to 628xx format for Indonesia
            if (str_starts_with($normalizedPhone, '0')) {
                $normalizedPhone = '62' . substr($normalizedPhone, 1);
            }
            $userData->setPhone($normalizedPhone);
        }

        if ($clientIp) {
            $userData->setClientIpAddress($clientIp);
        }

        if ($clientUserAgent) {
            $userData->setClientUserAgent($clientUserAgent);
        }

        if ($fbp) {
            $userData->setFbp($fbp);
        }

        if ($fbc) {
            $userData->setFbc($fbc);
        }

        return $userData;
    }

    /**
     * Send events to Meta Conversions API.
     *
     * @param  array<Event>  $events
     */
    private function sendEvents(array $events): void
    {
        try {
            $eventRequest = (new EventRequest($this->pixelId))
                ->setEvents($events);

            // When testing, attach test_event_code so events appear
            // in Meta Events Manager "Test events" tab instead of production
            $testCode = config('services.meta.test_event_code');
            if ($testCode) {
                $eventRequest->setTestEventCode($testCode);
                Log::info('[Meta CAPI] Using test_event_code', ['code' => $testCode]);
            }

            $response = $eventRequest->execute();

            Log::info('[Meta CAPI] Events sent successfully', [
                'events_received' => $response->getEventsReceived(),
                'messages' => $response->getMessages(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('[Meta CAPI] Request failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
