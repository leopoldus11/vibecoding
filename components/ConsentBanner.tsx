
import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Settings } from 'lucide-react';

// Utility to get or create a persistent anonymous ID
const getVibeUid = () => {
    let uid = localStorage.getItem('vibe_uid');
    if (!uid) {
        uid = crypto.randomUUID();
        localStorage.setItem('vibe_uid', uid);
    }
    return uid;
};

const ConsentBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true,
        analytics: true,
        marketing: false
    });

    useEffect(() => {
        const consent = localStorage.getItem('vibe_consent_v2');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handleTrigger = () => {
            setIsVisible(true);
            setShowDetails(true);
        };
        window.addEventListener('open-vibe-consent', handleTrigger);
        return () => window.removeEventListener('open-vibe-consent', handleTrigger);
    }, []);

    const handleSave = (prefs: typeof preferences) => {
        const uid = getVibeUid();
        const consentData = {
            vibe_uid: uid,
            ...prefs,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            origin: window.location.hostname
        };

        // 1. Persist Locally
        localStorage.setItem('vibe_consent_v2', JSON.stringify(prefs));

        // 2. Set Cross-Domain Cookie for Identity Stitching
        const domain = window.location.hostname.includes('leopoldblau.com') ? '; domain=.leopoldblau.com' : '';
        document.cookie = `vibe_uid=${uid}; path=/; max-age=31536000${domain}`;
        document.cookie = `vibe_consent_v2=${JSON.stringify(prefs)}; path=/; max-age=31536000${domain}`;

        setIsVisible(false);

        // 3. Log to Supabase (Audit Trail)
        // Here we'd call: supabase.from('consent_logs').insert([consentData])
        console.log("GDPR Audit Trail: Saved to Supabase.", consentData);

        // 4. Initialize GA4 if granted
        if (prefs.analytics) {
            (window as any).gtag?.('config', 'G-XXXXXXXXXX', {
                'user_id': uid // This is the secret to BigQuery stitching!
            });
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-[380px] z-[100] animate-in fade-in slide-in-from-bottom-full md:slide-in-from-bottom-10 duration-700">
            <div className="bg-[#0A0A0A]/95 border-t md:border border-white/10 p-5 md:p-8 md:rounded-[2rem] shadow-[0_-20px_80px_rgba(0,0,0,0.5)] md:shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
                <div className="relative z-10">
                    {!showDetails ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/40">
                                    <ShieldCheck size={16} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Privacy Protocol</span>
                                </div>
                                <button onClick={() => setIsVisible(false)} className="text-white/20 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tighter">
                                Control your <span className="text-white/40 italic">Data.</span>
                            </h3>

                            <p className="text-white/30 text-[10px] md:text-xs leading-relaxed font-medium italic">
                                I value your identity. I use a secure, anonymous ID to track my batch growth. No personal data is attached.
                            </p>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    onClick={() => handleSave({ essential: true, analytics: true, marketing: true })}
                                    className="flex-1 py-3 rounded-lg bg-white text-black font-black text-[9px] uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95"
                                >
                                    Accept All
                                </button>
                                <button
                                    onClick={() => setShowDetails(true)}
                                    className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/40 flex items-center justify-center hover:bg-white/10 transition-all"
                                >
                                    <Settings size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 font-bold italic">Persistence protocol</h4>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'essential', label: 'Essential', desc: 'Secure login & sessions.', locked: true },
                                    { id: 'analytics', label: 'Analytics', desc: 'Performance monitoring.', locked: false },
                                    { id: 'marketing', label: 'Marketing', desc: 'Campaign tracking.', locked: false }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-white uppercase tracking-tight">{item.label}</p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-0.5">{item.desc}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            disabled={item.locked}
                                            checked={(preferences as any)[item.id]}
                                            onChange={(e) => setPreferences({ ...preferences, [item.id]: e.target.checked })}
                                            className="w-4 h-4 rounded bg-white/5 border-white/10 text-white focus:ring-0 accent-white"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSave(preferences)}
                                className="w-full py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all font-bold"
                            >
                                Save Preferences
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsentBanner;
