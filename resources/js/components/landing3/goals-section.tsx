import { CreditCard, Heart, Plane, Sparkles } from 'lucide-react';

const goals = [
    {
        icon: CreditCard,
        title: 'Bebas dari Jeratan Cicilan',
        description: 'Pelan-pelan lunasi cicilan bulanan tanpa terus stres memikirkan uang.',
    },
    {
        icon: Plane,
        title: 'Impian Umroh Sekeluarga',
        description: 'Kumpulkan tabungan untuk berangkat umroh bersama orang tua dan keluarga.',
    },
    {
        icon: Heart,
        title: 'Bantu Keuangan Keluarga',
        description: 'Ikut memenuhi kebutuhan rumah tangga tanpa meninggalkan anak.',
    },
    {
        icon: Sparkles,
        title: 'Mandiri Secara Finansial',
        description: 'Beli kebutuhan dan barang idaman dengan penghasilan sendiri.',
    },
];

export function GoalsSection() {
    return (
        <section id="goals" className="relative overflow-hidden bg-[#f7f4ed] py-14 sm:py-20 lg:py-24">
            <div className="pointer-events-none absolute top-16 -left-24 h-56 w-56 rounded-full bg-[#af2d22]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-[#af2d22]" />
                            <span className="text-xs font-bold tracking-[0.22em] text-[#af2d22] uppercase">Masa depan Kamu</span>
                        </div>

                        <h2 className="max-w-xl text-3xl leading-tight font-extrabold tracking-tight text-[#6c2c2d] sm:text-5xl lg:text-6xl">
                            Bayangin, Ini yang Terjadi <span className="text-[#af2d22]">Kalau Kamu Mulai Dari Sekarang</span>
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#7a6f5d]">
                            Mulai dari langkah kecil. Dengan belajar dan konsisten, semua ini bukan lagi sekadar angan-angan.
                        </p>
                    </div>

                    <div className="border-b border-[#d9d1c2]">
                        {goals.map((goal, index) => {
                            const Icon = goal.icon;

                            return (
                                <div
                                    key={goal.title}
                                    className="group grid grid-cols-[2.75rem_1fr] gap-3 border-t border-[#d9d1c2] py-7 sm:grid-cols-[4rem_3.5rem_1fr] sm:gap-5 sm:py-9"
                                >
                                    <span className="pt-1 text-sm font-bold text-[#a69c8d] tabular-nums sm:text-base">0{index + 1}</span>

                                    <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-[#af2d22]/10 text-[#af2d22] transition-colors duration-300 group-hover:bg-[#af2d22] group-hover:text-white sm:flex">
                                        <Icon className="h-5 w-5" strokeWidth={2} />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center gap-3 sm:block">
                                            <Icon className="h-5 w-5 shrink-0 text-[#af2d22] sm:hidden" strokeWidth={2} />
                                            <h3 className="text-xl leading-snug font-bold text-[#6c2c2d] sm:text-2xl">{goal.title}</h3>
                                        </div>
                                        <p className="text-sm leading-relaxed text-[#7a6f5d] sm:text-base">{goal.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
