
import React, { useState } from 'react';
import { Terminal, CheckCircle2, Package, Globe, Cpu, MousePointer2, FileText, ArrowRight, X, Loader2 } from 'lucide-react';

const MacBookAudit: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const requirements = [
    { name: 'Homebrew', desc: 'The macOS Package Manager', icon: <Package size={16} /> },
    { name: 'Node.js & NPM', desc: 'The engine that runs your apps', icon: <Cpu size={16} /> },
    { name: 'Git & GitHub CLI', desc: 'Version control for your code', icon: <Globe size={16} /> },
    { name: 'Vercel CLI', desc: 'Instant global cloud deployment', icon: <Terminal size={16} /> },
    { name: 'Cursor', desc: 'AI-Native Code Editor', icon: <MousePointer2 size={16} /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  return (
    <section id="roadmap" className="py-24 md:py-32 px-4 md:px-6 bg-black/40 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Terminal size={14} />
            <span>The VibeCoding Roadmap</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            From Setup to <br className="hidden md:block" />
            <span className="text-white/40 italic">Live Deployment.</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
            We don't just build; we optimize your system for speed. You'll master the elite tools of modern engineering—without the 4-year degree.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Environment Checklist */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                </div>
                <div className="text-[10px] uppercase font-black tracking-widest text-white/20">Pre-Flight Checklist</div>
              </div>

              <div className="p-8 space-y-4">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                        {req.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white uppercase tracking-tight">{req.name}</div>
                        <div className="text-[11px] text-white/30">{req.desc}</div>
                      </div>
                    </div>
                    <CheckCircle2 size={18} className="text-green-500/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pre-Course Material Call-out */}
          <div className="space-y-8 lg:pt-8 text-left">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white text-black shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FileText size={120} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic underline decoration-black/10 underline-offset-8">Leopold’s Zero-to-One Mac Setup</h3>
              <p className="text-black/60 leading-relaxed mb-8 font-medium">
                The definitive engineering environment guide. We'll ensure your system is a developer's dream before you even write your first prompt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="px-4 py-3 rounded-xl bg-black/5 flex items-center gap-2">
                  <FileText size={16} className="opacity-40" />
                  <span className="text-[11px] font-black uppercase tracking-widest">32-Page PDF Guide</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-5 rounded-2xl bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-black/90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Download The Guide
                <Terminal size={14} />
              </button>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center text-white/20">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight">Built for Performance</h4>
                <p className="text-sm text-white/30 leading-relaxed">
                  We don't waste time on buggy installs. Whether you join the course or not, this guide sets you up with the elite stack I use to build multi-million dollar data pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead capture modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-lg p-10 md:p-12 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
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
                  <p className="text-white/40 text-sm">Enter your details and I'll send the download link to your inbox immediately.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company (Optional)"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      required
                      type="email"
                      placeholder="Your Email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  <button
                    disabled={isLoading}
                    className="w-full py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
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
                  <p className="text-[10px] text-center text-white/20 uppercase tracking-widest pt-4">Zero Spam. High Vibe Engineering only.</p>
                </form>
              </>
            ) : (
              <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">It's On The Way.</h3>
                <p className="text-white/40 leading-relaxed mb-10">
                  Check your inbox. I've sent you the **Zero-to-One Mac Setup** Guide. Start building.
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
