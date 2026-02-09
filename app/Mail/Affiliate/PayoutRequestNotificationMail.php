<?php

namespace App\Mail\Affiliate;

use App\Models\Affiliate;
use App\Models\AffiliatePayout;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class PayoutRequestNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $affiliate;
    public $payout;
    public $adminUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Affiliate $affiliate, AffiliatePayout $payout)
    {
        $this->affiliate = $affiliate;
        $this->payout = $payout;
        $this->adminUrl = url('/admin/affiliates/payouts');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[Affiliate] Permintaan Payout: ' . $this->affiliate->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.affiliate.payout_request',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
