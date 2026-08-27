import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { useAnalytics } from '@/hooks/use-analytics';

interface BenefitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
    gradient: string;
}

export function PainPointSection() {
    const { trackCTA } = useAnalytics();

    const painPoints = [
        'Ga punya skill nya',
        'Gak tau langkah awalnya',
        'Sudah punya Canva tapi gak tau mau dipakai untuk apa',
        'Gak bisa desain padahal pengen bikin produk digital',
        'Takut kalah sama yang sudah jago desain',
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
        <section className="border-border/20 relative overflow-hidden border-t py-10 lg:py-32">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-6 text-center lg:mb-16">
                    <h2 className="text-foreground mb-3 text-2xl sm:text-3xl lg:text-4xl font-bold">
                        Aku Tahu Kamu Pengen Punya Penghasilan Tambahan, <span className="text-primary">Tapi Bingung:</span>
                    </h2>
                </div>

                {/* Main Content Grid */}
                <div className="mx-auto max-w-2xl items-center gap-8">
                    <div className="from-primary/10 via-primary/5 to-accent/10 border-primary/20 rounded-2xl border bg-gradient-to-r p-6 backdrop-blur-xl">
                        {/* LIST PAIN POINTS */}
                        <ul className="text-muted-foreground space-y-4 text-base sm:text-lg leading-tight">
                            {painPoints.map((item, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <span className="bg-primary mt-2.5 h-2 w-2 flex-shrink-0 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

                                    <span className="block">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-5 text-center md:text-start">
                            <h3 className="text-foreground text-xl font-semibold">Tenang, Kamu gak sendiri!</h3>
                            <p className="text-muted-foreground mt-1 text-base sm:text-lg">Aku dulu ngalamin hal yang sama.</p>
                        </div>
                    </div>
                    <div className="py-4 text-center text-base sm:text-lg leading-tight font-semibold md:py-6">
                        <h3 className="text-primary text-xl font-semibold">Kabar baiknya, Di Kelas Ini,</h3>
                        <p className="text-foreground mt-1">Kamu akan belajar skill digital yang bisa bantu kamu punya penghasilan tambahan.</p>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <CtaButton2 onClick={handleCtaClick} size="lg" withInstruction>
                            Gabung Sekarang
                        </CtaButton2>
                    </div>
                </div>
            </div>
        </section>
    );
}
