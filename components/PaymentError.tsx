
import React from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';

const PaymentError: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 md:p-20 font-sans selection:bg-white selection:text-black">
            <div className="max-w-xl w-full text-center relative">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 animate-in fade-in zoom-in duration-700">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 text-red-500">
                        <AlertCircle size={40} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-6">
                        Your seat is <br />
                        <span className="text-white/40">still waiting.</span>
                    </h1>

                    <p className="text-white/40 text-lg leading-relaxed mb-12 font-medium">
                        The payment didn't quite make it through. Don't worry—we haven't given your spot away yet. Let's try that again.
                    </p>

                    <div className="flex flex-col gap-4">
                        <a
                            href="#booking"
                            className="w-full py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 group shadow-2xl"
                        >
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                            Try Booking Again
                        </a>

                        <a
                            href="#consulting"
                            className="w-full py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={18} className="opacity-40" />
                            Need Help? Talk to Me
                        </a>
                    </div>

                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-white/20 hover:text-white mt-12 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Homepage</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentError;
