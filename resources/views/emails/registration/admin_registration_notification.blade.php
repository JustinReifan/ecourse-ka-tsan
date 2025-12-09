<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Info Registrasi Affiliate</title>
</head>

<body
    style="margin:0; padding:0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f4f5; line-height:1.6; color:#333;">
    <div
        style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:40px 30px; border-radius:16px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">

        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="color:#1f2937; margin:0; font-size:24px;">Laporan Registrasi 📈</h2>
        </div>

        <p style="font-size:16px; color:#4b5563;">Halo Admin,</p>
        <p style="font-size:16px; color:#4b5563;">Ada pendaftaran member baru yang menggunakan kode afiliasi.</p>

        <table style="width:100%; margin-top:20px; border-collapse:collapse;">
            <tr style="border-bottom:1px solid #e5e7eb;">
                <td style="padding:12px 0; color:#6b7280;">Member Baru</td>
                <td style="padding:12px 0; font-weight:bold; color:#111; text-align:right;">{{ $newMember->name }}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;">
                <td style="padding:12px 0; color:#6b7280;">Affiliator</td>
                <td style="padding:12px 0; font-weight:bold; color:#111; text-align:right;">{{ $affiliatorName }}</td>
            </tr>
            <tr>
                <td style="padding:12px 0; color:#6b7280;">Komisi</td>
                <td style="padding:12px 0; font-weight:bold; color:#16a34a; text-align:right;">{{ $commission }}</td>
            </tr>
        </table>

        <div style="text-align:center; margin:35px 0;">
            <a href="{{ $adminUrl }}"
                style="background-color:#111827; color:white; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
                Cek & Approve Komisi
            </a>
        </div>

        <p style="font-size:14px; color:#9ca3af; text-align:center; margin-top:30px;">
            Sistem Notifikasi {{ config('app.name') }}
        </p>
    </div>
</body>

</html>
