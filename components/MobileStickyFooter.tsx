
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

const MobileStickyFooter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const onTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) { // Only allow sliding down
      setCurrentY(deltaY);
    }
  };

  const onTouchEnd = () => {
    if (currentY > 100) {
      setIsDismissed(true);
      setIsVisible(false);
    }
    setCurrentY(0);
    setStartY(null);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div
      ref={footerRef}
      className="md:hidden fixed bottom-0 left-0 right-0 p-4 z-[100] transition-transform duration-300 ease-out select-none"
      style={{ transform: `translateY(${currentY}px)` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="glass-dark border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center justify-between"
        style={{
          background: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Grabber handle */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/10 rounded-full" />

        <div className="flex items-center gap-3 pl-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Sparkles size={10} className="text-brand-light" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Limited Spots Left</span>
            </div>
            <p className="text-xs font-black text-white italic tracking-tight uppercase">Claim Your Seat</p>
          </div>
        </div>

        <a
          href="#booking"
          onClick={(e) => {
            // Smoothly slide out before dismissing
            setCurrentY(200);
            setTimeout(() => {
              setIsDismissed(true);
              setIsVisible(false);
            }, 300);
          }}
          className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2 group"
        >
          Book Now
          <ArrowRight size={14} />
        </a>
      </div>

      {/* Visual reference that it is slidable */}
      <div className={`flex justify-center mt-2 opacity-20 transition-opacity duration-300 ${currentY > 0 ? 'opacity-0' : ''}`}>
        <ChevronDown size={14} className="animate-bounce" />
      </div>

      <div className="h-safe-bottom" />
    </div>
  );
};

export default MobileStickyFooter;
