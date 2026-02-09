<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Permintaan Payout Affiliate</title>
</head>

<body
    style="margin:0; padding:0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f4f5; line-height:1.6; color:#333;">
    <div
        style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:40px 30px; border-radius:16px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="color:#111; margin:0; font-size:24px;">Permintaan Payout Affiliate 💸</h2>
        </div>

        <p style="font-size:16px; color:#4b5563;">Halo Admin,</p>
        <p style="font-size:16px; color:#4b5563;">Ada permintaan payout baru dari affiliate. Silakan review dan proses
            permohonan tersebut.</p>

        <div
            style="background-color:#f9fafb; padding:20px; border-radius:8px; margin:25px 0; border-left:4px solid #3b82f6;">
            <table style="width:100%; border-collapse:collapse;">
                <tr style="border-bottom:1px solid #e5e7eb;">
                    <td style="padding:12px 0; color:#6b7280; font-weight:600;">Nama Affiliate:</td>
                    <td style="padding:12px 0; font-weight:bold; color:#111; text-align:right;">{{ $affiliate->name }}
                    </td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb;">
                    <td style="padding:12px 0; color:#6b7280; font-weight:600;">Email:</td>
                    <td style="padding:12px 0; color:#111; text-align:right;">{{ $affiliate->email }}</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb;">
                    <td style="padding:12px 0; color:#6b7280; font-weight:600;">Jumlah Payout:</td>
                    <td style="padding:12px 0; font-weight:bold; color:#16a34a; text-align:right; font-size:18px;">
                        {{ 'Rp ' . number_format($payout->amount, 0, ',', '.') }}</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb;">
                    <td style="padding:12px 0; color:#6b7280; font-weight:600;">Metode Pembayaran:</td>
                    <td style="padding:12px 0; color:#111; text-align:right;">{{ $payout->payout_method_name ?? 'N/A' }}
                    </td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb;">
                    <td style="padding:12px 0; color:#6b7280; font-weight:600;">Nama Rekening:</td>
                    <td style="padding:12px 0; color:#111; text-align:right;">{{ $payout->account_name ?? 'N/A' }}</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb;">
                    <td style="padding:12px 0; color:#6b7280; font-weight:600;">Nomor Rekening:</td>
                    <td style="padding:12px 0; color:#111; font-weight:600; text-align:right;">
                        {{ $payout->account_number ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td style="padding:12px 0; color:#6b7280; font-weight:600;">Status:</td>
                    <td style="padding:12px 0; text-align:right;">
                        <span
                            style="background-color:#fef08a; color:#854d0e; padding:4px 12px; border-radius:4px; font-size:12px; font-weight:bold;">
                            {{ ucfirst($payout->status) }}
                        </span>
                    </td>
                </tr>
            </table>
        </div>

        <div style="text-align:center; margin:35px 0;">
            <a href="{{ $adminUrl }}"
                style="background-color:#3b82f6; color:white; padding:12px 28px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
                Review Permintaan Payout
            </a>
        </div>

        <p
            style="font-size:13px; color:#9ca3af; text-align:center; margin-top:30px; border-top:1px solid #e5e7eb; padding-top:20px;">
            Notifikasi otomatis dari Sistem {{ config('app.name') }}
        </p>
    </div>
</body>

</html>
