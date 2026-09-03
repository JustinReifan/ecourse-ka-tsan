import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check, Rocket, Star, Users, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CtaButton2 } from './cta-button-2';

const benefits = [
    {
        title: 'Grup WhatsApp Kecil (Maks 10 Orang)',
        description: 'Pendampingan intimate, pertanyaanmu tidak akan tenggelam.',
    },
    {
        title: 'Pendampingan 70 Hari Penuh',
        description: 'Bukan cuma akses video ,  kamu dibimbing sampai bisa praktik.',
    },
    {
        title: '10 Tugas Praktek Dikoreksi Langsung',
        description: 'Setiap tugas dikoreksi oleh mentor, jadi kamu tahu progress sudah benar.',
    },
    {
        title: 'Chat 1-on-1 Tanpa Batas',
        description: 'Bebas tanya kapan pun mentok, tanpa biaya tambahan.',
    },
    {
        title: 'Materi Jualan Sosmed Lengkap',
        description: 'Semua yang dibutuhkan untuk mulai cuan dari sosmed.',
    },
    {
        title: 'Sertifikat Digital + Ebook Bonus',
        description: 'Bonus untuk peserta yang menyelesaikan program sampai akhir.',
    },
];

interface PricingSectionProps {
    coursePrice: number;
}

interface BenefitItemProps {
    benefit: (typeof benefits)[0];
    index: number;
}

