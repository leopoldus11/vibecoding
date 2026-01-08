
import React from 'react';
import { ShieldX, Boxes, Gauge, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-24 md:py-40 bg-[#080808] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00F0FF]/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Zap size={14} className="animate-pulse" />
            <span>The Efficiency Wall</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
            Stop Renting <br className="hidden md:block" />
            <span className="text-white/40">Your Future.</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Drag-and-drop builders are the <span className="text-red-400 font-bold underline decoration-red-400/20 underline-offset-8">"Landlord Trap"</span> of the internet. You pay forever, but you never own the deed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: <ShieldX className="text-red-400" size={32} />,
              title: "Zero Ownership",
              desc: "They raise prices? You pay. They shut down? You lose everything. Your app is a guest on their server.",
              accent: "red"
            },
            {
              icon: <Boxes className="text-white/40" size={32} />,
              title: "Feature Walls",
              desc: "The second you need a custom logic flow, the 'Easy' tool says no. You're trapped in their template.",
              accent: "white"
            },
            {
              icon: <Gauge className="text-white/40" size={32} />,
              title: "Slow & Generic",
              desc: "Bloated code and slow load times. Your customers can tell it's a template. It lacks the elite vibe.",
              accent: "white"
            }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group flex flex-col items-center text-center">
              <div className="mb-8 p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">{item.title}</h4>
              <p className="text-sm text-white/30 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
            <Sparkles size={200} className="text-[#00F0FF]" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="text-[#00F0FF] text-[10px] font-black uppercase tracking-[0.4em] mb-4">The VibeCode Solution</div>
              <h3 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter leading-none uppercase italic">Build Like <br />An Engineer.</h3>
              <div className="space-y-6">
                {[
                  "Describe features in English, get production code.",
                  "Own 100% of the IP. Host anywhere, forever.",
                  "Zero technical debt. Scale as fast as your ideas."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                       <CheckCircle2 size={14} />
                    </div>
                    <span className="text-white/60 text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
               <div className="flex items-center gap-2 mb-6 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-mono ml-2 uppercase tracking-widest">vibe_terminal</span>
               </div>
               <div className="font-mono text-sm space-y-3">
                  <div className="text-white/20">$ ai build --feature "recurring payments"</div>
                  <div className="text-[#00F0FF]">&gt;&gt; Integrating Stripe API...</div>
                  <div className="text-[#00F0FF]">&gt;&gt; Writing secure checkout logic...</div>
                  <div className="text-green-400">&gt;&gt; Feature deployed to Vercel Edge.</div>
                  <div className="animate-pulse text-white/40">_</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
