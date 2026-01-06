
import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

const Imprint: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-sans selection:bg-white selection:text-black transition-all">
            <div className="max-w-3xl mx-auto">
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-16 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to VibeCoding</span>
                </a>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                        <MapPin size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic underline decoration-white/10 underline-offset-8">Imprint</h1>
                </div>

                <div className="space-y-12 text-white/60 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Legal Disclosure</h2>
                        <div className="space-y-2">
                            <p className="font-bold text-white uppercase tracking-tight">Leopold Blau</p>
                            <p>Engineering & AI Strategy</p>
                            <p>Email: hello@leopoldblau.com</p>
                            <p>Website: www.leopoldblau.com</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Responsibility for Content</h2>
                        <p>
                            The contents of our pages were created with great care. However, for the correctness, completeness and actuality of the contents we cannot take over any guarantee. As a service provider, we are responsible for our own content on these pages in accordance with general laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Copyright</h2>
                        <p>
                            The contents and works on these pages created by the site operators are subject to German copyright law. The duplication, processing, distribution and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator.
                        </p>
                    </section>
                </div>

                <div className="mt-24 pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    Information according to § 5 TMG
                </div>
            </div>
        </div>
    );
};

export default Imprint;
