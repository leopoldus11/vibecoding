
import React, { useEffect, useState } from 'react';
import SeatTracker from './SeatTracker';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Hero: React.FC = () => {
  const [seatsLeft, setSeatsLeft] = useState<number>(6);
  const [batchDate, setBatchDate] = useState<string>('Upcoming');
  const [hasClaimedSeat, setHasClaimedSeat] = useState(false);

  useEffect(() => {
    // Check if user has already purchased in this session
    try {
      setHasClaimedSeat(sessionStorage.getItem('vibe_purchase_tracked') === 'true');
    } catch (e) {
      console.warn("SessionStorage not available:", e);
    }

    const fetchActiveBatch = async () => {
      try {
        const { data: batches, error } = await supabase
          .from('batches')
          .select('id, date, max_seats')
          .eq('is_active', true)
          .neq('id', 'batch-test')
          .limit(1);

        if (error || !batches?.length) return;

        const batch = batches[0];

        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('batch_id', batch.id)
          .eq('payment_status', 'completed');

        setSeatsLeft(batch.max_seats - (count || 0));
        setBatchDate(batch.date);
      } catch (err) {
        console.error('Error fetching active batch:', err);
      }
    };

    fetchActiveBatch();
  }, []);

  return (
    <section className="relative pt-32 pb-40 md:pt-40 md:pb-[30vh] px-4 md:px-6 overflow-hidden min-h-[100svh] flex flex-col justify-center text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00F0FF]/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10 w-full animate-in fade-in duration-1000 flex flex-col items-center">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 mb-8 md:mb-16">
          <SeatTracker availability={seatsLeft} day={batchDate} />
        </div>

        <h1 className="text-[2.75rem] sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 md:mb-10 leading-[0.85] uppercase italic">
          Ship Your App <br />
          <span className="text-white/20 not-italic">In 6 Hours.</span>
        </h1>

        <p className="text-base md:text-xl text-white/50 max-w-[320px] sm:max-w-xl md:max-w-2xl mx-auto mb-12 md:mb-20 leading-relaxed font-medium px-4">
          The intensive for founders who want to stop talking and start deploying. 
          <span className="text-white/80 block mt-2">
            No syntax. No experience. <br className="sm:hidden" />
            <span className="whitespace-nowrap">Just results.</span>
          </span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto px-6">
          {!hasClaimedSeat ? (
            <a
              href="#booking"
              className="w-full sm:w-auto relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF] to-[#00F0FF]/30 rounded-2xl md:rounded-[2rem] blur-xl opacity-40 group-hover:opacity-80 transition duration-500"></div>
              
              <div className="relative w-full sm:w-auto bg-[#00F0FF] text-black px-12 py-5 md:px-16 md:py-7 rounded-2xl md:rounded-[2rem] text-lg md:text-xl font-black transition-all flex items-center justify-center group active:scale-95 overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[glimmer_2s_infinite] transition-transform pointer-events-none" />
                <span className="relative z-10">Claim Your Seat</span>
                <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
              </div>
            </a>
          ) : (
            <div className="w-full sm:w-auto px-12 py-5 md:px-16 md:py-7 rounded-2xl md:rounded-[2rem] border border-[#00F0FF]/20 bg-[#00F0FF]/5 text-[#00F0FF] font-black text-lg md:text-xl flex items-center gap-3">
              <Sparkles size={24} />
              <span>Seat Secured</span>
            </div>
          )}
          
          <a
            href="#roadmap"
            className="w-full sm:w-auto bg-white text-black px-10 py-5 md:px-14 md:py-7 rounded-2xl md:rounded-[2rem] text-lg md:text-xl font-black hover:bg-white/90 transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          >
            <Play size={18} className="text-black/40 group-hover:text-black transition-colors fill-current" />
            See The Roadmap
          </a>
        </div>

        <div className="mt-32 md:mt-48 pt-12 border-t border-white/5 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 opacity-40">
           <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white leading-none">6H</span>
              <span className="text-[10px] uppercase tracking-widest font-black">Intensive</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white leading-none">100%</span>
              <span className="text-[10px] uppercase tracking-widest font-black">Ownership</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white leading-none">1:6</span>
              <span className="text-[10px] uppercase tracking-widest font-black">Mentor Ratio</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white leading-none">LIVE</span>
              <span className="text-[10px] uppercase tracking-widest font-black">Support</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
