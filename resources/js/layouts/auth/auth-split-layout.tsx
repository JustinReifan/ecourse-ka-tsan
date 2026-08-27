import AppLogo from '@/components/app-logo';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CircleCheck, Sparkles } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const highlights = [
    { icon: BookOpen, label: 'Materi praktis & terarah' },
    { icon: CircleCheck, label: 'Belajar sesuai ritmemu' },
    { icon: Sparkles, label: 'Tumbuh bersama komunitas' },
];

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh overflow-hidden bg-[#faf7f3] px-6 sm:px-0 lg:grid-cols-2 lg:px-0">
            <section className="relative hidden h-dvh overflow-hidden bg-[#211a17] p-9 text-white lg:flex lg:flex-col xl:p-11">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1c1715] via-[#34271f] to-[#7b5d47]" />
                <div className="absolute -top-32 -left-28 h-[30rem] w-[30rem] rounded-full bg-[#b59476]/20 blur-3xl" />
                <div className="absolute -right-32 bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#d8b99a]/15 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                        maskImage: 'linear-gradient(to bottom, black, transparent 75%)',
                    }}
                />

                <Link href={route('home')} className="relative z-20 flex w-fit items-center text-lg font-medium">
                    <AppLogo />
                </Link>

                <div className="relative z-20 my-auto max-w-xl py-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#ead8c7] backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        RUANG BELAJAR GUMPRENEUR
                    </div>
                    <h2 className="max-w-lg text-3xl leading-[1.15] font-semibold tracking-tight xl:text-4xl">
                        Mulai langkah kecil untuk hasil yang lebih besar.
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/65 xl:text-base">
                        Akses materi, strategi, dan komunitas yang membantumu membangun bisnis digital dengan lebih percaya diri.
                    </p>

                    <div className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-3">
                        {highlights.map(({ icon: Icon, label }) => (
                            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm">
                                <Icon className="mb-2 h-4 w-4 text-[#d9b99b]" />
                                <p className="text-xs leading-4 text-white/80 xl:text-sm xl:leading-5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {quote && (
                    <blockquote className="relative z-20 max-w-lg border-l border-[#c9a98a]/60 pl-4 text-sm text-white/60">
                        <p className="italic">&ldquo;{quote.message}&rdquo;</p>
                        <footer className="mt-1.5 text-xs text-[#d8bfa9]">— {quote.author}</footer>
                    </blockquote>
                )}
            </section>

            <main className="flex h-dvh w-full items-center overflow-hidden py-6 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('member.index')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogo />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
