
import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

interface SeatTrackerProps {
  availability: number;
  day: string;
}

const SeatTracker: React.FC<SeatTrackerProps> = ({ availability, day }) => {
  return (
    <div className="inline-flex items-center space-x-3 bg-white/[0.03] text-white/90 px-6 py-3 rounded-full border border-white/10 shadow-2xl backdrop-blur-xl group hover:scale-105 transition-transform duration-500">
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-brand-light animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-white animate-ping opacity-20" />
      </div>
      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.3em] flex items-center gap-2 whitespace-nowrap">
        Only <span className="text-white underline underline-offset-4 decoration-white/20">{availability} Seats</span> Left · {day}
        <Sparkles size={10} className="text-brand-light opacity-50 hidden sm:block" />
      </span>
      <Zap size={14} className="text-brand-light fill-brand-light group-hover:rotate-12 transition-transform" />
    </div>
  );
};

export default SeatTracker;
