import AppLogo from '@/components/app-logo';
import { BonusSection } from '@/components/canva/bonus-section';
import { FaqSection } from '@/components/canva/faq-section';
import { HeroBadge } from '@/components/canva/hero-badge';
import { LearningBenefits } from '@/components/canva/learning-benefits';
import { MentorProfile } from '@/components/canva/mentor-profile';
import { PainPointSection } from '@/components/canva/pain-point-section';
import { PricingSection } from '@/components/canva/pricing-section';
import { TestimonialsSection } from '@/components/canva/testimonials-section';
import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';

import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';

interface CanvaProps {
    coursePrice: number;
}

export default function Canva({ coursePrice }: CanvaProps) {
    const { auth } = usePage<SharedData>().props;
    const { trackVisit, trackCTA } = useAnalytics();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    // Initialize tracking hooks
    useScrollTracking();
    useDwellTime();

    // Track page visit on mount
    useEffect(() => {
        trackVisit();
    }, [trackVisit]);

    // Track CTA button clicks
    const handleCtaClick = () => {
        trackCTA('hero_section', 'Gabung Sekarang', '#pricing-section');
        // scroll to pricing section
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title="Jago Canva">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="from-background via-background to-secondary/10 min-h-screen bg-gradient-to-br">
                {/* Navigation */}
                <header className="border-border/50 bg-background/80 relative z-50 border-none backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AppLogo />
                            </div>

                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('member.index')}
                                        className="border-primary/20 text-foreground hover:border-primary/50 hover:bg-card/50 bg-card/30 inline-block rounded-lg border px-4 py-2 text-sm leading-normal transition-all duration-300"
                                    >
                                        Member area
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-foreground hover:bg-card hover:border-primary/50 border-primary/30 bg-card/50 inline-block rounded-lg border px-4 py-2 text-sm leading-normal transition-all duration-300"
                                        >
                                            Login Member
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                <section
                    className="relative overflow-hidden pt-6 lg:pt-12"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="space-y-8 text-center">
                            <div data-aos="fade-up">
                                <HeroBadge text={'Jago Canva Masterclass'} />
                            </div>

                            <div className="space-y-6" data-aos="fade-up">
                                <h1 className="text-foreground mx-auto max-w-6xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                                    Kuasai Skill Canva dari Nol Hingga Hasilkan{' '}
                                    <span className="from-primary via-primary/80 to-primary animate-gradient-x bg-gradient-to-r bg-clip-text text-transparent">
                                        Cuan 2 Digit Pertama
                                    </span>
                                </h1>
                                <p className="text-muted-foreground mx-auto max-w-4xl text-base leading-relaxed md:text-xl">
                                    Bukan Sekedar Kumpulan Tutorial Jago Canva, ini step-by-step skill canva yang bisa menjadi bekal kamu menuju
                                    creator sukses dan bisa hasilkan cuan 2 digit pertama kamu!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hero Video Section */}
                <section className="relative overflow-hidden py-8 lg:pt-12 lg:pb-24">
                    {/* Konten Utama */}
                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="space-y-10">
                            <div data-aos="fade-up">
                                {/* Video utama di atas background */}
                                {/* <VideoPlayer
                                    src={landingVslUrl}
                                    title="VSL - Belajar Canva"
                                    className="aspect-video w-full lg:h-[600px]"
                                    thumbnailUrl={landingVslThumbnail}
                                /> */}

                                {/* kalau gak ada vsl, thumbnail doang */}
                                <div className="overflow-hidden rounded-2xl">
                                    <img src="/storage/canva/hero-img.webp" alt="" className="mx-auto h-full w-4xl rounded-2xl object-cover" />
                                </div>
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

                <PainPointSection />

                <TestimonialsSection />

                <LearningBenefits />

                <BonusSection />

                <MentorProfile />

                <PricingSection coursePrice={coursePrice} />

                <FaqSection />

                {/* Footer */}
                <footer className="relative backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-4 flex items-center justify-center gap-3">
                                <div className="flex items-center justify-center rounded-lg">
                                    {/* <Youtube className="text-primary h-4 w-4" /> */}
                                    <AppLogo />
                                </div>
                                {/* <span className="text-foreground text-xl font-bold">Editor Amplifier</span> */}
                            </div>
                            <p className="text-muted-foreground text-sm">© 2026 Glow Up Muslim Preneur. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
