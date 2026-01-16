
import React from 'react';
import { Rocket, BarChart3, ArrowUpRight, MessageSquare, Laptop, Users } from 'lucide-react';

const TalkToLeopold: React.FC = () => {
    const pathways = [
        {
            title: "Telegram Moat (HQ)",
            desc: "Access the exclusive Telegram HQ. A high-signal network of VibeCoders and founders. 24/7 collaboration and vibe checks.",
            icon: <Users size={24} />,
            label: "Join The Movement",
            bgColor: "bg-white/5",
            intent: "community"
        },
        {
            title: "3-Day MVP Launch",
            desc: "Don't have time for the course? We'll build your production web app in 72 hours. From idea to sale, no middleman required.",
            icon: <Rocket size={24} />,
            label: "Request Build Call",
            bgColor: "bg-[#003087]/20",
            intent: "mvp"
        },
        {
            title: "Strategy Call",
            desc: "Discuss course fit, career pivoting, or get unblocked on your AI architecture. High-bandwidth, founder-to-founder.",
            icon: <MessageSquare size={24} />,
            label: "Book Strategy Session",
            bgColor: "bg-white/5",
            intent: "strategy"
        }
    ];

    // Using one unified booking link for all consulting paths for easier management
    const baseBookingUrl = "https://cal.com/leopold-blau-vkcs3r/collaboration";
    const sourceTag = "source=vibecoding";

    return (
        <section id="consulting" className="py-24 md:py-32 px-4 md:px-6 relative overflow-hidden bg-black/40">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 text-left">
                <div className="mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-[#00F0FF] text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                        <Users size={14} />
                        <span>High-Signal Network</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight uppercase italic text-white">The VibeCode <br className="hidden md:block" /><span className="text-white/40">Advantage.</span></h2>
                    <p className="text-white/40 max-w-2xl text-lg leading-relaxed font-medium">
                        Information is free. Access to elite workflows and a community of builders is your <span className="text-white">unfair advantage.</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {pathways.map((path: any, i) => (
                        <div
                            key={i}
                            className={`p-10 rounded-[2.5rem] border border-white/10 ${path.bgColor} flex flex-col justify-between hover:border-white/20 transition-all duration-500 group relative overflow-hidden`}
                        >
                            {/* Subtle pattern background for the cards */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                    <div className="text-white/60 group-hover:text-white transition-colors">{path.icon}</div>
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-white">{path.topic || path.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">{path.desc}</p>
                            </div>

                            <a
                                href={path.intent === 'community' ? '#booking' : `${baseBookingUrl}?intent=${path.intent}&${sourceTag}`}
                                target={path.intent === 'community' ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                                className="w-full py-5 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95 relative z-10"
                            >
                                {path.label}
                                <ArrowUpRight size={14} className="opacity-40" />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">
                        Elite Performance. Zero Fluff. Build the Future.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TalkToLeopold;
