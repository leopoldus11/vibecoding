
import React from 'react';
import SeatTracker from './SeatTracker';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import coursesData from '../data/courses.json';

const Hero: React.FC = () => {
  // Get the first active batch for the tracker
  const activeBatch = coursesData.find(b => b.seats_booked < b.max_seats) || coursesData[0];
  const seatsLeft = activeBatch.max_seats - activeBatch.seats_booked;

  return (
    <section className="relative pt-40 pb-16 md:pt-48 md:pb-32 px-4 md:px-6 overflow-hidden min-h-[100svh] flex flex-col justify-center">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-light/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 w-full animate-in fade-in duration-1000 flex flex-col items-center">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 mb-6 md:mb-12">
          <SeatTracker availability={seatsLeft} day={activeBatch.date} />
        </div>

        <h1 className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 md:mb-8 leading-[0.9] text-white">
          Build Your App.<br />
          <span className="text-white/30 italic">No Coding Required.</span>
        </h1>

        <p className="text-[13px] md:text-lg text-white/50 max-w-[280px] sm:max-w-lg md:max-w-xl mx-auto mb-8 md:mb-14 leading-relaxed font-medium px-4">
          A 6-hour intensive (spread over 2 days) where you'll use AI to build a real, working app—even if you've never written a line of code.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-6">
          <a
            href="#booking"
            className="w-full sm:w-auto bg-white text-black px-10 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] text-base md:text-lg font-black hover:bg-white/90 transition-all flex items-center justify-center group shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Claim Your Seat
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform opacity-40" />
          </a>
          <a
            href="#roadmap"
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] text-base md:text-lg font-black hover:bg-white/10 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <Play size={16} className="opacity-40 group-hover:text-brand-light transition-colors" />
            The Roadmap
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
