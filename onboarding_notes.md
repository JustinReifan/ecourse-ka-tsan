# 📚 Onboarding Notes — Laravel Course Tsan-2

## 🏗️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 12 (PHP 8.2+) |
| Frontend | React 19 + TypeScript |
| Bridge | Inertia.js 2 (no REST API) |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + custom components |
| Icons | Lucide React |
| Payment Gateway | Duitku (primary) + Midtrans (secondary) |
| Affiliasi | Custom-built affiliate system |
| Build Tool | Vite 6 |
| Rich Text | TipTap 3 |
| Charts | Recharts |
| Carousel | Embla Carousel |
| Animation | AOS (Animate on Scroll) |

---

## 🗂️ Struktur Project

```
├── app/
│   ├── Http/
│   │   ├── Controllers/        ← Semua controller
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   └── Settings/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/                 ← Eloquent models
│   ├── Services/               ← Business logic services
│   │   └── PaymentGateway/     ← Driver payment (Duitku)
│   ├── Jobs/                   ← Queue jobs (WA notification)
│   └── Mail/                   ← Mailable classes
├── resources/
│   └── js/
│       ├── app.tsx             ← Entry point React
│       ├── components/         ← Shared UI components
│       │   ├── admin/
│       │   ├── landing/        ← Landing page sections
│       │   ├── member/
│       │   └── ui/             ← shadcn/ui components
│       ├── layouts/            ← Layout wrappers
│       ├── pages/              ← Inertia page components
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── member/
│       │   └── affiliate/
│       ├── hooks/              ← Custom React hooks
│       ├── types/              ← TypeScript type definitions
│       └── lib/                ← Utilities (cn, etc.)
├── routes/
│   ├── web.php                 ← Main web routes
│   ├── auth.php                ← Authentication routes
│   ├── affiliate.php           ← Affiliate system routes
│   └── settings.php            ← Settings routes
└── database/
    ├── migrations/
    ├── factories/
    └── seeders/
```

---

## 🔄 User Flow

```
Landing Page (/) 
  → Lihat konten, scroll pricing
  → Klik "Gabung Sekarang" 
  → Register + Bayar (Duitku popup)
  → Payment confirmed
  → User dibuat otomatis + login
  → Redirect ke /member (Member Area)
  → Survey modal muncul (first-time)
  → Bisa akses produk/kelas
```

### Alur Payment Detail:
1. User isi form register + pilih payment method
2. Backend buat Order `pending` → minta token ke Duitku
3. Duitku popup muncul di browser (client-side)
4. User bayar → Duitku kirim callback ke `/api/callback/payment`
5. **Dua jalur konfirmasi:**
   - **Webhook** (auto dari Duitku): `PaymentController::callback()`
   - **Instant confirmation** (setelah popup close): `ProductPurchaseController::confirmInstantPayment()`
6. `OrderFinalizationService` menyelesaikan order:
   - Buat `User` (kalau registrasi baru)
   - Buat `UserPurchase` (berikan akses produk)
   - Hitung komisi affiliate
   - Kirim WA + email notifikasi

---

## 📦 Domain Models

### Core Models

| Model | Tabel | Keterangan |
|-------|-------|------------|
| `User` | `users` | User/member, role: admin/user |
| `Product` | `products` | Produk yang dijual (ecourse, ebook, template, affiliate_link) |
| `Course` | `courses` | Course dalam sebuah Product |
| `Module` | `modules` | Video lesson dalam sebuah Course |
| `ModuleMaterial` | `module_materials` | Resource/file per module |
| `Order` | `orders` | Transaksi pembayaran |
| `UserPurchase` | `user_purchases` | Pivot: user ↔ product (akses) |
| `UserProgress` | `user_progress` | Progress modul dan course |
| `Voucher` | `vouchers` | Kode diskon |
| `Setting` | `settings` | Config aplikasi (key-value, cached) |

### Affiliate Models

| Model | Tabel | Keterangan |
|-------|-------|------------|
| `Affiliate` | `affiliates` | Data affiliator |
| `AffiliateCampaign` | `affiliate_campaigns` | Kampanye dengan commission rate |
| `AffiliateClick` | `affiliate_clicks` | Tracking klik link afiliasi |
| `AffiliateConversion` | `affiliate_conversions` | Komisi per penjualan |
| `AffiliateLedger` | `affiliate_ledger` | Ledger saldo affiliator |
| `AffiliatePayout` | `affiliate_payouts` | Request penarikan saldo |
| `AffiliateReferral` | `affiliate_referrals` | Relasi referral antar affiliate |
| `AffiliateMilestone` | `affiliate_milestones` | Target bonus affiliator |
| `PayoutMethod` | `payout_methods` | Metode payout (bank, dll) |

### Relationships Penting

```
Product → hasMany → Course → hasMany → Module → hasMany → ModuleMaterial
Product → belongsToMany → User (via user_purchases)
Product → belongsToMany → Voucher (via product_voucher)
User → hasOne → Affiliate
User → hasMany → Order
Order → hasMany → AffiliateConversion
```

---

## 🖥️ Halaman-halaman Utama

### Public / Landing
| Path | Component | Keterangan |
|------|-----------|------------|
| `/` | `pages/test3.tsx` (render) atau `pages/welcome.tsx` | Landing page utama |
| `/mbd` | `pages/mbd.tsx` | Landing page alternatif |
| `/jago-canva` | `pages/canva.tsx` | Landing page Jago Canva |
| `/affiliate/leaderboard` | Affiliate leaderboard | Public |

