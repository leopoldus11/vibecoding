
import React, { useState } from 'react';
import { Terminal, CheckCircle2, Package, Globe, Cpu, MousePointer2, FileText, ArrowRight, X, Loader2, Sparkles, Zap, Database, Shield, CreditCard, Layout } from 'lucide-react';

const MacBookAudit: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const preFlight = [
    { name: 'Homebrew', desc: 'The macOS Package Manager', icon: <Package size={16} /> },
    { name: 'Node.js & NPM', desc: 'The engine that runs your apps', icon: <Cpu size={16} /> },
    { name: 'Git & GitHub CLI', desc: 'Version control for your code', icon: <Globe size={16} /> },
    { name: 'Vercel CLI', desc: 'Instant global cloud deployment', icon: <Terminal size={16} /> },
  ];

  const intensivePhases = [
    {
      title: "Environment Tuning",
      desc: "Setting up the Elite Stack: Antigravity, Cursor, and VSCode for maximum AI-sync.",
      icon: <MousePointer2 size={20} />
    },
    {
      title: "The Studio Scribble",
      desc: "Scribbling an idea in Google AI Studio, generating the foundation, and downloading the build.",
      icon: <Layout size={20} />
    },
    {
      title: "Multi-Model MCP Setup",
      desc: "Bridging Gemini (Frontend) and Claude Code (Backend/Terminal) to initialize your stack.",
      icon: <Zap size={20} />
    },
    {
      title: "Architect & Deliver",
      desc: "Live implementation of Supabase Database, Authentication, and PayPal Payment flows.",
      icon: <Shield size={20} />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  return (
    <section id="roadmap" className="py-24 md:py-40 px-4 md:px-6 bg-black/40 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-[#00F0FF] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Sparkles size={14} className="animate-pulse" />
            <span>The VibeCoding Roadmap</span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] uppercase italic text-white">
            Idea To <br className="hidden md:block" />
            <span className="text-white/40 not-italic uppercase">Production.</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed italic">
            This isn't a tutorial. It's a high-bandwidth engineering sprint where we deploy <span className="text-white">real-world architecture.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Main Course Path */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 rounded-full bg-[#00F0FF] text-black flex items-center justify-center font-black">01</div>
               <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">The Intensive Curriculum</h3>
            </div>
            
            <div className="grid gap-4">
              {intensivePhases.map((phase, i) => (
                <div key={i} className="group relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#00F0FF]/30 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform duration-500">
                      {phase.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic">{phase.title}</h4>
                      <p className="text-sm text-white/40 leading-relaxed font-medium">{phase.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-flight & Setup */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4 mb-8 lg:mb-8">
               <div className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center font-black">00</div>
               <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">Pre-Flight Setup</h3>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 space-y-4">
              <div className="text-[10px] uppercase font-black tracking-widest text-white/20 mb-4 flex items-center gap-2">
                <Terminal size={12} />
                Terminal Basics (Automated via PDF)
              </div>
              {preFlight.map((req, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                      {req.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white uppercase tracking-tight">{req.name}</div>
                      <div className="text-[10px] text-white/30">{req.desc}</div>
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-green-500/40" />
                </div>
              ))}
            </div>

            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white text-black shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FileText size={120} />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-4 tracking-tight uppercase italic leading-none">The Zero-to-One <br />Mac Setup Guide</h3>
              <p className="text-black/60 text-sm leading-relaxed mb-8 font-medium">
                The definitive engineering environment guide. Master the elite terminal setup I use for multi-million dollar data projects.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-5 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Download PDF Manual
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead capture modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 text-white">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-lg p-10 md:p-12 shadow-[0_0_100px_rgba(0,240,255,0.1)]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {step === 'form' ? (
              <>
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-black mb-3 tracking-tighter uppercase italic">Secure The Guide.</h3>
                  <p className="text-white/40 text-sm">Get the terminal configuration that 10x's your shipping speed.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-[#00F0FF]/30 transition-colors"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-[#00F0FF]/30 transition-colors"
                  />
                  <button
                    disabled={isLoading}
                    className="w-full py-6 rounded-2xl bg-[#00F0FF] text-black font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        Get The VibeCode Setup
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-white/20 uppercase tracking-widest pt-4 italic">No Fluff. Elite Engineering Only.</p>
                </form>
              </>
            ) : (
              <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">It's On The Way.</h3>
                <p className="text-white/40 leading-relaxed mb-10 text-sm">
                  Check your inbox. Start with the terminal setup. We'll handle the rest in the intensive.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-5 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MacBookAudit;
