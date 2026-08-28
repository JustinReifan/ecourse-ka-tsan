import AppLogo from '@/components/app-logo';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Clock, Loader2, MessageCircle, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface StatusPageProps {
    orderId: string | null;
}

type PaymentStatus = 'verifying' | 'success' | 'failed' | 'timeout' | 'error';

const POLL_INTERVAL_MS = 5000; // 5 detik
const TIMEOUT_MS = 180000; // 3 menit

export default function PaymentStatusPage({ orderId }: StatusPageProps) {
    const [status, setStatus] = useState<PaymentStatus>('verifying');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const purchaseTrackedRef = useRef(false);

    const stopPolling = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (tickRef.current) clearInterval(tickRef.current);
    };

    const checkStatus = async () => {
        if (!orderId) {
            setStatus('error');
            return;
        }
        try {
            const res = await axios.get(`/api/payment/check/${orderId}`);
            const orderStatus: string = res.data.status;

            if (orderStatus === 'completed') {
                stopPolling();
                setStatus('success');
                if (!purchaseTrackedRef.current) {
                    purchaseTrackedRef.current = true;
                    window.fbq?.(
                        'track',
                        'Purchase',
                        {
                            content_name: 'Gumpreneur',
                            content_type: 'product',
                            content_ids: ['gumpreneur'],
                            value: Number(res.data.amount || 0),
                            currency: 'IDR',
                        },
                        { eventID: `purchase-${orderId}` },
                    );
                }
            } else if (orderStatus === 'failed') {
                stopPolling();
                setStatus('failed');
            }
            // 'pending' → terus polling
        } catch {
            // Network error → terus polling, jangan langsung fail
        }
    };

    useEffect(() => {
        if (!orderId) {
            setStatus('error');
            return;
        }

        // Cek langsung saat mount (mungkin webhook sudah selesai)
        checkStatus();

        // Polling setiap 5 detik
        intervalRef.current = setInterval(checkStatus, POLL_INTERVAL_MS);

        // Timeout setelah 3 menit
        timeoutRef.current = setTimeout(() => {
            stopPolling();
            setStatus((prev) => (prev === 'verifying' ? 'timeout' : prev));
        }, TIMEOUT_MS);

        // Counter untuk UI progress
        tickRef.current = setInterval(() => {
            setElapsedSeconds((s) => s + 1);
        }, 1000);

        return stopPolling;
    }, [orderId]);

    const adminWhatsapp = import.meta.env.VITE_ADMIN_WHATSAPP || '6281234567890';
    const waMessage = encodeURIComponent(`Halo Admin, saya perlu bantuan verifikasi pembayaran. Order ID: ${orderId}`);
    const waUrl = `https://wa.me/${adminWhatsapp}?text=${waMessage}`;

    const progressPercent = Math.min((elapsedSeconds / (TIMEOUT_MS / 1000)) * 100, 100);

    return (
        <>
            <Head title="Status Pembayaran" />

            <div className="from-background via-background to-secondary/10 flex min-h-screen flex-col bg-gradient-to-br">
                {/* Header minimal — compact */}
                <header className="border-border/30 bg-background/60 border-b backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
                        <div className="[&_a]:flex [&_a]:items-center [&_img]:h-10 [&_img]:w-auto [&_div]:size-auto">
                            <AppLogo />
                        </div>
                    </div>
                </header>

                {/* Main content — centered */}
                <main className="flex flex-1 items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md">
                        {/* Background glow decoration */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="bg-primary/5 absolute top-1/3 left-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl" />
                            <div
                                className="absolute right-1/4 bottom-1/3 h-48 w-48 animate-pulse rounded-full bg-cyan-500/5 blur-2xl"
                                style={{ animationDelay: '1.5s' }}
                            />
                        </div>

                        <div className="border-border/40 bg-card/60 relative rounded-2xl border p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                            {/* ── VERIFYING STATE ── */}
                            {status === 'verifying' && (
                                <div className="space-y-6 text-center">
                                    <div className="bg-primary/10 border-primary/20 mx-auto flex h-20 w-20 items-center justify-center rounded-full border">
                                        <Loader2 className="text-primary h-10 w-10 animate-spin" />
                                    </div>

                                    <div>
                                        <h1 className="text-foreground mb-2 text-2xl font-bold">Memverifikasi Pembayaran...</h1>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Kami sedang mengkonfirmasi pembayaran kamu. Proses ini biasanya memakan waktu kurang dari 1 menit.
                                            <br />
                                            <span className="mt-1 inline-block font-medium">Mohon jangan tutup halaman ini.</span>
                                        </p>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="space-y-2">
                                        <div className="bg-border/50 h-1.5 w-full overflow-hidden rounded-full">
                                            <div
                                                className="bg-primary/60 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            Menunggu konfirmasi... ({Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')})
                                        </p>
                                    </div>

                                    {/* Reassurance dots */}
                                    <div className="flex items-center justify-center gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
                                                style={{ animationDelay: `${i * 200}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── SUCCESS STATE ── */}
                            {status === 'success' && (
                                <div className="space-y-6 text-center">
                                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                                        <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500/40 bg-green-500/20">
                                            <CheckCircle className="h-10 w-10 text-green-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">Pembayaran Berhasil! 🎉</h1>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Akun kamu sudah aktif dan siap digunakan. Selamat bergabung! Yuk mulai belajar sekarang.
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-border/40 border-t" />

                                    {/* Full-page navigation: triggers Laravel Auth::login via payment.login route */}
                                    <a
                                        href={`/payment/login/${orderId}`}
                                        className="bg-primary hover:bg-primary/90 block w-full rounded-xl py-4 text-center text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                    >
                                        Lanjutkan ke Member Area →
                                    </a>

                                    <p className="text-muted-foreground text-xs">Kamu akan diarahkan ke halaman member untuk mulai belajar.</p>
                                </div>
                            )}

                            {/* ── FAILED STATE ── */}
                            {status === 'failed' && (
                                <div className="space-y-6 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/30 bg-red-500/10">
                                        <XCircle className="h-10 w-10 text-red-400" />
                                    </div>

                                    <div>
                                        <h1 className="text-foreground mb-2 text-2xl font-bold">Pembayaran Gagal</h1>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Pembayaran kamu tidak berhasil diproses. Silakan coba kembali. Jika masalah berlanjut, hubungi admin kami.
                                        </p>
                                    </div>

                                    <div className="border-border/40 border-t" />

                                    <div className="space-y-3">
                                        <a
                                            href={route('register')}
                                            className="border-border/50 bg-card/80 text-foreground hover:border-primary/40 hover:bg-primary/5 block w-full rounded-xl border py-3 text-center text-sm font-medium transition-all duration-300"
                                        >
                                            Coba Daftar Lagi
                                        </a>
                                        <a
                                            href={waUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600/20 py-3 text-sm font-medium text-green-400 transition-all duration-300 hover:bg-green-600/30"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            Hubungi Admin via WhatsApp
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* ── TIMEOUT STATE ── */}
                            {status === 'timeout' && (
                                <div className="space-y-6 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-500/30 bg-yellow-500/10">
                                        <Clock className="h-10 w-10 text-yellow-400" />
                                    </div>

                                    <div>
                                        <h1 className="text-foreground mb-2 text-2xl font-bold">Verifikasi Membutuhkan Waktu Lebih</h1>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Pembayaran kamu sedang dalam antrian verifikasi dari pihak bank/penyedia pembayaran. Proses ini mungkin
                                            memakan waktu lebih lama dari biasanya.
                                        </p>
                                    </div>

                                    <div className="border-border/40 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-left">
                                        <p className="mb-1 text-sm font-medium text-yellow-400">Yang perlu kamu lakukan:</p>
                                        <ul className="text-muted-foreground space-y-1 text-sm">
                                            <li>1. Screenshot halaman ini sebagai bukti</li>
                                            <li>
                                                2. Simpan ID pesanan kamu: <code className="text-foreground font-mono text-xs">{orderId}</code>
                                            </li>
                                            <li>3. Hubungi admin via WhatsApp di bawah</li>
                                        </ul>
                                    </div>

                                    <div className="border-border/40 border-t" />

                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600/20 py-4 text-base font-semibold text-green-400 transition-all duration-300 hover:scale-[1.02] hover:bg-green-600/30"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Hubungi Admin via WhatsApp
                                    </a>
                                </div>
                            )}

                            {/* ── ERROR STATE (no orderId) ── */}
                            {status === 'error' && (
                                <div className="space-y-6 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/30 bg-red-500/10">
                                        <AlertTriangle className="h-10 w-10 text-red-400" />
                                    </div>

                                    <div>
                                        <h1 className="text-foreground mb-2 text-2xl font-bold">Terjadi Kesalahan</h1>
                                        <p className="text-muted-foreground text-sm">
                                            Informasi order tidak ditemukan. Silakan hubungi admin jika kamu sudah melakukan pembayaran.
                                        </p>
                                    </div>

                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600/20 py-4 text-base font-semibold text-green-400 transition-all duration-300 hover:bg-green-600/30"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Hubungi Admin via WhatsApp
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Footer info */}
                        <p className="text-muted-foreground mt-6 text-center text-xs">
                            Butuh bantuan?{' '}
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Chat admin kami
                            </a>
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
