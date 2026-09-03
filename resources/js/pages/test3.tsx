import AppLogo from '@/components/app-logo';
import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { lazy, Suspense } from 'react';

// Lazy load ALL below-the-fold sections to reduce initial bundle size
const PainPointSection = lazy(() => import('@/components/landing3/pain-point-section').then(m => ({ default: m.PainPointSection })));
const GoalsSection = lazy(() => import('@/components/landing3/goals-section').then(m => ({ default: m.GoalsSection })));
const VideoCourseFailureSection = lazy(() => import('@/components/landing3/pain-point-section').then(m => ({ default: m.VideoCourseFailureSection })));
const TestimonialsSection = lazy(() => import('@/components/landing3/testimonials-section').then(m => ({ default: m.TestimonialsSection })));
const MentorProfile = lazy(() => import('@/components/landing3/mentor-profile').then(m => ({ default: m.MentorProfile })));
const TimelineSection = lazy(() => import('@/components/landing3/timeline-section').then(m => ({ default: m.TimelineSection })));
const BonusSection = lazy(() => import('@/components/landing3/bonus-section').then(m => ({ default: m.BonusSection })));
const PricingSection = lazy(() => import('@/components/landing3/pricing-section').then(m => ({ default: m.PricingSection })));
const FaqSection = lazy(() => import('@/components/landing3/faq-section').then(m => ({ default: m.FaqSection })));

import { useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useSectionTracking } from '@/hooks/use-section-tracking';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface WelcomeProps {
    landingBadge: string;
}

interface Props {
    coursePrice: number;
}

