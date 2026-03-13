import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { ChevronDown, HelpCircle, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        id: '1',
        question: 'Apakah kelas ini cocok untuk pemula?',
        answer: 'Ya. Kelas ini dibuat khusus untuk pemula, bahkan untuk yang belum pernah belajar desain sama sekali. Materinya dimulai dari pengenalan Canva sampai praktik membuat berbagai produk digital.',
    },
    {
        id: '2',
        question: 'Apakah harus punya laptop?',
        answer: 'Tidak harus. Semua materi di kelas ini bisa dipraktikkan hanya menggunakan HP saja. Namun jika menggunakan laptop tentu akan lebih leluasa.',
    },
    {
        id: '3',
        question: 'Apakah harus jago desain dulu?',
        answer: 'Tidak. Di kelas ini kamu akan belajar step by step dari dasar, jadi cocok untuk yang benar-benar baru mengenal Canva.',
    },
    {
        id: '4',
        question: 'Apakah Canva harus berbayar?',
        answer: 'Tidak harus. Canva versi gratis sudah cukup untuk mengikuti kelas ini. Namun akan lebih maksimal jika menggunakan Canva PRO karena fitur dan elemennya lebih lengkap.',
    },
    {
        id: '5',
        question: 'Bagaimana cara belajar di kelas ini?',
        answer: 'Belajarnya sangat simpel. Materi kelas disajikan dalam bentuk video rekaman per modul, jadi kamu bisa buka materi, tonton videonya, ikuti langkah-langkahnya, dan langsung praktik. Karena bentuknya rekaman, kamu bisa belajar kapan saja.',
    },
    {
        id: '6',
        question: 'Apakah kelas ini hanya teori?',
        answer: 'Tidak. Di setiap materi kamu akan langsung praktik membuat produk menggunakan Canva, sehingga skill kamu benar-benar terasah.',
    },
    {
        id: '7',
        question: 'Apakah kelas ini bisa jadi peluang penghasilan?',
        answer: 'Bisa. Karena di kelas ini kamu akan belajar membuat berbagai produk digital yang memiliki nilai jual, seperti template, worksheet, ebook, dan lainnya.',
    },
    {
        id: '8',
        question: 'Apakah kelas ini bisa di-affiliate-kan?',
        answer: 'Tentu bisa. Kamu bisa merekomendasikan kelas ini ke audience kamu. Jika ada yang checkout melalui link affiliate kamu, maka kamu akan mendapatkan komisi sebesar 50% dari harga kelas.',
    },
    {
        id: '9',
        question: 'Apakah harga kelas sudah termasuk langganan Canva PRO?',
        answer: 'Tidak. Harga kelas tidak termasuk langganan Canva PRO. Jika ingin upgrade, kamu bisa berlangganan langsung melalui aplikasi Canva atau melalui Canvassador resmi di Indonesia.',
    },
];

interface FaqItemProps {
    faq: (typeof faqs)[0];
    index: number;
}

function FaqItem({ faq, index }: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div
                className={cn(
                    'group overflow-hidden rounded-2xl transition-all duration-500',
                    'from-card/80 to-card/40 bg-gradient-to-br backdrop-blur-sm',
                    'border transition-all duration-300',
                    isOpen ? 'border-primary/50 shadow-primary/20 shadow-lg' : 'border-border/30 hover:border-primary/30',
                    'animate-fade-in',
                )}
                style={{ animationDelay: `${600 + index * 100}ms`, animationFillMode: 'both' }}
            >
                <CollapsibleTrigger className="w-full text-left">
                    <div className="hover:bg-primary/5 flex items-center justify-between p-6 transition-colors duration-300">
                        <h3 className="text-foreground group-hover:text-primary pr-4 text-lg leading-tight font-semibold transition-colors duration-300">
                            {faq.question}
                        </h3>
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full',
                                'bg-primary/20 border-primary/30 flex-shrink-0 border',
                                'transition-all duration-300',
                                'group-hover:bg-primary/30 group-hover:border-primary/50',
                                isOpen && 'bg-primary/40 border-primary rotate-180',
                            )}
                        >
                            <ChevronDown className="text-primary h-4 w-4 transition-transform duration-300" />
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                    <div className="px-6 pb-6">
                        <div className="border-primary/20 border-t pt-4">
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

export function FaqSection() {
    const { trackCTA } = useAnalytics();

    const handleCtaClick = () => {
        trackCTA('faq_section', 'Join Sekarang', '#pricing-section');

        // scroll to pricing section
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="border-border/50 relative border-none py-20 lg:py-32">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="via-primary/5 absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column - Header */}
                    <div className="space-y-8 lg:sticky lg:top-8">
                        <div className="space-y-6">
                            <div className="animate-fade-in">
                                <div className="bg-primary/10 border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                                    <HelpCircle className="text-primary h-4 w-4" />
                                    <span className="text-primary text-sm font-medium">FAQ</span>
                                </div>
                            </div>

                            <div className="animate-fade-in space-y-4" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                                <h2 className="text-foreground text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                                    <span className="block">Pertanyaan Yang</span>
                                    <span className="from-primary via-primary/80 to-primary bg-gradient-to-r bg-clip-text text-transparent">
                                        Sering Ditanyakan
                                    </span>
                                </h2>
                                <p className="text-muted-foreground text-xl leading-relaxed">
                                    kontak email dibawah untuk pertanyaan! : gumpreneur91@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                            <div className="space-y-4 rounded-2xl py-2 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 border-primary/30 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
                                        <MessageCircle className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-semibold">Whatsapp</h3>
                                        <p className="text-muted-foreground text-sm">+6282253204242</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 border-primary/30 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
                                        <MapPin className="text-primary h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-semibold">Alamat</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Toko (LATHEEFA) SEBRANG MUSHOLA AL-HUDA Link Ciberko Kecil Rt.1 Rw.3 No 12, 42424, Kalitimbang, Cibeber,
                                            Kota Cilegon, Cibeber, Banten, Indonesia 
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCtaClick}
                                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 hover:border-primary/50 w-full rounded-xl border px-4 py-3 font-medium transition-all duration-300"
                                >
                                    Join Sekarang
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - FAQ Items */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FaqItem key={faq.id} faq={faq} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
