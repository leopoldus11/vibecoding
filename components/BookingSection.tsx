
import React, { useEffect, useState } from 'react';
import { Clock, ShieldCheck, ArrowRight, UserPlus, Sparkles, Terminal } from 'lucide-react';
import coursesData from '../data/courses.json';
import { supabase } from '../lib/supabase';
import PayPalButton from './PayPalButton';
import { analytics } from '../lib/analytics';

interface Course {
  id: string;
  topic: string;
  date: string;
  time_slots: string;
  max_seats: number;
  seats_booked: number;
  is_active: boolean;
  price: number;
}

interface BookingSectionProps {
  /** Cal.com embed URL for consulting calls */
  embedUrl?: string;
  /** PayPal.me URL - Default fallback */
  paypalUrl?: string;
}

const BookingSection: React.FC<BookingSectionProps> = ({ embedUrl, paypalUrl }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [preferredEmail, setPreferredEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const sectionRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('batch_id, payment_status')
          .eq('payment_status', 'completed');

        if (error) throw error;

        const counts: Record<string, number> = {};
        data.forEach(booking => {
          counts[booking.batch_id] = (counts[booking.batch_id] || 0) + 1;
        });
        setBookingCounts(counts);
      } catch (err) {
        console.error('Error fetching real-time bookings:', err);
      }
    };

    fetchBookings();

    const isTestMode = window.location.search.includes('test=true');
    const filteredCourses = coursesData.filter(c =>
      c.id !== 'batch-test' || isTestMode
    );

    const augmentedCourses = filteredCourses.map(c => ({
      ...c,
      seats_booked: (bookingCounts[c.id] || 0)
    }));

    setCourses(augmentedCourses as Course[]);

    // Visibility-based Tracking for Item List
    let observer: IntersectionObserver;
    if (sectionRef.current && augmentedCourses.length > 0) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          analytics.viewItemList(augmentedCourses);
          observer.disconnect(); // Only fire once
        }
      }, { threshold: 0.1 });
      observer.observe(sectionRef.current);
    }

    // Persistence: Check if we are returning from a payment error
    const savedCourseId = localStorage.getItem('vibe_pending_selection');
    if (savedCourseId && window.location.hash !== '#success') {
      const pending = augmentedCourses.find(c => c.id === savedCourseId);
      if (pending) setSelectedCourse(pending as Course);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const handleSelect = (course: Course) => {
    if (course.seats_booked < course.max_seats) {
      setSelectedCourse(course);
      localStorage.setItem('vibe_pending_selection', course.id);

      // 2. Track: Select Item
      analytics.selectItem(course);
    }
  };

  const finalPaypalUrl = selectedCourse
    ? `${paypalUrl || "https://www.paypal.com/paypalme/leoblau"}/${selectedCourse.price}EUR`
    : paypalUrl || "https://www.paypal.com/paypalme/leoblau";

  const handleBookingInitiated = async () => {
    if (!selectedCourse || !preferredEmail || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Create a "Pending" record in Supabase
      // We pass this ID to PayPal as 'custom' so we can find the email later
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            batch_id: selectedCourse.id,
            preferred_email: preferredEmail,
            payment_status: 'pending',
            payment_amount: selectedCourse.price
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. Instead of redirecting to a generic link, we store the ID
      // This will trigger the rendering of the Smart Buttons below
      setBookingId(data.id);
      localStorage.setItem('vibe_last_booking_id', data.id);

      // 3. Track: Begin Checkout
      analytics.beginCheckout(selectedCourse, preferredEmail);

    } catch (err) {
      console.error('Booking pre-reg failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" ref={sectionRef} className="py-24 md:py-32 px-4 md:px-6 relative overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-pulse">
            <Sparkles size={12} />
            <span>Select Your Intake</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            Join the <span className="text-brand-light italic">Batch.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed italic">
            Pick a date. Secure your seat. Build your future.
          </p>
        </div>

        {/* Step 1: Course Selection */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center font-black text-lg md:text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">1</div>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Choose Your Intensive</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course) => {
              const seatsLeft = course.max_seats - course.seats_booked;
              const isFull = seatsLeft <= 0;
              const isActive = selectedCourse?.id === course.id;

              return (
                <div
                  key={course.id}
                  onClick={() => handleSelect(course)}
                  className={`group cursor-pointer p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[300px] md:min-h-[320px] ${isActive
                    ? 'bg-white text-black border-white scale-[1.05] shadow-[0_40px_100px_rgba(255,255,255,0.2)] z-20'
                    : isFull
                      ? 'bg-white/[0.02] border-white/5 opacity-30 cursor-not-allowed grayscale scale-[0.98]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:scale-[1.02]'
                    }`}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isActive ? 'text-black/40' : 'text-white/40'}`}>
                          {course.topic}
                        </div>
                        <div className="text-2xl md:text-3xl font-black tracking-tighter leading-none">{course.date}</div>
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border whitespace-nowrap leading-none ${isActive
                        ? 'border-black/10 text-black/60'
                        : isFull ? 'border-red-500/20 text-red-500/60 bg-red-500/10' : 'border-green-500/20 text-green-400 bg-green-500/5'
                        }`}>
                        {isFull ? 'Batch Full' : `${seatsLeft} Seats Left`}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className={isActive ? 'text-black/20' : 'text-white/20'} />
                        <div className="text-sm font-bold">{course.time_slots}</div>
                      </div>
                      <div className="flex items-center gap-3 text-xs opacity-60">
                        <ShieldCheck size={16} className={isActive ? 'text-black/20' : 'text-white/20'} />
                        <span>Post-Course Support Included</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-auto pt-6 border-t flex items-center justify-between font-black uppercase tracking-widest text-[10px] transition-all duration-500 ${isActive ? 'border-black/10 opacity-100 translate-y-0' : 'border-white/5 opacity-0 translate-y-2'
                    }`}>
                    <span>{isFull ? 'Sold Out' : 'Secure Selection'}</span>
                    <ArrowRight size={14} />
                  </div>

                  {isActive && !isFull && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-black animate-ping" />
                  )}
                  {isFull && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[5] pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Payment */}
        <div id="payment-zone" className={`transition-all duration-1000 transform ${!selectedCourse ? 'opacity-10 grayscale blur-sm pointer-events-none translate-y-8' : 'opacity-100 translate-y-0 scale-[1.02]'}`}>
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center font-black text-lg md:text-xl shadow-[0_0_30px_rgba(255,255,255,0.4)]">2</div>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Secure Your Spot</h3>
          </div>

          <div
            className="rounded-[3rem] md:rounded-[5rem] p-8 md:p-16 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(40px)' }}
          >
            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] blur-[100px] rounded-full -mr-64 -mt-64 pointer-events-none" />

            <div className="max-w-xl text-center lg:text-left relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 text-brand-light font-black text-[10px] uppercase tracking-[0.4em]">Investment</div>
              <div className="text-7xl md:text-9xl font-black mb-6 tracking-tighter">€{selectedCourse?.price || 333}</div>
              <p className="text-base md:text-xl text-white/40 leading-relaxed font-medium">
                Joining the <span className="text-white font-black underline decoration-white/20 underline-offset-8 italic">{selectedCourse?.topic}</span> batch <br className="hidden md:block" />
                starting <span className="text-white font-bold">{selectedCourse?.date}</span>.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col gap-6 relative z-10">
              {/* Email Capture */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">
                  Where should I send your materials?
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={preferredEmail}
                  onChange={(e) => setPreferredEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-medium"
                />
                <p className="text-[9px] text-white/20 italic ml-4">
                  I'll use this for your PDF Manual and intake details.
                </p>
              </div>

              {!bookingId ? (
                <button
                  onClick={handleBookingInitiated}
                  disabled={!preferredEmail || !preferredEmail.includes('@') || isSubmitting}
                  className={`group/btn bg-white text-black px-10 md:px-16 py-6 md:py-10 rounded-[2.5rem] md:rounded-[3.5rem] font-black text-xl md:text-3xl flex flex-col items-center justify-center gap-1 hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none ${isSubmitting ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#003087] italic">Pay</span><span className="text-[#009cde] italic">Pal</span>
                  </div>
                  <span className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] opacity-40 group-hover/btn:opacity-100 transition-opacity">
                    {isSubmitting ? 'Syncing Vibe...' : (!preferredEmail || !preferredEmail.includes('@') ? 'Enter Email First' : 'Secure Your Seat')}
                  </span>
                </button>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <PayPalButton
                    amount={selectedCourse?.price || 333}
                    bookingId={bookingId}
                    onSuccess={() => window.location.hash = 'success'}
                    onError={() => setBookingId(null)}
                  />
                  <button
                    onClick={() => setBookingId(null)}
                    className="w-full text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 mt-4 transition-colors"
                  >
                    Change Email / Payment Details
                  </button>
                </div>
              )}

              {/* Test Loop Controls (Developer Mode) */}
              <div className="flex items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
                <a href="#success" className="text-[8px] font-black uppercase tracking-widest text-white/10 hover:text-green-500 transition-colors">Test Success</a>
                <span className="text-white/5">•</span>
                <a href="#payment-issue" className="text-[8px] font-black uppercase tracking-widest text-white/10 hover:text-red-500 transition-colors">Test Error</a>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                  <ShieldCheck size={14} />
                  <span>SSL Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="w-10 h-10 rounded-full border border-black bg-white/10 backdrop-blur-sm shadow-xl flex items-center justify-center">
                  <UserPlus size={14} className="opacity-40" />
                </div>
              ))}
            </div>
            <p className="text-xs md:text-sm text-white/30 italic">
              "Join 47+ founders who have fast-tracked their shipping."
            </p>
          </div>

          {/* Vibe Test Dashboard (Visible only with ?test=true) */}
          {window.location.search.includes('test=true') && (
            <div className="mt-12 p-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 animate-pulse">
              <div className="flex items-center gap-3 mb-4 text-yellow-500/60 font-black uppercase text-[10px] tracking-widest">
                <Terminal size={14} />
                <span>Developer Vibe Tester</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.location.hash = 'success'}
                  className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase hover:bg-yellow-500/40 transition-all"
                >
                  Simulate Success UI
                </button>
                <div className="text-[10px] text-white/20 max-w-xs leading-relaxed">
                  Use the <b>PayPal Webhook Simulator</b> in your dashboard to test the real email flow.
                  Copy a <b>Booking ID</b> from Supabase first!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
