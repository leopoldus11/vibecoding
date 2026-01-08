
import React, { useState, useEffect } from 'react';
import { Shield, X, Info } from 'lucide-react';

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
        // Only show if no consent is stored
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSave = (prefs: typeof preferences) => {
        const uid = getVibeUid();

        // 1. Google Consent Mode V2 Update
        const gtag = (window as any).gtag;
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'ad_storage': prefs.marketing ? 'granted' : 'denied',
                'analytics_storage': prefs.analytics ? 'granted' : 'denied',
                'ad_user_data': prefs.marketing ? 'granted' : 'denied',
                'ad_personalization': prefs.marketing ? 'granted' : 'denied'
            });

            // Push an event to trigger tags waiting for consent
            (window as any).dataLayer?.push({
                event: 'consent_updated',
                consent_prefs: prefs
            });
        }

        // 2. Persist Locally & Set Cross-Domain Cookie
        localStorage.setItem('vibe_consent_v2', JSON.stringify(prefs));
        const domain = window.location.hostname.includes('leopoldblau.com') ? '; domain=.leopoldblau.com' : '';
        document.cookie = `vibe_uid=${uid}; path=/; max-age=31536000${domain}; SameSite=Lax`;
        document.cookie = `vibe_consent_v2=${JSON.stringify(prefs)}; path=/; max-age=31536000${domain}; SameSite=Lax`;

        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 md:left-auto md:w-[420px] z-[100] p-4 md:p-6 transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <div className="bg-[#0A0A0A] border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden group">
                {/* Subtle edge glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                <div className="relative z-10">
                    {!showDetails ? (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-white/30 mb-3">
                                    <Shield size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-sans">Privacy Protocol</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
                                    Data <span className="text-white/40">Transparency.</span>
                                </h3>
                                <p className="text-white/40 text-[11px] md:text-xs leading-relaxed font-medium">
                                    I use a secure, anonymous identifier to analyze batch interest and improve the curriculum. No personal profiles are created.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleSave({ essential: true, analytics: true, marketing: true })}
                                    className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5"
                                >
                                    Accept All
                                </button>
                                <button
                                    onClick={() => setShowDetails(true)}
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                                >
                                    Customize Protocol
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Granular Controls</h3>
                                <button onClick={() => setShowDetails(false)} className="text-white/20 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3 mb-8">
                                {[
                                    { id: 'essential', label: 'Essential', desc: 'Security & core functionality.', locked: true },
                                    { id: 'analytics', label: 'Analytics', desc: 'Anonymous batch interest mapping.', locked: false },
                                    { id: 'marketing', label: 'Marketing', desc: 'Campaign attribution protocol.', locked: false }
                                ].map((item) => (
                                    <div key={item.id} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between group/item hover:border-white/10 transition-colors">
                                        <div className="pr-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white block mb-1">{item.label}</span>
                                            <p className="text-[9px] text-white/30 leading-tight font-medium">{item.desc}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            disabled={item.locked}
                                            checked={(preferences as any)[item.id]}
                                            onChange={(e) => setPreferences({ ...preferences, [item.id]: e.target.checked })}
                                            className="w-5 h-5 rounded-lg bg-black border-white/20 text-white focus:ring-0 accent-white cursor-pointer disabled:opacity-20"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSave(preferences)}
                                className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/90 transition-all shadow-xl shadow-white/5"
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
