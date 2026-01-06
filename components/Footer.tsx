
import React from 'react';
import { Terminal, Mail, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/leopoldblau' },
    { label: 'X / Twitter', href: 'https://x.com/leopoldblau' },
    { label: 'TikTok', href: 'https://tiktok.com/@leopoldblau' },
  ];

  const legalLinks = [
    { label: 'Privacy', href: '#privacy' },
    { label: 'Imprint', href: '#imprint' },
  ];

  return (
    <footer className="py-20 md:py-32 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 md:gap-x-24 mb-24">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 text-white">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Terminal size={20} className="text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">VibeCoding</span>
            </div>
            <p className="text-white/40 text-lg md:text-xl leading-relaxed max-w-md font-medium italic">
              Empowering creators to build and own their software. No code limits. No technical baggage. Just vibes and shipping.
            </p>
            <a
              href="mailto:hello@leopoldblau.com"
              className="inline-flex items-center gap-2 mt-8 text-sm font-black uppercase tracking-widest text-white hover:text-white/60 transition-colors group"
            >
              <Mail size={16} />
              hello@leopoldblau.com
            </a>
          </div>

          {/* Nav Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Navigation</h4>
            <nav className="flex flex-col gap-6">
              {['Roadmap', 'Stack', 'Intensives', 'Consulting'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-bold text-white/60 hover:text-white transition-all hover:translate-x-1"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Follow My Journey</h4>
            <div className="flex flex-col gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-lg font-bold text-white/60 hover:text-white transition-all group"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
              &copy; {currentYear} Leopold Blau. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
