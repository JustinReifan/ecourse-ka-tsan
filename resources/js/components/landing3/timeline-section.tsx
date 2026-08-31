import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, ArrowLeft } from "lucide-react";

const timelineData = [
    {
        direction: "right",
        items: [
            { type: "day", text: "Day 1" },
            { type: "task", text: "Breakdown\nNiche" },
            { type: "day", text: "Day 2" },
        ]
    },
    {
        direction: "left",
        items: [
            { type: "task", text: "Membuat\nLead Magnet" },
            { type: "day", text: "Day 3" },
            { type: "task", text: "Bikin\nKonten\nPlanner" },
        ]
    },
    {
        direction: "right",
        items: [
            { type: "day", text: "Day 4" },
            { type: "task", text: "Membuat\nAkun LYNK.ID\nProfesional" },
            { type: "day", text: "Day 5" },
        ]
    },
    {
        direction: "left",
        items: [
            { type: "task", text: "Melatih\nAlgoritma di\nAkun Baru" },
            { type: "day", text: "Day 6" },
            { type: "task", text: "Praktek\nNgonten Reels\nVideo &\nCarousel" },
        ]
    },
    {
        direction: "right",
        items: [
            { type: "day", text: "Day 7" },
            { type: "task", text: "ATM Konten\nViral" },
            { type: "day", text: "Day 8" },
        ]
    },
    {
        direction: "left",
        items: [
            { type: "task", text: "Bikin Akun\nThreads &\nSetting Akun FB\nPro" },
            { type: "day", text: "Day 9" },
            { type: "task", text: "Evaluasi\nKonten" },
        ]
    },
    {
        direction: "right",
        items: [
            { type: "day", text: "Day 10" },
            { type: "task", text: "Memahami\nMarket\nJourney" },
            { type: "task", text: "Closing" },
        ]
    }
];

function Card({ text, type }: { text: string, type: string }) {
    return (
        <div className={cn(
            "flex items-center justify-center text-center rounded-xl sm:rounded-2xl shadow-sm p-2 sm:p-4 min-h-[70px] sm:min-h-[100px] text-base sm:text-[22px] font-black whitespace-pre-line transition-transform hover:scale-105 leading-[1.15] tracking-tight sm:-tracking-[0.5px]",
            type === "day"
                ? "bg-[#e2d8cd] text-[#6b6255]"
                : "bg-[#d1c8bb] text-[#6b6255]"
        )}>
            {text}
        </div>
    );
}

export function TimelineSection() {
    const handleCtaClick = () => {
        const pricingSection = document.getElementById("pricing-section");
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="timeline" className="py-12 sm:py-24 bg-[#f9f7f4] overflow-hidden">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-transparent border border-[#d1c8bb] text-[#8c8273] text-xs sm:text-sm font-medium mb-6">
                        <span className="text-[#a89f8c]">?</span> Benefit Eksklusif
                    </div>
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#6b6255] mb-4 tracking-tight">
                        Rule Bimbingan WA<br />10 x 7 Hari Praktek
                    </h2>
                    <p className="text-[#8c8273] text-sm sm:text-lg">
                        Akan berjalan selama <strong className="font-semibold text-[#6b6255]">70 hari</strong>, 1 tugas diberi durasi 7 hari
                    </p>
                </div>

                {/* Snake Timeline */}
                <div className="max-w-[700px] mx-auto space-y-2 sm:space-y-4">
                    {timelineData.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-col">
                            {/* The Row of 3 items */}
                            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-6">
                                {/* We map items, inserting arrows between them */}
                                {row.direction === "right" ? (
                                    <>
                                        <Card text={row.items[0].text} type={row.items[0].type} />
                                        <ArrowRight className="text-[#bbaea0] w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                                        <Card text={row.items[1].text} type={row.items[1].type} />
                                        <ArrowRight className="text-[#bbaea0] w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                                        <Card text={row.items[2].text} type={row.items[2].type} />
                                    </>
                                ) : (
                                    <>
                                        <Card text={row.items[0].text} type={row.items[0].type} />
                                        <ArrowLeft className="text-[#bbaea0] w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                                        <Card text={row.items[1].text} type={row.items[1].type} />
                                        <ArrowLeft className="text-[#bbaea0] w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                                        <Card text={row.items[2].text} type={row.items[2].type} />
                                    </>
                                )}
                            </div>

                            {/* The Down Arrow connecting to next row */}
                            {rowIndex < timelineData.length - 1 && (
                                <div className={cn(
                                    "flex py-2 sm:py-4",
                                    row.direction === "right" ? "justify-end" : "justify-start"
                                )}>
                                    <div className="w-[calc(33.333%-0.6rem)] sm:w-[calc(33.333%-1.5rem)] flex justify-center">
                                        <ArrowDown className="text-[#bbaea0] w-4 h-4 sm:w-6 sm:h-6" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Bottom */}
                <div className="mt-16 sm:mt-24 text-center">
                    <p className="text-[#bbaea0] text-xs sm:text-sm font-medium mb-3 flex items-center justify-center gap-2">
                        <ArrowDown className="w-3 h-3" /> Klik tombol ini untuk gabung <ArrowDown className="w-3 h-3" />
                    </p>
                <button onClick={handleCtaClick} data-cta-zone="timeline_section" className="bg-[#00BF63] hover:bg-[#00a857] text-white font-semibold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-lg shadow-[#00BF63]/20 transition-all text-sm sm:text-base">
                        Gabung Sekarang
                    </button>
                </div>
            </div>
        </section>
    );
}
