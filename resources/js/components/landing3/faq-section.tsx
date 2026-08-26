import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        id: '1',
        question: 'Kalau saya gaptek, bisa ikut?',
        answer: 'Justru program ini dirancang untuk pemula yang merasa gaptek. Materinya disusun bertahap, dan kamu bisa bertanya lewat chat kapan pun mentok.',
    },
    {
        id: '2',
        question: 'Apa bedanya dengan video course biasa?',
        answer: 'Video course biasa cuma nonton ,  tidak ada yang koreksi tugas, tidak ada yang bantu kalau stuck. Di Gumpreneur, kamu dapat <strong>grup WA kecil (maks 10 orang)</strong> dengan <strong>10 tugas yang dikoreksi langsung mentor</strong> + akses chat 1-on-1 kapan pun mentok.',
    },
    {
        id: '3',
        question: 'Kelas ini cocok untuk siapa?',
        answer: 'Cocok banget untuk: Ibu rumah tangga atau pekerja yang ingin punya penghasilan tambahan dari sosial media, tapi merasa gaptek dan belum tahu harus mulai dari mana. Juga cocok untuk yang pernah coba jualan tapi hasilnya tidak stabil.',
    },
    {
        id: '4',
        question: 'Apa yang saya dapat setelah ikut program?',
        answer: `Kamu akan mendapatkan: <br />
        👥 Grup WhatsApp kecil (maks 10 orang) <br />
        📅 Pendampingan selama 70 hari <br />
        📝 10 tugas praktek yang dikoreksi langsung oleh Kak Tsania <br />
        💬 Bebas bertanya 1-on-1 via chat kapan pun mentok <br />
        📚 Materi lengkap: riset niche, Lynk.id, produksi konten, optimasi Instagram, optimasi TikTok, dan WhatsApp Marketing <br />
        🎓 Bonus: sertifikat digital + ebook "Ubah Hobi Jadi Cuan" (senilai Rp99.000) gratis jika selesai program`,
    },
    {
        id: '5',
        question: 'Apakah ada bimbingan 1-on-1?',
        answer: 'Ya! Setiap peserta bisa bebas tanya jawab 1-on-1 via chat kapan pun mentok, tanpa biaya tambahan. Selain itu, 10 tugas praktek akan dikoreksi langsung oleh mentor.',
    },
    {
        id: '6',
        question: 'Apa saja materi yang dipelajari?',
        answer: 'Materinya mencakup riset niche, Lynk.id, produksi konten, optimasi Instagram, optimasi TikTok, dan WhatsApp Marketing.',
    },
    {
        id: '7',
        question: 'Kapan program ini mulai?',
        answer: 'Program menggunakan sistem rolling enrollment, jadi pendaftaran dibuka terus-menerus. Tim akan memberikan informasi tahap berikutnya setelah pendaftaran dan pembayaran selesai.',
    },
    {
        id: '8',
        question: 'Apakah ada garansi uang kembali?',
        answer: 'Belum ada garansi uang kembali untuk program ini. Tapi harga Rp399.000 ini jauh lebih murah dibanding mentoring 1-on-1 pada umumnya, mengingat kamu mendapat 10 tugas dikoreksi langsung + akses chat tanpa batas selama 70 hari.',
    },
    {
        id: '9',
        question: 'Gimana cara daftar?',
        answer: 'Klik tombol "Gabung Sekarang" di bawah, isi data pendaftaran, lalu selesaikan pembayaran melalui metode yang tersedia.',
    },
    {
        id: '10',
        question: 'Kenapa tidak ada bonus tambahan?',
        answer: 'Sengaja tidak ada bonus berlebihan ,  untuk menyaring peserta yang benar-benar serius. Yang kamu dapatkan sudah lengkap: pendampingan penuh, 10 tugas dikoreksi, chat 1-on-1 tanpa batas, dan bonus penyelesaian (sertifikat + ebook).',
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
                            <div className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />{' '}
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
        trackCTA('faq_section', 'Gabung Sekarang', '#pricing-section');

        // scroll to pricing section
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="border-border/50 relative border-none py-8 lg:py-32">
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
                                    Masih ada pertanyaan? Hubungi kami di: gumpreneur91@gmail.com
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
                                        <h3 className="text-foreground font-semibold">WhatsApp</h3>
                                        <p className="text-muted-foreground text-sm">Chat kami untuk pertanyaan lebih lanjut</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCtaClick}
                                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 hover:border-primary/50 w-full rounded-xl border px-4 py-3 font-medium transition-all duration-300"
                                >
                                    Gabung Sekarang
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
