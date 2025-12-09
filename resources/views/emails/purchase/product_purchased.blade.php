<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Produk Aktif</title>
</head>

<body
    style="margin:0; padding:0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f4f5; line-height:1.6; color:#333;">
    <div
        style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:40px 30px; border-radius:16px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="color:#111; margin:0; font-size:24px;">Pembayaran Berhasil! 🔓</h2>
        </div>
        <p style="font-size:16px; color:#4b5563;">Hai <strong>{{ $user->name }}</strong>! 👋</p>
        <p style="font-size:16px; color:#4b5563;">
            Terima kasih banyak ya sudah melakukan pembelian produk <strong>"{{ $product->title }}"</strong>.
        </p>
        <p style="font-size:16px; color:#4b5563;">
            Aku mau infoin kalau produknya <strong>sudah aktif</strong> di akun kamu. Kamu bisa langsung akses materinya
            sekarang juga.
        </p>
        <div style="text-align:center; margin:35px 0;">
            <a href="{{ $loginUrl }}"
                style="background-color:#4f46e5; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block; box-shadow:0 4px 6px -1px rgba(79,70,229,0.4);">
                Akses Produk Sekarang
            </a>
        </div>
        <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">
        <p style="font-size:16px; color:#111; font-weight:bold; margin-top:10px;">
            Salam hangat,<br>Admin {{ config('app.name') }}
        </p>
    </div>
</body>

</html>
