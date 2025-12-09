<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Komisi Baru</title>
</head>

<body
    style="margin:0; padding:0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f4f5; line-height:1.6; color:#333;">
    <div
        style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:40px 30px; border-radius:16px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="color:#10b981; margin:0; font-size:24px;">Selamat! Komisi Masuk! 💸</h2>
        </div>
        <p style="font-size:16px; color:#4b5563;">Halo <strong>{{ $affiliator->name }}</strong>! 😎</p>
        <p style="font-size:16px; color:#4b5563;">
            Kerja bagus! Ada member baru (<strong>{{ $buyer->name }}</strong>) yang baru saja membeli produk
            <strong>"{{ $product->title }}"</strong> lewat link kamu.
        </p>
        <div
            style="background-color:#f0fdf4; border:1px solid #bbf7d0; padding:15px; border-radius:8px; margin:20px 0; text-align:center;">
            <p style="margin:0; color:#166534; font-size:14px;">Total Komisi:</p>
            <h3 style="margin:5px 0 0 0; color:#15803d; font-size:24px;">{{ $commission }}</h3>
        </div>
        <p style="font-size:16px; color:#4b5563;">
            Komisi ini sudah masuk ke saldo pending kamu. Semangat terus tebar link-nya ya!
        </p>
        <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">
        <p style="font-size:16px; color:#111; font-weight:bold; margin-top:10px;">
            Sukses Selalu,<br>Tim {{ config('app.name') }}
        </p>
    </div>
</body>

</html>