### Auth
| Path | Keterangan |
|------|------------|
| `/register` | Form register + payment |
| `/login` | Login |
| `/forgot-password` | Reset password |

### Member Area (auth + verified)
| Path | Component | Keterangan |
|------|-----------|------------|
| `/member` | `pages/member/index.tsx` | Library produk user |
| `/member/products` | `pages/member/index.tsx` | Sama dengan index |
| `/member/products/{slug}` | `pages/member/product-detail.tsx` | Detail produk yang dibeli |
| `/member/course/{slug}` | `pages/member/course.tsx` | Halaman course |
| `/member/module/{slug}` | `pages/member/module.tsx` | Video player + materi |

### Admin Area (auth + admin middleware)
| Path | Keterangan |
|------|------------|
| `/admin` | Dashboard stats |
| `/admin/users` | Manajemen user |
| `/admin/orders` | Manajemen order |
| `/admin/products` | Manajemen produk |
| `/admin/courses` | Manajemen course |
| `/admin/modules` | Manajemen module |
| `/admin/module-materials` | Manajemen materi |
| `/admin/analytics` | Analytics & tracking |
| `/admin/labs` | A/B Testing labs |
| `/admin/vouchers` | Manajemen voucher |
| `/admin/config` | Konfigurasi website |
| `/admin/affiliates/*` | Manajemen affiliate |

### Affiliate (auth + verified)
| Path | Keterangan |
|------|------------|
| `/affiliate` | Dashboard affiliate |
| `/affiliate/ledger` | Ledger saldo |

---

## ⚙️ Services

| Service | Fungsi |
|---------|--------|
| `OrderFinalizationService` | Logic utama setelah payment: buat user, berikan akses, hitung komisi, kirim notif |
| `AffiliateService` | Tracking klik, hitung dan award komisi, validasi session |
| `PaymentGatewayService` | Factory/router ke gateway yang dipilih |
| `PaymentGateway/DuitkuGateway` | Integrasi spesifik Duitku |
| `WhatsappService` | Kirim WA notification |
| `AbTestingService` | A/B testing landing page |

---

## 🎨 Frontend Architecture

### Layouts
| Layout | Digunakan Di |
|--------|-------------|
| `app-layout.tsx` | Admin area (dengan sidebar) |
| `admin-layout.tsx` | Admin area (alias) |
| `member-layout.tsx` | Member area (sidebar produk katalog) |
| `auth-layout.tsx` | Halaman auth |
| `app/app-header-layout.tsx` | Module player page (header saja, tanpa sidebar) |

### Key Components
| Component | Keterangan |
|-----------|------------|
| `app-sidebar.tsx` | Sidebar admin |
| `member-sidebar.tsx` | Sidebar member (daftar produk yang dimiliki + katalog) |
| `video-player.tsx` | Custom video player untuk module |
| `product-purchase-modal.tsx` | Modal pembelian produk (Duitku integration) |
| `voucher-input.tsx` | Input kode voucher dengan validasi |
| `landing/*` | Section-section landing page |

### State Management
- Tidak ada global state (Redux/Zustand). Semua data di-pass via Inertia props dari controller.
- Shared data (auth, flash, ziggy) tersedia di semua halaman via `usePage().props`

### TypeScript Types (index.d.ts)
- `SharedData` — data global yang diinjeksi Inertia ke semua halaman
- `User`, `Course`, `Module`, `UserProgress`, `Affiliate`, `AffiliateConversion`, `Voucher`

---

## 🔧 Konfigurasi Penting

### Setting Model
Setting aplikasi disimpan di tabel `settings` dan di-cache selamanya (invalidated saat update).
Key-key penting:
- `course_price` — harga default kelas
- `jago_canva_price` — harga kelas Jago Canva
- `landing_badge` — badge teks di hero section
- `landing_headline`, `landing_subheadline`
- `landing_vsl_url`, `landing_vsl_thumbnail`
- `duitku_script_url` — URL script Duitku
- `owner_whatsapp`, `owner_email` — kontak admin
- `jago_canva_*` — config khusus produk Jago Canva

### Product Types
```typescript
type ProductType = 'ecourse' | 'ebook' | 'template' | 'affiliate_link'
```
- `ecourse` → memiliki Courses → Modules → video
- `ebook` / `template` → file download / external URL
- `affiliate_link` → redirect ke external URL

### Special Product Flags
- `is_default` — produk default untuk registrasi standar
- `is_lead_magnet` — produk untuk registrasi lead magnet
- `is_jago_canva` — produk khusus Jago Canva

---

## 💡 Hal-hal Penting Lainnya

1. **Inertia Flash Messages**: `flash.success`, `flash.error`, `flash.trigger_survey` digunakan untuk komunikasi satu arah dari server ke client setelah form submit.

2. **Affiliate Tracking**: Klik afiliasi ditrack via query param `?aff=XXX` di landing page, disimpan di session. Saat checkout, `affiliate_click_id` diattach ke order meta.

3. **Voucher System**: Voucher bisa berlaku untuk semua produk atau specific products (via pivot table `product_voucher`). Tipe: `percentage` atau `fixed`.

4. **Queue**: WA notification dikirim via Laravel queue jobs (`SendWhatsappNotificationJob`) untuk tidak block request utama.

5. **A/B Testing**: Ada `AbTestingService` dan `/admin/labs` untuk menguji variasi landing page.

6. **Analytics**: Custom analytics tracking kunjungan, scroll, dwell time, CTA click, dan payment success via `UserAnalytic` model.

7. **Development command**: 
   ```bash
   composer run dev
   ```
   Menjalankan: PHP artisan serve + queue worker + Vite dev server secara bersamaan.