function BenefitItem({ benefit, index }: BenefitItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        'group flex items-start gap-4 rounded-xl p-4 transition-all duration-500',
                        'hover:bg-primary/5 hover:border-primary/20 border border-transparent',
                        'animate-fade-in cursor-pointer',
                    )}
                    style={{ animationDelay: `${800 + index * 100}ms`, animationFillMode: 'both' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full',
                            'bg-primary/20 border-primary/50 flex-shrink-0 border-2',
                            'transition-all duration-300',
                            'group-hover:bg-primary/30 group-hover:border-primary',
                            'group-hover:shadow-primary/30 group-hover:shadow-lg',
                        )}
                    >
                        <Check className={cn('text-primary h-3 w-3 transition-all duration-300', isHovered && 'scale-110')} />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="text-foreground group-hover:text-primary leading-tight font-medium transition-colors duration-300">
                            {benefit.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
                <p className="text-sm">{benefit.description}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export function PricingSection({ coursePrice: _coursePrice }: PricingSectionProps) {
    const [isCardHovered, setIsCardHovered] = useState(false);
    const { trackCTA } = useAnalytics();
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 }; // reset
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Campaign price is fixed by the approved Gumpreneur product brief.
    const displayPrice = 399000;
    const formattedPrice = new Intl.NumberFormat('id-ID').format(displayPrice);

    const handleButton = () => {
        trackCTA('pricing_card', 'Gabung Sekarang', route('register'));
        router.visit(route('register'), {
            method: 'get',
        });
    };

    return (
        <section className="relative overflow-hidden py-12 lg:py-32" id="pricing-section">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="space-y-12 sm:space-y-16">
                    {/* Section Header */}
                    <div className="space-y-4 sm:space-y-6 text-center">
                        <div className="animate-fade-in">
                            <div className="bg-destructive/10 border-destructive/20 text-destructive inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm animate-pulse">
                                <Star className="h-4 w-4" />
                                <span className="text-sm font-bold">PROMO KHUSUS HARI INI</span>
                            </div>
                        </div>

                        <div className="animate-fade-in space-y-4" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                            <h2 className="text-foreground text-3xl font-bold sm:text-5xl lg:text-6xl px-2">
                                <span className="text-foreground block bg-clip-text mb-2">Investasi Leher ke Atas,</span>
                                <span className="text-primary bg-clip-text">Modal Sekali Buat Cuan Berkali-kali!</span>
                            </h2>
                            <p className="text-muted-foreground mx-auto max-w-3xl text-base sm:text-xl leading-relaxed px-4">
                                Khusus buat Bunda/Kakak yang beneran mau mulai, mumpung lagi <strong>DISKON GEDE-GEDEAN!</strong>
                            </p>

                            {/* Countdown Timer */}
                            <div className="bg-destructive/5 border border-destructive/10 mx-auto max-w-2xl rounded-2xl p-4">
                                <div className="flex items-center justify-center gap-2 mb-3 text-destructive font-bold text-sm sm:text-base">
                                    <Timer className="w-4 h-4 animate-pulse" />
                                    <span>PROMO BERAKHIR DALAM:</span>
                                </div>
                                <div className="flex justify-center gap-3 sm:gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-background border border-destructive/20 text-foreground font-mono font-bold text-xl sm:text-2xl rounded-lg w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-sm">
                                            {String(timeLeft.hours).padStart(2, '0')}
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1 font-medium">JAM</span>
                                    </div>
                                    <div className="text-destructive font-bold text-xl sm:text-2xl mt-2">:</div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-background border border-destructive/20 text-foreground font-mono font-bold text-xl sm:text-2xl rounded-lg w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-sm">
                                            {String(timeLeft.minutes).padStart(2, '0')}
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1 font-medium">MENIT</span>
                                    </div>
                                    <div className="text-destructive font-bold text-xl sm:text-2xl mt-2">:</div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-background border border-destructive/20 text-destructive font-mono font-bold text-xl sm:text-2xl rounded-lg w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-sm animate-pulse">
                                            {String(timeLeft.seconds).padStart(2, '0')}
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1 font-medium">DETIK</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="animate-fade-in mx-auto max-w-2xl px-2 sm:px-0" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                        <div
                            className={cn(
                                'relative overflow-visible rounded-3xl',
                                'from-card/80 to-card/40 bg-gradient-to-br backdrop-blur-sm',
                                'border-2 transition-all duration-700',
                                isCardHovered
                                    ? 'border-primary/60 shadow-primary/30 scale-[1.02] shadow-2xl'
                                    : 'border-primary/30 shadow-primary/20 shadow-xl',
                            )}
                            onMouseEnter={() => setIsCardHovered(true)}
                            onMouseLeave={() => setIsCardHovered(false)}
                        >
                            {/* Animated Background Glow */}
                            <div
                                className={cn(
                                    'from-primary/20 via-primary/10 to-primary/20 absolute inset-0 bg-gradient-to-r',
                                    'opacity-0 transition-opacity duration-700 rounded-3xl',
                                    isCardHovered && 'animate-gradient-x opacity-100',
                                )}
                            />

                            {/* Limited Badge */}
                            <div className="absolute -top-4 left-1/2 z-10 w-full text-center -translate-x-1/2">
                                <div className="inline-block bg-primary text-primary-foreground shadow-primary/40 rounded-full px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-bold shadow-lg">
                                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                        MAKS 10 ORANG PER GRUP
                                    </div>
                                </div>
                            </div>

                            <div className="relative space-y-6 sm:space-y-8 p-5 sm:p-8 lg:p-12 mt-4 sm:mt-0">
                                {/* Price Display */}
                                <div className="space-y-2 sm:space-y-4 text-center">
                                    <div className="inline-block bg-destructive/10 border border-destructive/20 text-destructive px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold mb-1 animate-pulse">
                                        DISKON SPESIAL HARI INI
                                    </div>
                                    <div className="text-muted-foreground line-through text-base sm:text-xl font-semibold opacity-60">
                                        Rp 1.500.000
                                    </div>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-primary text-xl sm:text-3xl font-medium">Rp</span>
                                        <span className="text-foreground text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{formattedPrice}</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm sm:text-base">Harga coret khusus buat Bunda yang siap action!</p>
                                </div>

                                {/* Benefits Grid */}
                                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 pt-2 sm:pt-4">
                                    {benefits.map((benefit, index) => (
                                        <BenefitItem key={benefit.title} benefit={benefit} index={index} />
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <div className="space-y-4 text-center pt-2">
                                    <CtaButton2
                                        onClick={handleButton}
                                        data-cta-zone="pricing_submit"
                                        withInstruction
                                        size="lg"
                                        className={cn(
                                            'relative w-full overflow-hidden px-8 sm:px-16 lg:w-auto',
                                            'shadow-primary/40 hover:shadow-primary/60 shadow-2xl',
                                            'animate-glow-pulse cursor-pointer text-sm sm:text-base',
                                        )}
                                    >
                                        Ambil Diskon Sekarang
                                        <Rocket className="ms-2 inline h-4 w-4 sm:h-5 sm:w-5" />
                                        <div className="bg-primary absolute top-0 right-0 h-3 w-3 animate-ping rounded-full" />
                                    </CtaButton2>
                                </div>
                            </div>

                            {/* Corner Glow Effects */}
                            <div className="bg-primary/20 absolute top-0 left-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full blur-2xl" />
                            <div
                                className="bg-primary/20 absolute right-0 bottom-0 h-32 w-32 translate-x-16 translate-y-16 rounded-full blur-2xl"
                                style={{ animationDelay: '1s' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
