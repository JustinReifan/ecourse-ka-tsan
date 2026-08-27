import { cn } from "@/lib/utils";
import { Target, Plane, CreditCard, Heart } from "lucide-react";

const goals = [
    {
        icon: CreditCard,
        title: "Bebas dari Jeratan Cicilan",
        description: "Bisa pelan-pelan ngelunasin hutang bulanan tanpa harus stres mikirin dari mana duitnya.",
        color: "text-rose-500",
        bg: "bg-rose-500/10"
    },
    {
        icon: Plane,
        title: "Impian Umroh Sekeluarga",
        description: "Sedikit demi sedikit tabungan kumpul buat berangkatin orang tua dan keluarga ke tanah suci.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        icon: Heart,
        title: "Bantu Keuangan Suami",
        description: "Bisa ikut andil menuhin kebutuhan rumah tangga tanpa ninggalin kewajiban ngurus anak.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: Target,
        title: "Mandiri Secara Finansial",
        description: "Bisa beli barang idaman atau skin care pake uang hasil keringat sendiri, tanpa harus minta.",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    }
];

export function GoalsSection() {
    return (
        <section className="py-12 sm:py-24 bg-white overflow-hidden relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-[#5a4d3c] mb-4 tracking-tight leading-tight">
                        Bayangin, apa jadinya kalau<br className="hidden sm:block" />
                        <span className="text-[#00BF63]">semua impian ini terwujud?</span>
                    </h2>
                    <p className="text-[#7a6f5d] text-base sm:text-lg max-w-2xl mx-auto">
                        Mulai dari yang kecil dulu. Kalau Bunda berani mulai belajar dan konsisten sekarang, ini semua bukan cuma angan-angan lagi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {goals.map((goal, idx) => {
                        const Icon = goal.icon;
                        return (
                            <div key={idx} className="bg-[#fcfbf9] border border-[#f0ebd8] rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", goal.bg)}>
                                    <Icon className={cn("w-7 h-7", goal.color)} />
                                </div>
                                <h3 className="text-xl font-bold text-[#5a4d3c] mb-3">{goal.title}</h3>
                                <p className="text-[#8c8273] text-sm leading-relaxed">{goal.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
