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

class AdminNewOrderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $buyer;
    public $affiliatorName;
    public $product;
    public $commission;
    public $adminUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(User $buyer, $affiliatorName, Product $product, $commission)
    {
        $this->buyer = $buyer;
        $this->affiliatorName = $affiliatorName;
        $this->product = $product;
        $this->commission = $commission;
        $this->adminUrl = url('/admin/affiliates/conversions/list');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[INFO] Penjualan Baru: ' . $this->product->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.purchase.admin_new_order',
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
