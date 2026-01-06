
import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X, ArrowRight } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#roadmap', label: 'The Roadmap' },
    { href: '#stack', label: 'The Stack' },
    { href: '#booking', label: 'Intensives' },
    { href: '#consulting', label: 'Consulting' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
            ? 'py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5'
            : 'py-8 bg-transparent'
          }`}
      >
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo - Matches parent brand style */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-xl">
                <Terminal size={20} className="text-black" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black tracking-tighter text-xl">VIBE<span className="text-white/40 italic">CODING</span></span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">by Leopold Blau</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all hover:tracking-[0.3em] active:scale-95"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a
                href="#booking"
                className="hidden sm:flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Claim Seat
                <ArrowRight size={14} className="opacity-40" />
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/60 active:scale-90 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsMobileMenuOpen(false)} />
        <nav className="relative h-full flex flex-col items-center justify-center gap-12 p-10">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-black tracking-tighter hover:text-brand-light transition-colors"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full max-w-xs bg-white text-black py-6 rounded-[2rem] font-black text-xl text-center shadow-2xl"
          >
            Claim Your Seat
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