export default function Test3Hero({ coursePrice }: Props) {
    const { auth, landingBadge } = usePage<SharedData & WelcomeProps>().props;
    const { trackVisit, trackCTA } = useAnalytics();



    // Initialize tracking hooks
    useScrollTracking();
    useDwellTime();
    useSectionTracking();

    // Track page visit on mount
    useEffect(() => {
        trackVisit();
    }, [trackVisit]);

    // Sticky CTA visibility: hidden while hero is visible
    const heroRef = useRef<HTMLDivElement>(null);
    const [showStickyCta, setShowStickyCta] = useState(false);

    useEffect(() => {
        const heroEl = heroRef.current;
        if (!heroEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show sticky CTA only when hero is NOT intersecting (scrolled past)
                setShowStickyCta(!entry.isIntersecting);
            },
            { threshold: 0 },
        );

        observer.observe(heroEl);
        return () => observer.disconnect();
    }, []);

    // Track CTA button click
    const handleCtaClick = () => {
        trackCTA('hero_section', 'GABUNG SEKARANG', '#pricing-section');
        // scroll to pricing section
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title="Landing" />

            <div className="from-background via-background to-secondary/10 min-h-screen bg-gradient-to-br">
                {/* Navigation */}
                <header className="border-border/50 bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav className="flex h-16 items-center justify-between sm:h-20">
                            <div className="flex items-center gap-3 z-50">
                                <AppLogo />
                            </div>

                            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground">
                                <a href="#" className="hover:text-primary transition-colors">Home</a>
                                <a href="#course" className="hover:text-primary transition-colors">Course</a>
                                <a href="#whats-inside" className="hover:text-primary transition-colors">What's Inside</a>
                                <a href="#about" className="hover:text-primary transition-colors">About</a>
                                <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
                                <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
                            </div>

                            <div className="flex items-center gap-4 z-50">
                                {auth.user ? (
                                    <Link href={route('member.index')} className="text-foreground hover:text-primary text-sm font-medium mr-2">
                                        Member Area
                                    </Link>
                                ) : (
                                    <Link href={route('login')} className="text-foreground hover:text-primary text-sm font-medium mr-2">
                                        Login
                                    </Link>
                                )}                                    <button onClick={handleCtaClick} data-cta-zone="hero_section" className="bg-[#00BF63] hover:bg-[#00a857] text-white font-semibold py-2.5 px-6 rounded-full transition-all text-sm sm:text-base hidden sm:block shadow-md">
                                    Enroll Now
                                </button>
                            </div>
                        </nav>
                    </div>
                </header>

                <section id="hero" ref={heroRef} className="relative overflow-hidden bg-background pt-8 pb-0 sm:pt-10 sm:pb-20 lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center lg:py-6">
                    
                    {/* Decorative Shapes based on the image */}
                    {/* Top Left yellow half circle */}
                    <div className="absolute top-16 left-[40%] w-8 h-8 bg-amber-400 rounded-tl-full rounded-tr-full -rotate-45 hidden lg:block opacity-90" />
                    {/* Top Right blue circle */}
                    <div className="absolute top-16 right-[15%] w-10 h-10 bg-primary/60 rounded-full hidden lg:block" />
                    {/* Middle Left blue capsule */}
                    <div className="absolute top-[45%] left-[52%] w-8 h-4 bg-primary/40 rounded-full -rotate-45 hidden lg:block" />
                    {/* Bottom Left yellow half circle */}
                    <div className="absolute bottom-[20%] left-[42%] w-6 h-6 bg-primary/50 rounded-tl-full rounded-tr-full -rotate-12 hidden lg:block" />
                    {/* Bottom Right yellow half circle */}
                    <div className="absolute bottom-[30%] right-[8%] w-10 h-10 bg-amber-400 rounded-bl-full rounded-br-full -rotate-12 hidden lg:block" />

                    <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0 sm:gap-12 lg:gap-8 items-center">
                            
                            {/* Left Content */}
                            <div className="z-10 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                                <p className="text-primary mb-1 text-xs font-bold tracking-wide uppercase sm:mb-4 sm:text-base">
                                    {landingBadge} — PROGRAM RAMAH PEMULA
                                </p>
                                
                                <h1 className="text-foreground mb-2 text-[1.75rem] leading-[1.12] font-extrabold tracking-tight sm:mb-6 sm:text-5xl sm:leading-[1.2] lg:text-6xl">
                                    Dibimbing 1-on-1 untuk Hasilkan <br className="hidden lg:block"/>
                                    <em className="text-primary">Rp10 Juta Pertamamu</em> dari Sosmed
                                </h1>
                                
                                <p className="text-muted-foreground mx-auto mb-3 max-w-xl text-sm leading-snug sm:mb-10 sm:text-lg sm:leading-relaxed lg:mx-0">
                                    <em className="text-foreground font-semibold">Kamu gaptek?</em> Tenang, kamu dibimbing 1-on-1 via WhatsApp dan tugasmu dikoreksi langsung oleh mentor.
                                </p>
                                
                                <div className="mb-1 flex flex-col items-center justify-center gap-3 sm:mb-12 sm:flex-row sm:gap-5 lg:justify-start">
                                    <button onClick={handleCtaClick} data-cta-zone="hero_section" className="bg-[#00BF63] hover:bg-[#00a857] text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg shadow-[#00BF63]/20 transition-all w-full sm:w-auto text-sm sm:text-base">
                                        GABUNG SEKARANG
                                    </button>
                                </div>
                                
                                <div className="mx-auto hidden w-fit flex-col items-center justify-center gap-3 rounded-2xl bg-background/50 p-3 backdrop-blur-sm sm:flex sm:flex-row sm:gap-4 sm:p-2 lg:mx-0 lg:justify-start">
                                    <div className="flex -space-x-3 shrink-0">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <img 
                                                key={i} 
                                                src={`https://randomuser.me/api/portraits/women/${40 + i}.jpg`} 
                                                alt="Testimoni" 
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-background object-cover shadow-sm" 
                                                width="48"
                                                height="48"
                                                loading="lazy"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-center sm:text-left pl-0 sm:pl-2 mt-1 sm:mt-0">
                                        <div className="flex text-amber-400 mb-1 sm:mb-0.5 justify-center sm:justify-start">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current drop-shadow-sm" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                            Lihat pengalaman asli peserta<br className="hidden sm:block"/> di bawah ini
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Content */}
                            <div className="relative z-10 mx-auto mt-0 w-full max-w-lg sm:mt-8 lg:mt-0 lg:max-w-none">
                                {/* The Large Background Curve (Light Blue) Behind the Girl, full to top & right, clipped at bottom */}
                                <div className="absolute bottom-0 left-[-10%] sm:left-[5%] right-[-50vw] top-[-300px] lg:top-[-500px] bg-primary/10 rounded-l-full -z-10 pointer-events-none" />
                                
                                {/* Hero Image - Using /hero.png from public directory */}
                                <div className="relative flex h-[300px] items-end justify-center sm:h-[450px] lg:h-[calc(100svh-9rem)] lg:max-h-[580px]">
                                    <img 
                                        src="/hero.webp" 
                                        alt="Kak Tsania Latheefa" 
                                        className="h-full w-auto object-contain object-bottom drop-shadow-2xl" 
                                        width="580"
                                        height="580"
                                        fetchPriority="high"
                                    />
                                </div>
                                
                                {/* Floating Card 1: Top Right */}
                                <div className="absolute top-4 sm:top-12 right-2 sm:-right-8 lg:right-0 bg-background rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl flex items-center gap-2 sm:gap-3 border border-border/50 z-20">
                                    <div className="bg-primary/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-primary shrink-0">
                                        <Heart className="w-3 h-3 sm:w-5 sm:h-5 fill-current" />
                                    </div>
                                    <p className="text-sm font-semibold max-w-[120px] sm:max-w-[150px] leading-tight text-foreground">
                                        Dibimbing sampai praktik, bukan cuma nonton
                                    </p>
                                </div>
                                
                                {/* Floating Card 2: Middle Right */}
                                <div className="absolute top-[42%] right-2 sm:-right-12 lg:-right-16 bg-background rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl border border-border/50 min-w-[130px] sm:min-w-[220px] z-20">
                                    <p className="text-xs text-muted-foreground font-medium mb-0.5 sm:mb-1">Target Income</p>
                                    <p className="text-base sm:text-3xl font-extrabold mb-0 sm:mb-0.5 text-foreground">Rp10 Juta</p>
                                    <p className="text-xs text-emerald-500 font-medium mb-1.5 sm:mb-3">Kejar target pertamamu</p>
                                    
                                    {/* SVG Line Chart */}
                                    <svg className="w-full h-6 sm:h-16" viewBox="0 0 100 40" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 35 C 15 25, 25 30, 40 20 C 55 10, 65 25, 80 15 C 90 5, 95 10, 100 5 L 100 40 L 0 40 Z" fill="url(#chartGradient)" />
                                        <path d="M0 35 C 15 25, 25 30, 40 20 C 55 10, 65 25, 80 15 C 90 5, 95 10, 100 5" fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="100" cy="5" r="2.5" className="fill-primary" />
                                    </svg>
                                </div>
                                
                                {/* Floating Card 3: Bottom Left */}
                                <div className="absolute bottom-4 sm:bottom-10 left-2 sm:-left-8 lg:-left-10 bg-background rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-xl border border-border/50 max-w-[170px] sm:max-w-[260px] z-20">
                                    <div className="flex gap-2 sm:gap-3 mb-1.5 sm:mb-3 items-start">
                                        <img src="https://randomuser.me/api/portraits/women/49.jpg" alt="Testimoni" className="w-6 h-6 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 mt-0.5" width="48" height="48" loading="lazy" />
                                        <p className="text-xs sm:text-sm text-foreground font-medium leading-snug">
                                            "Chat 1-on-1 kapan pun mentok, sangat membantu!"
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center pl-8 sm:pl-15">
                                        <p className="text-xs text-muted-foreground font-medium">- Alumni</p>
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <svg key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </section>

                {/* Below-the-fold sections - all lazy loaded */}
                <Suspense fallback={null}>
                    <PainPointSection />
                </Suspense>

                <Suspense fallback={null}>
                    <GoalsSection />
                </Suspense>

                <Suspense fallback={null}>
                    <VideoCourseFailureSection />
                </Suspense>

                <Suspense fallback={null}>
                    <TestimonialsSection />
                </Suspense>

                <Suspense fallback={null}>
                    <TimelineSection />
                </Suspense>

                <Suspense fallback={null}>
                    <MentorProfile />
                </Suspense>

                <Suspense fallback={null}>
                    <BonusSection />
                </Suspense>

                <Suspense fallback={null}>
                    <PricingSection coursePrice={coursePrice} />
                </Suspense>

                <Suspense fallback={null}>
                    <FaqSection />
                </Suspense>

                <div className={`border-primary/30 bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t p-3 backdrop-blur md:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${showStickyCta ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                    <CtaButton2 onClick={handleCtaClick} data-cta-zone="sticky_mobile" className="w-full" aria-label="Gabung Program Gumpreneur">
                        Gabung Sekarang — Rp399.000
                    </CtaButton2>
                </div>

                {/* Footer */}
                <footer className="relative pb-20 backdrop-blur-sm md:pb-0">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-4 flex items-center justify-center gap-3">
                                <div className="flex items-center justify-center rounded-lg">
                                    {/* <Youtube className="text-primary h-4 w-4" /> */}
                                    <AppLogo />
                                </div>
                                {/* <span className="text-foreground text-xl font-bold">Editor Amplifier</span> */}
                            </div>
                            <p className="text-muted-foreground text-sm">© 2026 Gumpreneur. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
