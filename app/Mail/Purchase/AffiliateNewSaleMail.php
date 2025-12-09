<?php

namespace App\Mail\Purchase;

use App\Models\User;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class AffiliateNewSaleMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $affiliator;
    public $buyer;
    public $product;
    public $commission;

    /**
     * Create a new message instance.
     */
    public function __construct(User $affiliator, User $buyer, Product $product, $commission)
    {
        $this->affiliator = $affiliator;
        $this->buyer = $buyer;
        $this->product = $product;
        $this->commission = $commission;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cring! 💸 Ada Komisi Masuk: ' . $this->commission,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.purchase.affiliate_new_sale',
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
