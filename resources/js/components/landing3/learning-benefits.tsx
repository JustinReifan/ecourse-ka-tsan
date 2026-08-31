import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { useAnalytics } from '@/hooks/use-analytics';
import { Sparkles } from 'lucide-react';

const benefits = [
    {
        title: 'Grup WhatsApp Kecil (Maks 10 Orang)',
        description: 'Grup kecil agar pertanyaanmu tidak tenggelam dan tetap diperhatikan.',
    },
    {
        title: 'Pendampingan 70 Hari Penuh',
        description: 'Dibimbing selama 70 hari sampai kamu benar-benar bisa praktik.',
    },
    {
        title: '10 Tugas Praktek Dikoreksi Mentor',
        description: 'Setiap tugas dikoreksi agar kamu tahu sudah berada di jalur yang benar.',
    },
    {
        title: 'Bebas Tanya 1-on-1 Via Chat',
        description: 'Kapan pun mentok, langsung tanya. Tanpa biaya tambahan, tanpa jadwal terbatas.',
    },
    {
        title: 'Materi Jualan Sosmed Lengkap',
        description: 'Pelajari niche, Lynk.id, konten, Instagram, TikTok, dan WhatsApp.',
    },
    {
        title: 'Sertifikat Digital Gratis',
        description: 'Dapat sertifikat digital setelah menyelesaikan program sampai akhir.',
    },
    {
        title: 'Ebook "Ubah Hobi Jadi Cuan" (Senilai Rp99.000)',
        description: 'Bonus eksklusif untuk peserta yang bertahan sampai selesai program.',
    },
];

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

    return (
        <section id="benefits" className="relative py-6 lg:py-32">
            {/* Background Effect */}
            <div className="via-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Outcome / Expected Outcome Section */}
                <div className="mx-auto mb-12 max-w-4xl space-y-6 text-center md:mb-16">
                    <div className="border-primary/20 bg-primary/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                        <Sparkles className="text-primary h-4 w-4" />
                        <span className="text-primary text-sm font-medium">Setelah 70 Hari</span>
                    </div>

                    <h3 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                        <span className="block">Kamu Bisa Jadi</span>
                        <span className="from-primary via-primary/80 to-primary mt-1 block bg-gradient-to-r bg-clip-text text-transparent">
                            Seseorang yang Cuan dari Sosmed
                        </span>
                    </h3>

                    <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg leading-relaxed">
                    Bukan cuma nonton. Kamu <span className="font-bold">dibimbing sampai praktik dan closing</span>, dari membuat konten hingga mendapat orderan.
                    </p>
                </div>

                {/* 1. HEADER SECTION (Manfaat yang Didapat) */}
                <div className="mx-auto mb-8 max-w-4xl space-y-4 text-center md:mb-16">
                    <h3 className="text-foreground text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                        Yang Kamu Dapat di Program Ini:
                    </h3>
                </div>

                {/* Benefits Grid */}
                <div className="relative mx-auto mb-6 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="from-card/80 to-card/40 border-border/30 hover:border-primary/40 flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                        >
                            <div className="bg-primary/10 border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                                <span className="text-primary text-lg font-bold">{index + 1}</span>
                            </div>
                            <div>
                                <h4 className="text-foreground mb-1 text-sm font-semibold">{benefit.title}</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. CTA SECTION */}
                <div className="flex justify-center md:mt-16">
                    <CtaButton2 size="lg" withInstruction onClick={handleCtaClick} data-cta-zone="benefits_section">
                        Gabung Sekarang
                    </CtaButton2>
                </div>
            </div>
        </section>
    );
}
