<?php

namespace App\Mail\Registration;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class AdminRegistrationNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $newMember;
    public $affiliatorName;
    public $commission;
    public $adminUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(User $newMember, $affiliatorName, $commission)
    {
        $this->newMember = $newMember;
        $this->affiliatorName = $affiliatorName;
        $this->commission = $commission;
        $this->adminUrl = url('/admin/affiliates/conversions/list');
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[INFO] Registrasi Baru via Affiliate',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.registration.admin_registration_notification',
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
