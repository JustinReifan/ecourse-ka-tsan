import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { Award, BookOpen, Gift, Sparkles } from 'lucide-react';

export function BonusSection() {
    const { trackCTA } = useAnalytics();

    const handleCtaClick = () => {
        trackCTA('bonus_section', 'Gabung Sekarang', '#pricing-section');
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative overflow-hidden py-6 lg:py-32">
            {/* Background Effects */}
            <div className="from-background via-background to-primary/5 absolute inset-0 bg-gradient-to-br" />
            <div className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Bonus Introduction */}
                <div className="mb-12 space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="border-primary/20 bg-primary/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                            <Gift className="text-primary h-4 w-4" />
                            <span className="text-primary text-sm font-medium">Bonus Penyelesaian</span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            <p className="text-foreground">Bonus Khusus untuk yang</p>
                            <p className="mt-2">
                                <span className="from-primary via-primary/80 to-primary bg-gradient-to-r bg-clip-text text-transparent">
                                    Bertahan Sampai Akhir
                                </span>
                            </p>
                        </h2>

                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
                            Sengaja tidak ada bonus berlebihan , untuk memastikan yang gabung benar-benar serius.
                        </p>
                    </div>
                </div>

                {/* Bonus Cards */}
                <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Bonus 1: Sertifikat Digital */}
                    <div
                        className={cn(
                            'group relative overflow-hidden rounded-2xl',
                            'from-card/90 to-card/50 bg-gradient-to-br backdrop-blur-sm',
                            'border-border/30 hover:border-primary/40 border',
                            'transition-all duration-700 hover:-translate-y-1 hover:scale-[1.01]',
                            'hover:shadow-primary/10 hover:shadow-2xl',
                        )}
                    >
                        <div className="p-8 text-center">
                            <div className="bg-primary/10 border-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                                <Award className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="text-foreground mb-2 text-2xl font-bold">Sertifikat Digital</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Dapatkan sertifikat digital resmi setelah menyelesaikan seluruh program bimbingan 70 hari.
                            </p>
                            <div className="mt-4">
                                <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                                    <Sparkles className="h-3 w-3" />
                                    GRATIS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bonus 2: Ebook */}
                    <div
                        className={cn(
                            'group relative overflow-hidden rounded-2xl',
                            'from-card/90 to-card/50 bg-gradient-to-br backdrop-blur-sm',
                            'border-border/30 hover:border-primary/40 border',
                            'transition-all duration-700 hover:-translate-y-1 hover:scale-[1.01]',
                            'hover:shadow-primary/10 hover:shadow-2xl',
                        )}
                    >
                        <div className="p-8 text-center">
                            <div className="bg-primary/10 border-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                                <BookOpen className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="text-foreground mb-2 text-2xl font-bold">Ebook &quot;Ubah Hobi Jadi Cuan&quot;</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Panduan eksklusif untuk mengubah hobi menjadi penghasilan , senilai Rp99.000, GRATIS untuk kamu.
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <span className="text-muted-foreground text-sm line-through">Rp99.000</span>
                                <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                                    <Sparkles className="h-3 w-3" />
                                    GRATIS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <CtaButton2
                        onClick={handleCtaClick}
                        size="lg"
                        className="group"
                        withInstruction
                        instructionText="Gabung sekarang dan klaim bonusmu"
                    >
                        <Sparkles className="me-3 inline-block h-3 w-3 group-hover:animate-spin" />
                        <span>Gabung Sekarang</span>
                    </CtaButton2>
                </div>
            </div>
        </section>
    );
}
