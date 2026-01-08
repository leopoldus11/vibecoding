import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Calendar, Download, Sparkles, Terminal, ExternalLink, Video } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { analytics } from '../lib/analytics';

const PaymentSuccess: React.FC = () => {
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    useEffect(() => {
        // Fetch selected course from Supabase
        const fetchCourse = async () => {
            const savedCourseId = localStorage.getItem('vibe_pending_selection');
            if (savedCourseId) {
                const { data: course, error } = await supabase
                    .from('batches')
                    .select('*')
                    .eq('id', savedCourseId)
                    .single();

                if (!error && course) {
                    setSelectedCourse(course);
                }
            }
        };
        fetchCourse();

        // Track: Purchase
        const trackPurchase = async () => {
            const lastBookingId = localStorage.getItem('vibe_last_booking_id');
            const hasTracked = sessionStorage.getItem('vibe_purchase_tracked');

            if (lastBookingId && !hasTracked) {
                const { data: booking } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', lastBookingId)
                    .single();

                if (booking && booking.payment_status === 'completed') {
                    analytics.purchase(booking);
                    sessionStorage.setItem('vibe_purchase_tracked', 'true');
                }
            }
        };

        trackPurchase();

        // Launch celebratory confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const generateGoogleCalendarUrl = (session: any, topic: string) => {
        const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
        const text = encodeURIComponent(`VibeCoding Intake: ${topic}`);
        const details = encodeURIComponent('Welcome to the VibeCoding Intensive. I have sent the workroom link to your inbox.');
        const dates = `${session.start}/${session.end}`;
        return `${baseUrl}&text=${text}&details=${details}&dates=${dates}`;
    };

    const generateIcsData = (sessions: any[], topic: string) => {
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Leopold Blau//VibeCoding//EN\n';
        sessions.forEach((session, index) => {
            icsContent += 'BEGIN:VEVENT\n';
            icsContent += `SUMMARY:VibeCoding Intake: ${topic} (Day ${index + 1})\n`;
            icsContent += `DTSTART:${session.start}\n`;
            icsContent += `DTEND:${session.end}\n`;
            icsContent += 'DESCRIPTION:Welcome to the VibeCoding Intensive. The workroom link has been sent to your inbox.\n';
            icsContent += 'END:VEVENT\n';
        });
        icsContent += 'END:VCALENDAR';
        return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 md:p-8 font-sans selection:bg-white selection:text-black overflow-y-auto">
            <div className="max-w-4xl w-full text-center relative py-8 md:py-4">
                {/* Glow behind content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-light/5 blur-[100px] rounded-full pointer-events-none animate-pulse" />

                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-white text-black flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                        <CheckCircle2 size={36} className="md:size-12" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-3 md:mb-4">
                        You're In. <br />
                        <span className="text-white/40 italic">WAGMI.</span>
                    </h1>

                    <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 md:mb-10 font-medium max-w-md mx-auto italic">
                        "The best way to predict the future is to build it." <br />
                        See you in the workroom.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 md:gap-6 text-left mb-8 md:mb-10 max-w-5xl mx-auto">
                        {/* Calendar Section */}
                        <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                            <div>
                                <Calendar className="text-brand-light mb-4" size={20} />
                                <h3 className="font-black uppercase tracking-tight text-base mb-1">Block Your Date</h3>
                                <p className="text-[11px] md:text-xs text-white/30 leading-relaxed mb-5">Add the sessions to your calendar to stay on track.</p>
                            </div>

                            {selectedCourse && selectedCourse.sessions ? (
                                <div className="space-y-2">
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/10 ml-1">Google Calendar</p>
                                        {selectedCourse.sessions.map((session: any, i: number) => (
                                            <a
                                                key={i}
                                                href={generateGoogleCalendarUrl(session, selectedCourse.topic)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[10px] md:text-xs font-bold group"
                                            >
                                                <span>Day {i + 1}: {selectedCourse.date.split('&')[i]?.trim() || 'Session'}</span>
                                                <ExternalLink size={12} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ))}
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-white/5">
                                        <a
                                            href={generateIcsData(selectedCourse.sessions, selectedCourse.topic)}
                                            download="vibecoding-intake.ics"
                                            className="w-full py-3 rounded-lg bg-white text-black text-center font-black text-[9px] uppercase tracking-[0.2em] hover:bg-white/90 transition-all block shadow-lg shadow-white/5"
                                        >
                                            Apple / Outlook File
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-[10px] text-white/10 italic">Awaiting session details...</div>
                            )}
                        </div>

                        {/* Onboarding Section */}
                        <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                            <div>
                                <Download className="text-brand-light mb-4" size={20} />
                                <h3 className="font-black uppercase tracking-tight text-base mb-1">Setup Required</h3>
                                <p className="text-[11px] md:text-xs text-white/30 leading-relaxed mb-5">Start the pre-flight checklist immediately. Manual is in your inbox.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Terminal size={14} className="text-white/30" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">Zero-to-One Mac Guide</p>
                                        <p className="text-[8px] md:text-[9px] text-white/20 uppercase tracking-widest mt-0.5 font-black italic">Check Email Attachment</p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={14} className="text-white/30" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">Access Link</p>
                                        <p className="text-[8px] md:text-[9px] text-white/20 uppercase tracking-widest mt-0.5 font-black italic">Sent to your inbox</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Onboarding Call Section */}
                        <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                            <div>
                                <Video className="text-brand-light mb-4" size={20} />
                                <h3 className="font-black uppercase tracking-tight text-base mb-1">Book Your Call</h3>
                                <p className="text-[11px] md:text-xs text-white/30 leading-relaxed mb-5">Schedule your 1:1 kickoff to align on your project goals.</p>
                            </div>

                            <div className="space-y-3 mt-auto">
                                {import.meta.env.VITE_CALCOM_URL ? (
                                    <a
                                        href={import.meta.env.VITE_CALCOM_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 rounded-xl bg-brand-light text-black text-center font-black text-[10px] uppercase tracking-[0.15em] hover:bg-white transition-all block shadow-lg shadow-brand-light/10"
                                    >
                                        Schedule Now
                                    </a>
                                ) : (
                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <Video size={14} className="text-white/30" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">Scheduling Link</p>
                                            <p className="text-[8px] md:text-[9px] text-white/20 uppercase tracking-widest mt-0.5 font-black italic">Sent to your inbox</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                <Terminal size={12} className="text-white/40" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50">VibeCoding Batch Member</span>
                        </div>

                        <a
                            href="/"
                            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Return Home</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
