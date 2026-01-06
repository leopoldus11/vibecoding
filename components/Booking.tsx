
import React from 'react';
import { CalendarCheck, ShieldCheck } from 'lucide-react';

const Booking: React.FC = () => {
  return (
    <section id="booking" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black tracking-tighter mb-6">Ready to Ship?</h2>
          <p className="text-white/40 text-lg">
            Choose a time for your intensive. Limited to 6 founders per intake to ensure high-bandwidth mentorship.
          </p>
        </div>

        <div className="bg-brand-gray/50 rounded-[3rem] border border-white/10 p-2 overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          {/* TidyCal Embed Placeholder */}
          <div className="w-full h-[500px] bg-brand-black/40 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 border border-white/5">
             <CalendarCheck size={48} className="text-white/10 mb-6" />
             <h3 className="text-xl font-bold mb-2">Syncing Calendar...</h3>
             <p className="text-white/20 text-sm mb-8">[ TIDYCAL WIDGET LOADS HERE ]</p>
             <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-white animate-[loading_2s_infinite]" />
             </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-4 bg-white/5 py-6 px-8 rounded-full border border-white/10 max-w-lg mx-auto">
           <ShieldCheck className="text-white/40 flex-shrink-0" size={24} />
           <p className="text-sm font-medium text-white/60">
             <span className="text-white font-bold underline decoration-white/20 underline-offset-4">The Guarantee:</span> If you don't ship a functional feature in your first session, you get 100% of your money back. Zero fluff.
           </p>
        </div>
      </div>
    </section>
  );
};

export default Booking;
