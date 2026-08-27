import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { useAnalytics } from '@/hooks/use-analytics';
import { Award, BookCheck } from 'lucide-react';

interface BenefitCardProps {
    title: string;
    description: string;
    delay?: number;
    gradient: string;
}

export function PainPointSection() {
    const { trackCTA } = useAnalytics();

    const painPoints = [
        'Sudah pernah coba jualan (termasuk stok produk fisik) tapi perputarannya tidak stabil ,  modal keluar, hasil tidak jelas.',
        'Punya cicilan/utang yang jadi beban pikiran sehari-hari.',
        'Gaptek dan merasa dunia digital/sosmed itu rumit ,  takut tidak akan sanggup mengikuti.',
        'Takut uang yang dikeluarkan untuk belajar tidak balik modal.',
        'Kalau belajar sendiri lewat video course biasa, gampang berhenti di tengah jalan karena tidak ada yang mengoreksi progres.',
    ];

    const handleCtaClick = () => {
        trackCTA('pain_point_section', 'Gabung Sekarang', '#pricing-section');
        // scroll to pricing section
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="border-border/20 relative overflow-hidden border-t pt-6 pb-10 sm:py-10 lg:py-32">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-4 sm:mb-6 text-center lg:mb-16">
                    <h2 className="text-foreground mb-3 text-2xl font-bold lg:text-6xl">
                        Kenapa Bunda/Kakak Masih <span className="text-primary text-4xl lg:text-6xl">KETINGGALAN?</span>
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-3xl text-sm sm:text-lg md:text-xl px-2">
                        Udah capek kan ngeliat orang lain gampang banget cuan dari HP? Sementara Bunda masih pusing muter otak mikirin cara nambah pemasukan keluarga...
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12 max-w-7xl mx-auto">
                    {/* Visual Section */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="h-full border-border/20 shadow-primary/5 relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xl sm:shadow-2xl min-h-[300px]">
                            {/* Main image */}
                            <img
                                src="/landing/whyjoin.png"
                                alt="Kenapa kamu tertinggal"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
                                loading="lazy"
                            />
                            <div className="from-background/90 absolute inset-0 bg-gradient-to-t via-background/20 to-transparent" />

                            {/* Stats overlay */}
                            <div className="absolute right-3 bottom-3 left-3 sm:right-5 sm:bottom-5 sm:left-5">
                                <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 flex-wrap">
                                    <div className="bg-background/80 border-border/20 rounded-xl border px-3 sm:px-4 py-2 backdrop-blur-md flex-1 text-center shadow-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            <Award className="text-primary h-4 w-4 shrink-0" />
                                            <span className="text-foreground text-xs sm:text-sm font-semibold">E-certificate</span>
                                        </div>
                                    </div>
                                    <div className="bg-background/80 border-border/20 rounded-xl border px-3 sm:px-4 py-2 backdrop-blur-md flex-1 text-center shadow-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            <BookCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                            <span className="text-foreground text-xs sm:text-sm font-semibold">Free E-book</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pain Points List */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="from-primary/5 via-background to-background/50 border-border/40 rounded-3xl border bg-gradient-to-br p-5 sm:p-6 lg:p-8 backdrop-blur-xl shadow-lg h-full flex flex-col justify-center">
                            <div className="space-y-3 sm:space-y-4">
                                {painPoints.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 sm:gap-4 bg-background/80 border border-border/50 shadow-sm rounded-xl p-3 sm:p-4 hover:border-primary/30 transition-colors">
                                        <div className="mt-0.5 bg-destructive/10 p-1.5 rounded-full flex-shrink-0">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="block text-sm sm:text-base text-foreground/90 leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 sm:pt-8 text-center md:text-start mt-auto">
                                <h3 className="text-foreground text-lg sm:text-xl font-medium md:text-2xl leading-snug">Kalau dibiarkan, 5 tahun lagi Bunda <br className="hidden sm:block"/> bakal tetep pusing sama masalah yang sama.</h3>
                                <p className="text-muted-foreground mt-2 text-sm sm:text-base">Makin lama ditunda, makin susah nanti ngejarnya lho, Bund.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unique Mechanism Bridge - MOVED OUTSIDE GRID TO FIX LAYOUT */}
                <div className="mt-12 lg:mt-20 mx-auto max-w-4xl text-center">
                    <h3 className="text-primary text-2xl font-bold md:text-3xl lg:text-4xl leading-tight">Kenapa Video Course Biasa <br className="hidden sm:block"/> Gagal Bikin Bunda Cuan?</h3>
                    <p className="text-muted-foreground mt-3 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">Karena belajar sendirian tanpa dikoreksi = nggak tau apakah udah bener atau masih salah jalan.</p>
                    
                    <div className="from-primary/10 border-primary/20 mt-8 rounded-2xl sm:rounded-3xl border bg-gradient-to-r p-6 sm:p-8 lg:p-10 text-left backdrop-blur-sm shadow-md">
                        <h4 className="text-foreground mb-5 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-3">
                            <span className="bg-primary/20 text-primary p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </span>
                            Inilah yang bikin Gumpreneur BEDA banget:
                        </h4>
                        <ul className="text-muted-foreground space-y-4 sm:space-y-5">
                            <li className="flex items-start gap-3 sm:gap-4">
                                <div className="mt-0.5 bg-emerald-500/10 p-1.5 rounded-full flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-base sm:text-lg leading-relaxed text-foreground/90"><strong>Grup WA kecil</strong>, maksimal 10 orang aja, jadi Bunda bakal bener-bener diperhatiin.</span>
                            </li>
                            <li className="flex items-start gap-3 sm:gap-4">
                                <div className="mt-0.5 bg-emerald-500/10 p-1.5 rounded-full flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-base sm:text-lg leading-relaxed text-foreground/90"><strong>10 tugas dikoreksi langsung sama mentor</strong>, bukan cuma nonton video terus dibiarin bingung.</span>
                            </li>
                            <li className="flex items-start gap-3 sm:gap-4">
                                <div className="mt-0.5 bg-emerald-500/10 p-1.5 rounded-full flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-base sm:text-lg leading-relaxed text-foreground/90"><strong>Bebas nanya 1-on-1 via chat</strong>, kapan aja Bunda mentok, langsung tanya aja!</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-8 lg:mt-10">
                    <CtaButton2 onClick={handleCtaClick} size="lg" withInstruction>
                        Gabung Sekarang
                    </CtaButton2>
                </div>
            </div>
        </section>
    );
}
