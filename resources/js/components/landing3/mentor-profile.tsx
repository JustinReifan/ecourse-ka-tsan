import { cn } from '@/lib/utils';
import { Award, CheckCircle, Instagram, MessageCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Credential {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    verified: boolean;
}

const credentials: Credential[] = [
    {
        id: '1',
        title: '13+ Tahun Praktisi Jualan Online',
        description: 'Berpengalaman membangun @latheefa_id dengan penjualan yang konsisten.',
        icon: <Award className="h-5 w-5" />,
        verified: true,
    },
    {
        id: '2',
        title: 'Sertifikasi BNSP Social Media Marketing',
        description: 'Tersertifikasi resmi BNSP Social Media Marketing.',
        icon: <CheckCircle className="h-5 w-5" />,
        verified: true,
    },
    {
        id: '4',
        title: 'Impactful Content Creator',
        description: 'Mencapai 7,3 juta+ tayangan dan membangun 48 ribu+ pengikut Instagram.',
        icon: <TrendingUp className="h-5 w-5" />,
        verified: true,
    },
];

interface CredentialItemProps {
    credential: Credential;
    delay: number;
}

function CredentialItem({ credential, delay }: CredentialItemProps) {
    return (
        <div
            className={cn(
                'group flex items-start gap-4 rounded-xl p-4',
                'from-card/40 to-card/20 bg-gradient-to-r backdrop-blur-sm',
                'border-border/30 hover:border-primary/40 border',
                'hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg',
                'animate-fade-in cursor-pointer',
            )}
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
        >
            <div
                className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                    'bg-primary/10 border-primary/20 text-primary border',
                    'group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110',
                    'transition-all duration-300',
                )}
            >
                {credential.icon}
            </div>

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <h4 className="text-foreground group-hover:text-primary font-semibold transition-colors duration-300">{credential.title}</h4>
                    {credential.verified && (
                        <div className="bg-primary/20 border-primary/30 flex h-5 w-5 items-center justify-center rounded-full border">
                            <CheckCircle className="text-primary h-3 w-3" />
                        </div>
                    )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{credential.description}</p>
            </div>
        </div>
    );
}

export function MentorProfile() {
    const [profileImageLoaded, setProfileImageLoaded] = useState(false);

    return (
        <section id="mentor" className="relative py-6 lg:py-32">
            {/* Background Effects */}
            <div className="from-primary/5 to-primary/5 absolute inset-0 bg-gradient-to-br via-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1)_0%,transparent_50%)]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="space-y-16">
                    {/* Section Header */}
                    <div className="space-y-6 text-center">
                        <div className="animate-fade-in">
                            <div className="bg-primary/10 border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                                <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                                <span className="text-primary text-sm font-medium">Mentor Exclusive</span>
                            </div>
                        </div>

                        <div className="animate-fade-in space-y-4" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                            <h2 className="text-foreground text-3xl font-bold sm:text-5xl lg:text-6xl">
                                <span className="block">Mentor Tepat untuk </span>
                                <span className="from-primary via-primary/80 to-primary bg-gradient-to-r bg-clip-text text-transparent">
                                    Langkah Awalmu
                                </span>
                            </h2>
                            <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
                                Kamu bakal dipandu sama mentor terbaik yang udah punya pengalaman jualan online 13 tahun
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Left Side - Profile */}
                        <div className="space-y-8">
                            {/* Profile Image with Depth Effect */}
                            <div className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                                <div className="relative">
                                    {/* Background Glow */}
                                    <div className="from-primary/20 via-primary/10 to-primary/20 absolute -inset-4 rounded-full bg-gradient-to-r blur-2xl" />

                                    {/* Main Image Container */}
                                    <div className="relative">
                                        <div
                                            className={cn(
                                                'relative aspect-square overflow-hidden rounded-2xl',
                                                'from-card/80 to-card/40 bg-gradient-to-br backdrop-blur-sm',
                                                'border-primary/20 shadow-primary/10 border-2 shadow-2xl',
                                            )}
                                        >
                                            {/* Loading skeleton */}
                                            {!profileImageLoaded && (
                                                <div className="from-muted/20 via-muted/10 to-muted/20 absolute inset-0 animate-pulse bg-gradient-to-r" />
                                            )}

                                            <img
                                                src="/landing/mentor/hero.webp"
                                                alt="Professional Video Editor"
                                                className={cn(
                                                    'h-full w-full object-cover transition-all duration-700',
                                                    'hover:scale-105',
                                                    profileImageLoaded ? 'opacity-100' : 'opacity-0',
                                                )}
                                                onLoad={() => setProfileImageLoaded(true)}
                                                loading="lazy"
                                            />

                                            {/* Subtle Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                        </div>

                                        {/* Floating Status Badge */}
                                        <div className="absolute -right-4 -bottom-4">
                                            <div className="bg-primary border-primary/30 flex items-center gap-2 rounded-full border-2 px-4 py-2 shadow-lg backdrop-blur-sm">
                                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                                                <span className="text-primary-foreground text-sm font-medium">Mentor</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nameplate */}
                            <div className="animate-fade-in space-y-4 text-center" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                                <div>
                                    <h3 className="text-foreground mb-2 text-3xl sm:text-4xl font-bold">Tsania Latheefa</h3>
                                    <p className="text-primary text-lg font-medium">Content Creator</p>
                                    <p className="text-muted-foreground">Instagram</p>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center justify-center gap-4">
                                    {/* <div className="bg-card/30 border-border/30 flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-sm">
                                        <Youtube className="h-4 w-4 text-red-500" />
                                        <span className="text-muted-foreground text-sm">2.1M subscribers</span>
                                    </div> */}
                                    <div className="bg-card/30 border-border/30 flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-sm">
                                        <Instagram className="h-4 w-4 text-pink-500" />
                                        <span className="text-muted-foreground text-sm">48K+ Followers</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Side - Info & Credentials */}
                        <div className="space-y-8 lg:space-y-10">
                            <div className="from-primary/10 border-primary/20 space-y-6 rounded-2xl border bg-gradient-to-br p-8 backdrop-blur-sm">
                                <h4 className="text-foreground flex items-center gap-3 text-xl sm:text-2xl font-bold">
                                    <MessageCircle className="text-primary h-6 w-6" />
                                    Pendampingan Personal Selama 70 Hari
                                </h4>
                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                    Kak Tsania mengoreksi 10 tugas praktik dan menjadi tempat bertanya lewat chat 1-on-1 kapan pun peserta mentok.
                                </p>
                                <ul className="text-muted-foreground text-sm space-y-4">
                                    <li className="flex gap-3">
                                        <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" /> Grup WhatsApp maksimal 10 orang.
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" /> Koreksi tugas langsung, bukan belajar sendirian.
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" /> Tanya-jawab lewat chat tanpa biaya tambahan.
                                    </li>
                                </ul>
                            </div>

                            {/* Credentials */}
                            <div className="animate-fade-in space-y-4" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
                                <h4 className="text-foreground flex items-center gap-2 text-xl font-bold">
                                    <Award className="text-primary h-5 w-5" />
                                    Credentials & Achievements
                                </h4>
                                <div className="space-y-3">
                                    {credentials.map((credential, index) => (
                                        <CredentialItem key={credential.id} credential={credential} delay={1000 + index * 100} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
