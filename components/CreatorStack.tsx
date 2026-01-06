
import React from 'react';
import { Globe, Database, BarChart3, Users, Rocket, TrendingUp } from 'lucide-react';

const CreatorStack: React.FC = () => {
  return (
    <section id="stack" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="w-full lg:flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <TrendingUp size={14} />
              <span>The VibeCode Ecosystem</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
              From Scroll <br className="hidden lg:block" />
              <span className="text-white/40">To Sale.</span>
            </h2>
            <p className="text-white/40 text-[15px] md:text-lg mb-12 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              You already know how to get attention. Now learn to build the high-converting apps that turn your audience into <strong className="text-white/80">loyal customers.</strong> No middleman required.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { label: "Put It Online", tool: "Vercel", desc: "Global edge hosting", icon: <Globe size={18} /> },
                { label: "Store Your Data", tool: "Supabase", desc: "AI-Ready backend", icon: <Database size={18} /> },
                { label: "See Your Visitors", tool: "Google Analytics", desc: "Conversion tracking", icon: <BarChart3 size={18} /> },
                { label: "Your Audience", tool: "Social OS", desc: "Direct traffic flow", icon: <Users size={18} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 text-white/30 group-hover:text-white transition-colors duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{item.label}</p>
                    <p className="font-black text-white italic text-sm">{item.tool}</p>
                    <p className="text-[11px] text-white/30 mt-0.5 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:flex-1">
            <div className="relative aspect-square md:aspect-video lg:aspect-square w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent p-px rounded-[3rem]">
                <div className="absolute inset-0 bg-[#0a0a0a] rounded-[3rem] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0,transparent_50%)]" />
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 md:p-16 text-center">
                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 shadow-2xl relative group cursor-pointer active:scale-90 transition-transform">
                      <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Rocket size={44} className="text-white relative z-10" />
                    </div>
                    <h3 className="text-3xl font-black mb-6 tracking-tighter uppercase italic">The Full Stack <br /> Founder.</h3>
                    <p className="text-white/30 text-sm leading-relaxed font-medium max-w-xs">
                      We use the same tools Silicon Valley giants use to scale—simplified for the solo-creator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorStack;
