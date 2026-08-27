import { CreditCard, Heart, Plane, Sparkles } from 'lucide-react';

const goals = [
    {
        icon: CreditCard,
        title: 'Bebas dari Jeratan Cicilan',
        description: 'Bisa pelan-pelan ngelunasin hutang bulanan tanpa harus stres mikirin dari mana duitnya.',
    },
    {
        icon: Plane,
        title: 'Impian Umroh Sekeluarga',
        description: 'Sedikit demi sedikit tabungan kumpul buat berangkatin orang tua dan keluarga ke tanah suci.',
    },
    {
        icon: Heart,
        title: 'Bantu Keuangan Suami',
        description: 'Bisa ikut andil menuhin kebutuhan rumah tangga tanpa ninggalin kewajiban ngurus anak.',
    },
    {
        icon: Sparkles,
        title: 'Mandiri Secara Finansial',
        description: 'Bisa beli barang idaman atau skin care pake uang hasil keringat sendiri, tanpa harus minta.',
    },
];

export function GoalsSection() {
    return (
        <section className="relative overflow-hidden bg-[#f7f4ed] py-14 sm:py-20 lg:py-24">
            <div className="pointer-events-none absolute top-16 -left-24 h-56 w-56 rounded-full bg-[#00BF63]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-[#00BF63]" />
                            <span className="text-xs font-bold tracking-[0.22em] text-[#00a857] uppercase">Masa depan Bunda</span>
                        </div>

                        <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-[#5a4d3c] sm:text-5xl lg:text-6xl">
                            Bayangin, apa jadinya kalau <span className="text-[#00BF63]">semua impian ini terwujud?</span>
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#7a6f5d]">
                            Mulai dari yang kecil dulu. Kalau Bunda berani mulai belajar dan konsisten sekarang, ini semua bukan cuma angan-angan
                            lagi.
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

                                    <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-[#00BF63]/10 text-[#00a857] transition-colors duration-300 group-hover:bg-[#00BF63] group-hover:text-white sm:flex">
                                        <Icon className="h-5 w-5" strokeWidth={2} />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center gap-3 sm:block">
                                            <Icon className="h-5 w-5 shrink-0 text-[#00a857] sm:hidden" strokeWidth={2} />
                                            <h3 className="text-xl leading-snug font-bold text-[#5a4d3c] sm:text-2xl">{goal.title}</h3>
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
