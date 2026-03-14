import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { useAnalytics } from '@/hooks/use-analytics';
import { Sparkles } from 'lucide-react';

export function LearningBenefits() {
    const { trackVisit, trackCTA } = useAnalytics();

    const handleCtaClick = () => {
        trackCTA('benefits_section', 'Gabung Sekarang', '#pricing-section');
        // scroll to pricing section
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const benefits = [
        'Cara download aplikasi Canva',
        'Mengenal Canva dasar',
        'Cara membuat template reels',
        'Cara membuat kartu anak muslim',
        'Cara membuat amplop lebaran',
        'Cara membuat tuding ngaji',
        'Cara membuat buku tulis beserta cover',
        'Cara membuat permainan ular tangga',
        'Cara membuat flashcard perkalian',
        'Cara membuat meal planner Ramadhan',
        'Cara membuat template carousel jualan',
        'Cara membuat desain promosi story WA',
        'Cara membuat sticker produk',
        'Cara membuat desain ebook profesional',
        'Cara menghias landing page Lynk ID',
        'Cara membuat video animasi',
        'Cara membuat game interaktif Canva AI',
        'Cara membuat video undangan pernikahan',
        'Cara membuat worksheet anak',
        'Cara membuat website sederhana',
        'Cara membuat gantungan kunci',
        'Cara membuat kuis kategori',
        'Cara create video VEO 3',
        'Cara membuat game interaktif presentasi',
        'Cara membuat template kalender digital',
        "Cara membuat video murottal Al-Qur'an",
        'Cara menjadikan kode dengan Canva AI',
        'Cara membuat carousel panorama aesthetic',
        'Pengenalan fitur tambahan Canva khusus Apps guna mendukung kebutuhan Desain',
    ];

    return (
        <section className="relative py-6 lg:py-32">
            {/* Background Effect */}
            <div className="via-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* 1. HEADER SECTION (Badge, Headline, Subheadline) */}
                <div className="mx-auto mb-8 max-w-4xl space-y-6 text-center md:mb-16">
                    {/* Badge */}
                    <div className="border-primary/20 bg-primary/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                        <Sparkles className="text-primary h-4 w-4" />
                        <span className="text-primary text-sm font-medium">Module Pembelajaran</span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        <span className="block">Apa Yang Kamu Pelajari</span>
                        <span className="from-primary via-primary/80 to-primary mt-1 block bg-gradient-to-r bg-clip-text text-transparent">
                            Di Kelas Jago Canva
                        </span>
                    </h3>

                    {/* Subheadline */}
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
                        Bukan cuma di ajarin bikin desain yang keren, tapi juga sangat bisa dijadikan{' '}
                        <span className="font-bold"> peluang cuan!</span>
                    </p>
                </div>

                {/* Container diubah: lg:max-w-4xl -> lg:max-w-lg */}
                <div className="relative mx-auto mb-6 w-full max-w-xl md:max-w-2xl">
                    <div className="from-primary/10 via-primary/5 to-accent/10 border-primary/20 rounded-2xl border bg-gradient-to-r p-6 backdrop-blur-xl">
                        {/* LIST BENEFITS */}
                        <ul className="text-muted-foreground space-y-4 text-lg leading-tight lg:text-xl">
                            {benefits.map((item, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <span className="bg-primary mt-2.5 h-2 w-2 flex-shrink-0 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

                                    <span className="block">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. CTA SECTION */}
                <div className="flex justify-center md:mt-16">
                    <CtaButton2 size="lg" withInstruction onClick={handleCtaClick}>
                        Gabung Sekarang
                    </CtaButton2>
                </div>
            </div>
        </section>
    );
}
