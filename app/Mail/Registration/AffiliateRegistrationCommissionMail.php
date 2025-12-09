<?php

namespace App\Mail\Registration;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class AffiliateRegistrationCommissionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $affiliator;
    public $newMember;
    public $commission;

    /**
     * Create a new message instance.
     */
    public function __construct(User $affiliator, User $newMember, $commission)
    {
        $this->affiliator = $affiliator;
        $this->newMember = $newMember;
        $this->commission = $commission;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Selamat! Ada Member Baru Daftar Lewat Kamu! 🎉',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.registration.affiliate_registration_commission',
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
