<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Komisi Pendaftaran</title>
</head>

<body
    style="margin:0; padding:0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f4f5; line-height:1.6; color:#333;">
    <div
        style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:40px 30px; border-radius:16px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">

        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="color:#10b981; margin:0; font-size:24px;">Komisi Baru Masuk! 🚀</h2>
        </div>

        <p style="font-size:16px; color:#4b5563;">Hai <strong>{{ $affiliator->name }}</strong>!</p>

        <p style="font-size:16px; color:#4b5563;">
            Ada kabar gembira nih! Seseorang baru saja mendaftar menjadi member melalui link referensi kamu.
        </p>

        <div
            style="background-color:#f0fdf4; border:1px solid #bbf7d0; padding:20px; border-radius:12px; margin:25px 0;">
            <table style="width:100%;">
                <tr>
                    <td style="color:#6b7280; padding-bottom:5px;">Member Baru:</td>
                    <td style="font-weight:bold; color:#111; text-align:right;">{{ $newMember->name }}</td>
                </tr>
                <tr>
                    <td style="color:#6b7280;">Komisi Kamu:</td>
                    <td style="font-weight:bold; color:#15803d; text-align:right; font-size:18px;">{{ $commission }}
                    </td>
                </tr>
            </table>
        </div>

        <p style="font-size:16px; color:#4b5563;">
            Komisi ini sudah tercatat di sistem sebagai <em>pending</em> dan akan segera diproses sesuai jadwal
            pencairan.
        </p>

        <p style="font-size:16px; color:#4b5563;">
            Terus semangat sebarkan link kamu ya, biar makin cuan! 💪
        </p>

        <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">

        <p style="font-size:14px; color:#9ca3af; text-align:center;">
            Salam Sukses,<br>Tim {{ config('app.name') }}
        </p>
    </div>
</body>

</html>
