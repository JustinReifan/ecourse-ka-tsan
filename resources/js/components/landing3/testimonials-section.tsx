// src/components/sections/TestimonialsSection.tsx
import { CtaButton2 } from '@/components/landing3/cta-button-2';
import { useAnalytics } from '@/hooks/use-analytics';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import { Star } from 'lucide-react';
import * as React from 'react';

interface TestimonialGrid {
    id: string;
    imageUrl: string;
    alt: string;
}

const testimonialsGrid: TestimonialGrid[] = [
    {
        id: '1',
        imageUrl: '/landing3/testimonials/1.webp',
        alt: 'Testimonial 1',
    },
    {
        id: '2',
        imageUrl: '/landing3/testimonials/2.webp',
        alt: 'Testimonial 2',
    },
    {
        id: '3',
        imageUrl: '/landing3/testimonials/3.webp',
        alt: 'Testimonial 3',
    },
    {
        id: '4',
        imageUrl: '/landing3/testimonials/4.webp',
        alt: 'Testimonial 4',
    },
];

interface Testimonial {
    id: string;
    imageUrl: string;
    alt: string;
}

const testimonials: Testimonial[] = [
    { id: '1', imageUrl: '/landing/testimonials/testimoni3.webp', alt: 'Testimonial 1' },
    { id: '2', imageUrl: '/landing/testimonials/testimoni4.webp', alt: 'Testimonial 2' },
    { id: '3', imageUrl: '/landing/testimonials/testimoni5.webp', alt: 'Testimonial 3' },
    { id: '4', imageUrl: '/landing/testimonials/testimoni6.webp', alt: 'Testimonial 4' },
    { id: '5', imageUrl: '/landing/testimonials/testimoni7.webp', alt: 'Testimonial 5' },
    { id: '6', imageUrl: '/landing/testimonials/testimoni8.webp', alt: 'Testimonial 6' },
    { id: '7', imageUrl: '/landing/testimonials/testimoni9.webp', alt: 'Testimonial 7' },
    { id: '8', imageUrl: '/landing/testimonials/testimoni10.webp', alt: 'Testimonial 8' },
];

interface TestimonialCardProps {
    testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl',
                'aspect-[9/16]',
                'from-card/80 to-card/40 bg-gradient-to-br backdrop-blur-sm',
                'border-border/30 border',
                'transition-all duration-700',
                'hover:shadow-primary/20 hover:shadow-2xl',
            )}
        >
            {!imageLoaded && <div className="from-muted/20 via-muted/10 to-muted/20 absolute inset-0 animate-pulse bg-gradient-to-r" />}

            <img
                src={testimonial.imageUrl}
                alt={testimonial.alt}
                className={cn(
                    'h-full w-full object-cover transition-all duration-700',
                    'group-hover:scale-110',
                    imageLoaded ? 'opacity-100' : 'opacity-0',
                    'rounded-2xl',
                )}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
            />
        </div>
    );
}

export function TestimonialsSection() {
    const { trackCTA } = useAnalytics();

    const handleCtaClick = () => {
        trackCTA('testimonial_section', 'Gabung Sekarang', '#pricing-section');
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="testimonials" className="relative py-6 lg:py-32">
            <div className="via-primary/5 absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 space-y-6 md:mb-12 md:space-y-16">
                    {/* Header Section */}
                    <div className="space-y-6 text-center">
                        <div className="animate-fade-in">
                            <div className="bg-primary/10 border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                                <Star className="text-primary h-4 w-4" />
                                <span className="text-primary text-sm font-medium">Testimoni Alumni</span>
                            </div>
                        </div>

                        <div className="animate-fade-in space-y-4">
                            <h2 className="text-foreground text-3xl font-bold sm:text-4xl lg:text-5xl xl:text-6xl">
                                <span className="block">Mereka Sudah Buktikan,</span>
                                <span className="from-primary via-primary/80 to-primary bg-gradient-to-r bg-clip-text text-transparent">
                                    Sekarang Giliran Kamu!
                                </span>
                            </h2>
                        </div>
                    </div>

                    {/* Grid Testimonial */}
                    <div className="animate-fade-in mx-auto max-w-5xl" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                            {testimonialsGrid.map((testimonial, index) => (
                                <div key={testimonial.id || index} className="group flex flex-col gap-4">
                                    <div className="border-border/50 bg-background hover:border-primary/20 relative aspect-[4/3] overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md">
                                        <img
                                            src={testimonial.imageUrl}
                                            alt={`${testimonial.alt}`}
                                            className="h-full w-full object-cover object-center"
                                            loading="lazy"
                                        />
                                    </div>

                                    <p className="text-muted-foreground px-2 text-center text-sm">
                                        Dokumentasi testimoni alumni — baca pengalaman asli pada gambar.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel */}
                    <div className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 4000,
                                    stopOnInteraction: true,
                                }),
                            ]}
                            opts={{
                                align: 'center',
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {testimonials.map((testimonial) => (
                                    <CarouselItem
                                        key={testimonial.id}
                                        className={cn('pl-4', 'basis-3/4', 'sm:basis-1/2', 'lg:basis-1/3', 'xl:basis-1/4')}
                                    >
                                        <div className="p-1">
                                            <TestimonialCard testimonial={testimonial} />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="hidden sm:inline-flex" />
                            <CarouselNext className="hidden sm:inline-flex" />
                        </Carousel>
                    </div>
                </div>
                {/* CTA Button */}
                <div className="text-center">
                    <CtaButton2
                        onClick={handleCtaClick}
                        data-cta-zone="testimonial_section"
                        size="lg"
                        withInstruction
                        className="group transform text-center transition-all duration-300 hover:scale-105"
                    >
                        <span className="relative z-10">Gabung Sekarang</span>
                    </CtaButton2>
                </div>
            </div>
        </section>
    );
}
