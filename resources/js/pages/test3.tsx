import AppLogo from '@/components/app-logo';
import { BonusSection } from '@/components/landing3/bonus-section';
import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { FaqSection } from '@/components/landing3/faq-section';
import { LearningBenefits } from '@/components/landing3/learning-benefits';
import { MentorProfile } from '@/components/landing3/mentor-profile';
import { PainPointSection } from '@/components/landing3/pain-point-section';
import { PricingSection } from '@/components/landing3/pricing-section';
import { TestimonialsSection } from '@/components/landing3/testimonials-section';
import { useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CheckCircle2, Heart, MessageCircle, Rocket, Star, Users } from 'lucide-react';
import { useEffect } from 'react';

interface WelcomeProps {
    landingBadge: string;
}

interface Props {
    coursePrice: number;
}

export default function Test3Hero({ coursePrice }: Props) {
    const { auth, landingBadge } = usePage<SharedData & WelcomeProps>().props;
    const { trackVisit, trackCTA } = useAnalytics();

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
            <Head title="Landing">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="from-background via-background to-secondary/10 min-h-screen bg-gradient-to-br">
                {/* Navigation */}
                <header className="border-border/50 bg-background/80 relative z-50 border-none backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav className="flex h-20 items-center justify-between">
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
                                )}
                                <button onClick={handleCtaClick} className="bg-[#00BF63] hover:bg-[#00a857] text-white font-semibold py-2.5 px-6 rounded-full transition-all text-sm hidden sm:block shadow-md">
                                    Enroll Now — {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(coursePrice || 399000).replace(/\s/g, '')}
                                </button>
                            </div>
                        </nav>
                    </div>
                </header>

                <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-32 bg-background">
                    
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

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
                            
                            {/* Left Content */}
                            <div className="z-10 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                                <p className="text-primary font-bold text-sm sm:text-base mb-4 tracking-wide uppercase">
                                    {landingBadge} — PROGRAM RAMAH PEMULA
                                </p>
                                
                                <h1 className="text-foreground text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.2] tracking-tight mb-6">
                                    Sementara yang Lain Udah Mulai <br className="hidden lg:block"/>
                                    Cuan dari HP-nya, Kamu Masih <br className="hidden lg:block"/>
                                    Nunggu <span className="text-primary">"Waktu yang Tepat"?</span>
                                    <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full text-amber-500 ml-3 align-middle -mt-1">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                        </svg>
                                    </span>
                                </h1>
                                
                                <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                                    70 hari dibimbing 1-on-1 via WhatsApp. <span className="text-foreground font-semibold">10 tugas dikoreksi langsung mentor</span> dalam grup kecil maksimal 10 orang.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-12">
                                    <button onClick={handleCtaClick} className="bg-[#00BF63] hover:bg-[#00a857] text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-[#00BF63]/20 transition-all w-full sm:w-auto text-lg">
                                        GABUNG SEKARANG — {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(coursePrice || 399000).replace(/\s/g, '')}
                                    </button>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 bg-background/50 backdrop-blur-sm p-2 rounded-2xl inline-flex">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <img 
                                                key={i} 
                                                src={`https://randomuser.me/api/portraits/women/${40 + i}.jpg`} 
                                                alt="Testimoni" 
                                                className="w-12 h-12 rounded-full border-[3px] border-background object-cover shadow-sm" 
                                            />
                                        ))}
                                    </div>
                                    <div className="text-center sm:text-left pl-2">
                                        <div className="flex text-amber-400 mb-1 justify-center sm:justify-start">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <svg key={i} className="w-4 h-4 fill-current drop-shadow-sm" viewBox="0 0 24 24">
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
                            <div className="relative z-10 w-full max-w-lg mx-auto lg:max-w-none mt-8 lg:-mt-10 xl:-mt-16">
                                {/* The Large Background Circle (Light Blue) Behind the Girl, clipped only at the bottom */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[350px] sm:h-[450px] lg:h-[500px] xl:h-[580px] overflow-hidden -z-10 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] lg:w-[850px] lg:h-[850px] xl:w-[950px] xl:h-[950px] bg-primary/10 rounded-full" />
                                </div>
                                
                                {/* Hero Image - Using /hero.png from public directory */}
                                <div className="relative flex justify-center items-end h-[350px] sm:h-[450px] lg:h-[500px] xl:h-[580px]">
                                    <img 
                                        src="/hero.png" 
                                        alt="Kak Tsania Latheefa" 
                                        className="h-full w-auto object-contain object-bottom drop-shadow-2xl" 
                                    />
                                </div>
                                
                                {/* Floating Card 1: Top Right */}
                                <div className="absolute top-8 sm:top-12 -right-2 sm:-right-8 lg:right-0 bg-background rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-3 border border-border/50">
                                    <div className="bg-primary/10 p-2 sm:p-2.5 rounded-xl text-primary">
                                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold max-w-[120px] sm:max-w-[150px] leading-tight text-foreground">
                                        Dibimbing sampai praktik, bukan cuma nonton
                                    </p>
                                </div>
                                
                                {/* Floating Card 2: Middle Right */}
                                <div className="absolute top-[45%] -right-4 sm:-right-12 lg:-right-16 bg-background rounded-3xl p-4 sm:p-5 shadow-xl border border-border/50 min-w-[180px] sm:min-w-[220px]">
                                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Target Income</p>
                                    <p className="text-xl sm:text-3xl font-extrabold mb-0.5 text-foreground">Rp10 Juta</p>
                                    <p className="text-[10px] sm:text-xs text-emerald-500 font-medium mb-3">Kejar target pertamamu</p>
                                    
                                    {/* SVG Line Chart */}
                                    <svg className="w-full h-12 sm:h-16" viewBox="0 0 100 40" preserveAspectRatio="none">
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
                                
                                {/* Floating Card 3: Bottom Right */}
                                <div className="absolute bottom-4 -right-2 sm:-right-8 lg:-right-4 bg-background rounded-2xl p-4 sm:p-5 shadow-xl border border-border/50 max-w-[240px] sm:max-w-[260px] z-20">
                                    <div className="flex gap-3 mb-3">
                                        <img src="https://randomuser.me/api/portraits/women/49.jpg" alt="Testimoni" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0" />
                                        <p className="text-xs sm:text-sm text-foreground font-medium leading-snug">
                                            "Chat 1-on-1 kapan pun mentok, sangat membantu!"
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center ml-14 sm:ml-15">
                                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">- Member Alumni</p>
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
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

                {/* Problem + Agitasi */}
                <PainPointSection />

                {/* Bridge/Mekanisme + Outcome */}
                <LearningBenefits />

                {/* Testimoni / Social Proof */}
                <TestimonialsSection />

                {/* Mentor Profile */}
                <MentorProfile />

                {/* Bonus */}
                <BonusSection />

                <PricingSection coursePrice={coursePrice} />

                <FaqSection />

                <div className="border-primary/30 bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t p-3 backdrop-blur md:hidden">
                    <CtaButton2 onClick={handleCtaClick} className="w-full" aria-label="Gabung Program Gumpreneur">
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
