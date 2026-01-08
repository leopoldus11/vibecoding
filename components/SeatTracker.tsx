
import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

interface SeatTrackerProps {
  availability: number;
  day: string;
}

const SeatTracker: React.FC<SeatTrackerProps> = ({ availability, day }) => {
  // Helper to format date: "January 20 & January 21" -> "January 20 & 21"
  const formatDay = (d: string) => {
    if (typeof d !== 'string') return '';
    const parts = d.split(' & ');
    if (parts.length === 2) {
      const firstPart = parts[0].split(' ');
      const secondPart = parts[1].split(' ');
      if (firstPart[0] && secondPart[0] && firstPart[0] === secondPart[0]) {
        return `${parts[0]} & ${secondPart[1]}`;
      }
    }
    return d;
  };

  return (
    <div className="inline-flex items-center space-x-2 md:space-x-3 bg-white/[0.03] text-white/90 px-4 py-2.5 md:px-6 md:py-3 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,240,255,0.05)] backdrop-blur-xl group hover:scale-105 transition-all duration-500 hover:border-[#00F0FF]/30">
      <div className="relative">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
        <div className="absolute inset-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00F0FF] animate-ping opacity-30" />
      </div>
      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
        Only <span className="text-[#00F0FF] underline underline-offset-4 decoration-[#00F0FF]/40">{availability} Seats</span> Remaining · {formatDay(day)}
        <Sparkles size={12} className="text-[#00F0FF] opacity-50 hidden sm:block animate-pulse" />
      </span>
      <div className="h-4 w-px bg-white/10" />
      <Zap size={14} className="text-[#00F0FF] fill-[#00F0FF] group-hover:rotate-12 transition-transform shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
    </div>
  );
};

export default SeatTracker;
