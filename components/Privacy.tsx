
import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-sans selection:bg-white selection:text-black">
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
                        <Shield size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic underline decoration-white/10 underline-offset-8">Privacy Policy</h1>
                </div>

                <div className="space-y-12 text-white/60 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">1. Overview</h2>
                        <p>
                            This Privacy Policy describes how your personal information is collected, used, and shared when you visit vibe.leopoldblau.com. We take your privacy seriously and only collect the minimum amount of data required to provide our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">2. Information Collection</h2>
                        <p>
                            When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, and time zone. Additionally, if you sign up for our guide or courses, we collect your name, email address, and company name.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">3. Use of Information</h2>
                        <p>
                            We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information and providing you with invoices and/or order confirmations).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">4. Analytics & Tracking</h2>
                        <p>
                            We use Google Tag Manager (GTM) and Google Analytics 4 (GA4) to understand how visitors interact with the Site. These services use cookies to collect data. However, we have implemented **Google Consent Mode V2**, which means no analytics or marketing cookies are stored unless you explicitly grant permission via our privacy banner.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">5. Anonymous Identity</h2>
                        <p>
                            To improve our curriculum and batch planning without creating personal profiles, we use a unique, anonymous identifier called `vibe_uid`. This ID is stored in a first-party cookie and allows us to stitch your journey across our subdomains (e.g., from landing to booking) without knowing who you are personally.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">6. Third Parties</h2>
                        <p>
                            We use PayPal for payments, Supabase for secure data storage, and Resend for transactional emails. Each service has its own privacy standards. We never sell your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">7. Contact</h2>
                        <p>
                            Questions regarding your data? Contact us at hello@leopoldblau.com.
                        </p>
                    </section>
                </div>

                <div className="mt-24 pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    Last Updated: January 2026
                </div>
            </div>
        </div>
    );
};

export default Privacy;
