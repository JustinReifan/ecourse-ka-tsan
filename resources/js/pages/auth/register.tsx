import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VoucherInput } from '@/components/voucher-input';
import { getLandingSource } from '@/hooks/use-analytics';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Award,
    BadgePercent,
    BookOpen,
    CheckCircle,
    Eye,
    EyeOff,
    Gift,
    GraduationCap,
    LoaderCircle,
    Lock,
    Map,
    MessageCircle,
    Play,
    RefreshCw,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type RegisterForm = {
    name: string;
    phone: string;
    email: string;
    password: string;
};

interface RegisterProps {
    coursePrice: number;
    duitkuScriptUrl: string; // kept for prop compat, not used (no popup)
    registrationType?: 'standard' | 'lead_magnet' | 'jago_canva';
    minLeadMagnetPrice?: number;
    registrationProductId?: number | null;
}

// ─────────────────────────────────────────────
// Static Data
// ─────────────────────────────────────────────

type BenefitItem = { icon: React.ElementType; text: string };
type RegistrationType = 'standard' | 'lead_magnet' | 'jago_canva';

const BENEFITS_MAP: Record<RegistrationType, BenefitItem[]> = {
    standard: [
        { icon: BookOpen, text: '50+ materi pembelajaran lengkap' },
        { icon: MessageCircle, text: 'Grup Telegram eksklusif member' },
        { icon: Award, text: 'Sertifikat digital resmi' },
        { icon: Gift, text: '7+ bonus senilai Rp 10 juta+' },
        { icon: RefreshCw, text: 'Update materi terbaru seumur hidup' },
        { icon: GraduationCap, text: 'Bimbingan 1-on-1 dengan mentor' },
    ],
    lead_magnet: [
        { icon: BookOpen, text: 'Pembelajaran 6 Bab' },
        { icon: Map, text: 'Peta Mulai Bisnis Digital' },
        { icon: RefreshCw, text: 'Update Materi Terbaru' },
        { icon: GraduationCap, text: 'Full Course Access' },
        { icon: BadgePercent, text: 'Affiliate Komisi 50%' },
    ],
    jago_canva: [
        { icon: Users, text: 'Komunitas Eksklusif' },
        { icon: Play, text: 'Video Tutorial Lengkap' },
        { icon: Gift, text: 'Bonus Rekaman Beasiswa Ramadhan' },
        { icon: RefreshCw, text: 'Update Materi Terbaru' },
        { icon: TrendingUp, text: 'Peluang Affiliate' },
    ],
};

const TRUST_BADGES = [
    { icon: ShieldCheck, label: 'Aman & Terpercaya' },
    { icon: Zap, label: 'Akses Instan' },
    { icon: Lock, label: 'Pembayaran Terenkripsi' },
];

const TESTIMONIALS = [
    {
        id: 1,
        image: '/storage/landing3/testimonials/3.png',
        caption: 'Bapak Ini awalnya bingung cara jualan di Sosmed, tapi Diajarin Sampai Bisa Hasilin Rp 80 JUTA',
    },
    {
        id: 2,
        image: '/storage/landing3/testimonials/1.png',
        caption: 'Seorang Bapak-Bapak Guru Ngaji biasa bisa dapetin penghasilan tambahan Rp 5 JUTA',
    },
    {
        id: 3,
        image: '/storage/landing3/testimonials/2.png',
        caption: 'Awalnya Ibu Rumah Tangga ini Takut Jualan, tapi Dibimbing Sampai Berani Jualan dan Dapetin Rp 2 JUTA',
    },
    {
        id: 4,
        image: '/storage/landing3/testimonials/4.png',
        caption: 'Ibu Ini Awalnya Gaptek dan Sibuk Ngurus Anak Tapi Bisa Hasilkan Uang Pertamanya Dari Sosmed',
    },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function TrustBadges() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                    key={label}
                    className="border-primary/20 bg-primary/5 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                >
                    <Icon className="text-primary h-3.5 w-3.5" />
                    <span className="text-foreground/80">{label}</span>
                </div>
            ))}
        </div>
    );
}

