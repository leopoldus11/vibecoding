
import React from 'react';
import { ShieldX, Boxes, Gauge, Sparkles, Zap, Heart } from 'lucide-react';

const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-32 bg-brand-gray/30 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-6">
              The Real Problem
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-8 leading-tight">
              "Easy" tools are <br />holding you back.
            </h2>
            <p className="text-lg text-white/40 mb-10 leading-relaxed">
              Drag-and-drop builders promise speed, but the moment you need something custom? You're stuck. Paying monthly fees for an app you can't truly control or take with you.
            </p>
            <div className="grid gap-6">
              {[
                { icon: <ShieldX className="text-red-400" />, title: "You Don't Own It", desc: "Your app lives on their servers. They raise prices? You pay. They shut down? You lose everything." },
                { icon: <Boxes className="text-white/60" />, title: "Hits a Wall Fast", desc: "Want a feature they don't support? Hire an expensive developer or give up." },
                { icon: <Gauge className="text-white/60" />, title: "Feels Slow & Clunky", desc: "Your customers notice the lag. It feels cheap because it is." }
              ].map((item, i) => (
                <div key={i} className="flex space-x-5">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                    <p className="text-sm text-white/30">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-white/5 rounded-full blur-3xl" />
            <div className="relative gradient-border p-10 rounded-[2.5rem] bg-brand-gray/50 backdrop-blur-xl">
              <h3 className="text-2xl font-black mb-8 tracking-tight">What You'll Learn Instead</h3>
              <div className="space-y-8">
                {[
                  { icon: <Sparkles size={16} />, text: "Talk to AI, get working apps. No coding syntax to memorize—just describe what you want in plain English." },
                  { icon: <Heart size={16} />, text: "100% yours, forever. Your app, your servers, your rules. Take it anywhere, modify anything." },
                  { icon: <Zap size={16} />, text: "Launch in hours, not months. Stop waiting on developers. See your ideas come to life the same day." }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:bg-white group-hover:text-black transition-all">
                      {item.icon}
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Outcome: A real app you built, understand, and own.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