function SocialProofBadge() {
    return (
        <div className="border-primary/30 bg-primary/10 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <div className="flex -space-x-1">
                {['S', 'B', 'R'].map((initial, i) => (
                    <div
                        key={i}
                        className="bg-primary/40 border-background text-foreground flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold"
                    >
                        {initial}
                    </div>
                ))}
            </div>
            <span className="text-primary text-sm font-semibold">
                🚀 <span className="text-foreground font-bold">1.400+ </span> orang sudah bergabung
            </span>
        </div>
    );
}

function BenefitList({ benefits }: { benefits: BenefitItem[] }) {
    return (
        <ul className="space-y-3">
            {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                    <div className="bg-primary/10 border-primary/20 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border">
                        <Icon className="text-primary h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground/90 text-sm leading-snug">{text}</span>
                </li>
            ))}
        </ul>
    );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[0] }) {
    return (
        <div className="border-primary/20 bg-card/60 group hover:border-primary/40 hover:shadow-primary/5 overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <div className="overflow-hidden">
                <img
                    src={testimonial.image}
                    alt={`Testimoni ${testimonial.id}`}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <div className="mb-2 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="text-muted-foreground mb-3 text-sm leading-relaxed italic">{testimonial.caption}</p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function Register({
    coursePrice,
    registrationType = 'standard',
    minLeadMagnetPrice = 1,
    registrationProductId = null,
}: RegisterProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
    const [finalPrice, setFinalPrice] = useState(coursePrice);
    const [customAmount, setCustomAmount] = useState<number>(minLeadMagnetPrice);
    const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);
    const [selectedGateway] = useState('duitku');

    const isLeadMagnet = registrationType === 'lead_magnet';

    const productType =
        registrationType == 'standard'
            ? 'Affiliate Jago Jualan Masterclass'
            : registrationType == 'jago_canva'
              ? 'Jago Canva Masterclass'
              : 'Mengenal Manisnya Bisnis Digital Class';

    const { data, setData, processing, errors, setError } = useForm<RegisterForm>({
        name: '',
        phone: '',
        email: '',
        password: '',
    });

    const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);

    const showToast = (message: string, isError = false) => {
        setToast({ message, isError });
        setTimeout(() => setToast(null), 4000);
    };

    const handleVoucherApplied = (voucherData: any) => {
        setAppliedVoucher(voucherData);
        setFinalPrice(voucherData.final_price);
    };

    const handleVoucherRemoved = () => {
        setAppliedVoucher(null);
        setFinalPrice(coursePrice);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLeadMagnet && customAmount < minLeadMagnetPrice) {
            showToast(`Minimal pembayaran adalah Rp ${formatRupiah(minLeadMagnetPrice)}`, true);
            return;
        }

        const priceToCharge = isLeadMagnet ? customAmount : finalPrice;

        const payload = {
            ...data,
            gateway: selectedGateway,
            final_price: priceToCharge,
            voucher_code: appliedVoucher?.voucher?.code || null,
            discount_amount: appliedVoucher?.discount || 0,
            registration_type: registrationType,
            payment_amount: isLeadMagnet ? customAmount : null,
            landing_source: getLandingSource(),
        };

        // ── Kasus harga 0 (voucher 100%) ──
        if (priceToCharge === 0) {
            showToast('Memproses akun...');
            try {
                const res = await axios.post(route('register.force'), payload);
                if (res.data.success) {
                    window.location.href = route('member.index');
                } else {
                    showToast(res.data.message || 'Gagal memproses akun.', true);
                }
            } catch (err: any) {
                showToast(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.', true);
            }
            return;
        }

        // ── Normal flow: redirect ke Duitku ──
        showToast('Memproses pembayaran...');
        try {
            const res = await axios.post(route('register.create-payment'), payload);

            if (res.data.paymentUrl) {
                // Redirect langsung — tidak ada popup, tidak ada delay
                window.location.href = res.data.paymentUrl;
            } else {
                showToast('Gagal mendapatkan link pembayaran. Coba lagi.', true);
            }
        } catch (err: any) {
            // Handle Laravel validation errors
            if (err.response?.data?.errors) {
                const validationErrors = err.response.data.errors;
                Object.keys(validationErrors).forEach((field) => {
                    if (field in data) {
                        setError(field as keyof RegisterForm, validationErrors[field][0]);
                    }
                });
                showToast('Mohon periksa data yang kamu isi.', true);
            } else {
                showToast(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.', true);
            }
        }
    };

    const priceDisplay = isLeadMagnet ? customAmount : finalPrice;
    const originalDisplay = coursePrice;
    const hasDiscount = !isLeadMagnet && appliedVoucher;

    return (
        <>
            <Head title="Daftar & Mulai Belajar" />

            {/* Toast Notification */}
            {toast && (
                <div className="animate-fade-in fixed top-4 right-4 left-4 z-50 sm:left-auto sm:w-auto">
                    <div
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
                            toast.isError ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-primary/40 bg-primary/10 text-primary'
                        }`}
                    >
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="from-background via-background to-secondary/10 min-h-screen bg-gradient-to-br">
                {/* ── Header ── */}
                <header className="border-border/30 bg-background/60 sticky top-0 z-30 border-b backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
                        {/* Constrain AppLogo size in this context */}
                        <div className="[&_a]:flex [&_a]:items-center [&_div]:size-auto [&_img]:h-12 [&_img]:w-auto">
                            <AppLogo />
                        </div>
                        <div className="text-muted-foreground text-sm">
                            Sudah punya akun?{' '}
                            <TextLink href={route('login')} className="text-primary font-medium hover:underline">
                                Masuk
                            </TextLink>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
                    {/* ── Two-column layout (desktop) / single-column (mobile) ── */}
                    <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
                        {/* ════════════════════════════════
                            LEFT COLUMN — social proof + benefits
                        ════════════════════════════════ */}
                        <div className="space-y-8">
                            {/* Social proof badge */}
                            <div className="space-y-4">
                                <SocialProofBadge />
                                <h1 className="text-foreground text-3xl leading-tight font-bold sm:text-4xl">
                                    Akses{' '}
                                    <span className="from-primary via-primary/80 bg-gradient-to-r to-cyan-400 bg-clip-text text-transparent">
                                        {productType}
                                    </span>
                                </h1>
                                <TrustBadges />
                            </div>

                            {/* Benefit list — konten berbeda per tipe produk */}
                            <div className="border-primary/20 bg-card/40 rounded-2xl border p-6 backdrop-blur-sm">
                                <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                                    <CheckCircle className="text-primary h-5 w-5" />
                                    Yang kamu dapatkan:
                                </h2>
                                <BenefitList benefits={BENEFITS_MAP[registrationType]} />
                            </div>

                            {/* Testimonials — DESKTOP ONLY: visible in left column */}
                            {registrationType === 'standard' && (
                                <div className="hidden space-y-4 lg:block">
                                    <h2 className="text-foreground flex items-center gap-2 font-semibold">
                                        <Users className="text-primary h-5 w-5" />
                                        Lihat Hasil Nyata Dari Alumni:
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {TESTIMONIALS.map((t) => (
                                            <TestimonialCard key={t.id} testimonial={t} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ════════════════════════════════
                            RIGHT COLUMN — checkout form
                        ════════════════════════════════ */}
                        <div className="lg:sticky lg:top-16 lg:self-start">
                            <div className="border-primary/20 bg-card/60 overflow-hidden rounded-2xl border shadow-2xl shadow-black/20 backdrop-blur-xl">
                                {/* Form header */}
                                <div className="from-primary/10 to-primary/5 border-primary/20 border-b bg-gradient-to-r px-6 py-5">
                                    <h2 className="text-foreground text-lg font-bold">Daftar Sekarang</h2>
                                    <p className="text-muted-foreground mt-0.5 text-sm">Isi data di bawah untuk mulai belajar</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Nama Lengkap
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            autoComplete="name"
                                            placeholder="Contoh: Sari Putri"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            className="bg-background/50"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Alamat Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="email@gmail.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            className="bg-background/50"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium">
                                            Nomor WhatsApp
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            autoComplete="tel"
                                            placeholder="628xxxxxxxxxx"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={processing}
                                            className="bg-background/50"
                                        />
                                        <InputError message={errors.phone} />
                                        <p className="text-muted-foreground text-xs">Gunakan format internasional: 628xxxx</p>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Buat Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                autoComplete="new-password"
                                                placeholder="Minimal 8 karakter"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                disabled={processing}
                                                className="bg-background/50 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                                                tabIndex={-1}
                                                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Lead magnet PWYW input */}
                                    {isLeadMagnet && (
                                        <div className="space-y-2">
                                            <Label htmlFor="custom_amount" className="text-sm font-medium">
                                                Nominal Pembayaran (Bayar Suka-Suka)
                                            </Label>
                                            <div className="relative">
                                                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">Rp</span>
                                                <Input
                                                    id="custom_amount"
                                                    type="number"
                                                    min={minLeadMagnetPrice}
                                                    value={customAmount}
                                                    onChange={(e) => setCustomAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                                    disabled={processing}
                                                    className="bg-background/50 pl-10"
                                                    placeholder={`Minimal ${formatRupiah(minLeadMagnetPrice)}`}
                                                />
                                            </div>
                                            <p className="text-muted-foreground text-xs">Minimal: Rp {formatRupiah(minLeadMagnetPrice)}</p>
                                        </div>
                                    )}

                                    {/* Voucher input — only for standard/jago_canva */}
                                    {!isLeadMagnet && (
                                        <VoucherInput
                                            onVoucherApplied={handleVoucherApplied}
                                            onVoucherRemoved={handleVoucherRemoved}
                                            originalPrice={coursePrice}
                                            registrationType={registrationType}
                                            productId={registrationProductId ?? undefined}
                                            disabled={processing}
                                        />
                                    )}

                                    {/* Order summary */}
                                    <div className="border-primary/20 bg-primary/5 space-y-2 rounded-xl border p-4">
                                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Ringkasan Pesanan</p>
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-foreground/80 text-sm">{productType}</span>
                                            <div className="text-right">
                                                {hasDiscount && (
                                                    <div className="text-muted-foreground text-xs line-through">
                                                        Rp {formatRupiah(originalDisplay)}
                                                    </div>
                                                )}
                                                <div className="text-primary text-lg font-bold">Rp {formatRupiah(priceDisplay)}</div>
                                                {hasDiscount && (
                                                    <div className="text-xs font-medium text-green-400">
                                                        Hemat Rp {formatRupiah(appliedVoucher.discount)}!
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        id="checkout-btn"
                                        type="submit"
                                        disabled={processing}
                                        className="hover:bg-primary/90 h-12 w-full rounded-xl text-base font-bold text-white/90 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:opacity-60"
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>🔒 Bayar Sekarang</>
                                        )}
                                    </Button>

                                    {/* Micro trust copy */}
                                    <p className="text-muted-foreground text-center text-xs leading-relaxed">🔒 Pembayaran diproses secara aman.</p>
                                </form>
                            </div>

                            {/* Guarantee note */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-center">
                                <ShieldCheck className="text-primary h-4 w-4 shrink-0" />
                                <p className="text-muted-foreground text-xs">Akses seumur hidup </p>
                            </div>
                        </div>
                    </div>
                    {/* end grid */}

                    {/* Testimonials — MOBILE ONLY: below form, hidden on desktop */}
                    {registrationType === 'standard' && (
                        <div className="mt-30 space-y-4 lg:hidden">
                            <h2 className="text-foreground flex items-center gap-2 font-semibold">
                                <Users className="text-primary h-5 w-5" />
                                Lihat Hasil Nyata Dari Alumni:
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {TESTIMONIALS.map((t) => (
                                    <TestimonialCard key={t.id} testimonial={t} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
