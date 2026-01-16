
import React, { useEffect, useState } from 'react';
import { Clock, ShieldCheck, ArrowRight, UserPlus, Sparkles, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PayPalButton from './PayPalButton';
import { analytics } from '../lib/analytics';

interface Course {
  id: string;
  topic: string;
  date: string;
  time_slots: string;
  sessions: { start: string; end: string }[];
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

// Helper to format date: "January 20 & January 21" -> "January 20 & 21"
const formatDay = (d: string) => {
  if (typeof d !== 'string') return '';
  const parts = d.split(' & ');
  if (parts.length === 2) {
    const firstPart = parts[0].split(' ');
    const secondPart = parts[1].split(' ');
    if (firstPart[0] && secondPart[0] && firstPart[0] === secondPart[0]) {
      return `${parts[0]} & ${secondPart[1]}`;
    }
  }
  return d;
};

const BookingSection: React.FC<BookingSectionProps> = ({ embedUrl, paypalUrl }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [preferredEmail, setPreferredEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [lockExpiry, setLockExpiry] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const sectionRef = React.useRef<HTMLElement>(null);

  // Countdown timer for seat lock
  useEffect(() => {
    if (!lockExpiry) return;

    const interval = setInterval(() => {
      const remaining = lockExpiry.getTime() - Date.now();
      if (remaining <= 0) {
        setTimeRemaining('Expired');
        setBookingId(null);
        setLockExpiry(null);
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeRemaining(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiry]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isTestMode = window.location.search.includes('test=true');

        // 1. Fetch batches from Supabase
        let query = supabase
          .from('batches')
          .select('*')
          .eq('is_active', true);

        if (!isTestMode) {
          query = query.neq('id', 'batch-test');
        }

        const { data: batchesData, error: batchesError } = await query;

        if (batchesError) throw batchesError;

        // 2. Fetch seat counts
        let seatCounts: Record<string, number> = {};

        try {
          const { data: availData, error: availError } = await supabase
            .from('batch_availability')
            .select('batch_id, seats_taken');

          if (!availError && availData) {
            availData.forEach((item: any) => {
              seatCounts[item.batch_id] = item.seats_taken;
            });
          }
        } catch {
          // Fallback: count completed bookings only
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select('batch_id, payment_status')
            .eq('payment_status', 'completed');

          if (bookingsData) {
            bookingsData.forEach((booking: any) => {
              seatCounts[booking.batch_id] = (seatCounts[booking.batch_id] || 0) + 1;
            });
          }
        }

        // 3. Augment courses with seats_booked
        const augmentedCourses = (batchesData || []).map((batch: any) => ({
          ...batch,
          seats_booked: seatCounts[batch.id] || 0
        }));

        setCourses(augmentedCourses as Course[]);

        // Visibility-based Tracking
        if (sectionRef.current && augmentedCourses.length > 0) {
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              analytics.viewItemList(augmentedCourses);
              observer.disconnect();
            }
          }, { threshold: 0.1 });
          observer.observe(sectionRef.current);
        }

        // Persistence
        const savedCourseId = localStorage.getItem('vibe_pending_selection');
        if (savedCourseId && window.location.hash !== '#success') {
          const pending = augmentedCourses.find((c: any) => c.id === savedCourseId);
          if (pending) setSelectedCourse(pending as Course);
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (course: Course) => {
    if (course.seats_booked < course.max_seats) {
      setSelectedCourse(course);
      localStorage.setItem('vibe_pending_selection', course.id);
      analytics.selectItem(course);
    }
  };

  const handleBookingInitiated = async () => {
    if (!selectedCourse || !preferredEmail || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const seatsLeft = selectedCourse.max_seats - selectedCourse.seats_booked;
      if (seatsLeft <= 0) {
        alert('Sorry, this batch just filled up! Please select another date.');
        window.location.reload();
        return;
      }

      const lockExpiryTime = new Date(Date.now() + 10 * 60 * 1000); 

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            batch_id: selectedCourse.id,
            preferred_email: preferredEmail,
            payment_status: 'pending',
            payment_amount: selectedCourse.price,
            seat_locked_at: new Date().toISOString(),
            seat_lock_expires_at: lockExpiryTime.toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
      setLockExpiry(lockExpiryTime);
      localStorage.setItem('vibe_last_booking_id', data.id);
      analytics.beginCheckout(selectedCourse, preferredEmail);

    } catch (err: any) {
      console.error('❌ Booking pre-reg failed:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      });
      
      const errorMessage = err.message || 'Failed to reserve seat. Please try again.';
      alert(`Booking Error: ${errorMessage}\n\nCheck console for details (F12)`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" ref={sectionRef} className="py-24 md:py-40 px-4 md:px-6 relative overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center space-x-2 md:space-x-3 bg-white/[0.03] text-white/90 px-4 py-2.5 md:px-6 md:py-3 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,240,255,0.05)] backdrop-blur-xl group hover:scale-105 transition-all duration-500 hover:border-[#00F0FF]/30 mb-10">
            <div className="relative">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
              <div className="absolute inset-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00F0FF] animate-ping opacity-30" />
            </div>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-2 whitespace-nowrap">
              Select Your <span className="text-[#00F0FF]">Intake</span>
              <Sparkles size={12} className="text-[#00F0FF] opacity-50 animate-pulse" />
            </span>
            <div className="h-4 w-px bg-white/10" />
            <Zap size={14} className="text-[#00F0FF] fill-[#00F0FF] group-hover:rotate-12 transition-transform shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
          </div>
          <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-6 leading-[0.85] uppercase italic text-white">
            Join the <br className="hidden md:block" />
            <span className="text-white/40 not-italic">Batch.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed italic mt-8 px-4">
            Pick a date. Secure your seat. <br className="sm:hidden" />
            <span className="text-white whitespace-nowrap">Build your future.</span>
          </p>
        </div>

        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#00F0FF] text-black flex items-center justify-center font-black text-lg md:text-xl shadow-[0_0_30px_rgba(0,240,255,0.4)]">1</div>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">Choose Your Intensive</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-white">
            {courses.map((course) => {
              const seatsLeft = course.max_seats - course.seats_booked;
              const isFull = seatsLeft <= 0;
              const isActive = selectedCourse?.id === course.id;

              return (
                <div
                  key={course.id}
                  onClick={() => handleSelect(course)}
                  className={`group cursor-pointer p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px] md:min-h-[350px] ${isActive
                    ? 'bg-white text-black border-white scale-[1.05] shadow-[0_40px_100px_rgba(0,240,255,0.15)] z-20'
                    : isFull
                      ? 'bg-white/[0.02] border-white/5 opacity-30 cursor-not-allowed grayscale scale-[0.98]'
                      : 'bg-white/5 border-white/10 hover:border-[#00F0FF]/30 hover:scale-[1.02]'
                    }`}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isActive ? 'text-black/40' : 'text-white/40'}`}>
                          {course.topic}
                        </div>
                        <div className="text-3xl md:text-4xl font-black tracking-tighter leading-none italic uppercase">{formatDay(course.date)}</div>
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border whitespace-nowrap leading-none ${isActive
                        ? 'border-black/10 text-black/60'
                        : isFull ? 'border-red-500/20 text-red-500/60 bg-red-500/10' : 'border-[#00F0FF]/20 text-[#00F0FF] bg-[#00F0FF]/5'
                        }`}>
                        {isFull ? 'Batch Full' : `${seatsLeft} Seats Left`}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className={isActive ? 'text-black/20' : 'text-[#00F0FF]/40'} />
                        <div className="text-sm font-bold">{course.time_slots}</div>
                      </div>
                      <div className="flex items-center gap-3 text-xs opacity-60 font-medium">
                        <ShieldCheck size={16} className={isActive ? 'text-black/20' : 'text-[#00F0FF]/40'} />
                        <span>Post-Course Support Included</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-auto pt-6 border-t flex items-center justify-between font-black uppercase tracking-widest text-[10px] transition-all duration-500 ${isActive ? 'border-black/10 opacity-100 translate-y-0' : 'border-white/5 opacity-0 translate-y-2'
                    }`}>
                    <span>{isFull ? 'Sold Out' : 'Secure Selection'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>

                  {isActive && !isFull && (
                    <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                  )}
                  {isFull && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[5] pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div id="payment-zone" className={`transition-all duration-1000 transform ${!selectedCourse ? 'opacity-10 grayscale blur-sm pointer-events-none translate-y-8' : 'opacity-100 translate-y-0 scale-[1.02]'}`}>
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#00F0FF] text-black flex items-center justify-center font-black text-lg md:text-xl shadow-[0_0_30px_rgba(0,240,255,0.4)]">2</div>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">Secure Your Spot</h3>
          </div>

          <div
            className="rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(40px)' }}
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00F0FF]/[0.05] blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

            <div className="max-w-xl text-center lg:text-left relative z-10 text-white">
              <div className="inline-flex items-center gap-2 mb-8 text-[#00F0FF] font-black text-[10px] uppercase tracking-[0.4em]">Investment</div>
              <div className="text-8xl md:text-[10rem] font-black mb-8 tracking-tighter leading-none italic uppercase">€{selectedCourse?.price || 333}</div>
              <p className="text-lg md:text-2xl text-white/40 leading-relaxed font-medium italic">
                Joining the <span className="text-white font-black underline decoration-[#00F0FF]/30 underline-offset-8 italic">{selectedCourse?.topic}</span> batch <br className="hidden md:block" />
                starting <span className="text-white font-bold">{selectedCourse?.date}</span>.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col gap-8 relative z-10">
              <div className="flex flex-col gap-4 text-white">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">
                  Materials Delivery Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={preferredEmail}
                  onChange={(e) => setPreferredEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#00F0FF]/30 transition-all font-medium text-lg"
                />
                <p className="text-[10px] text-white/20 italic ml-4">
                  This address receives your PDF Manual and intake access.
                </p>
              </div>

              {!bookingId ? (
                <button
                  onClick={handleBookingInitiated}
                  disabled={!preferredEmail || !preferredEmail.includes('@') || isSubmitting}
                  className={`group/btn bg-white text-black px-12 md:px-20 py-8 md:py-12 rounded-[2.5rem] md:rounded-[3.5rem] font-black text-2xl md:text-4xl flex flex-col items-center justify-center gap-2 hover:shadow-[0_20px_80px_rgba(0,240,255,0.2)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none ${isSubmitting ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#003087] italic">Pay</span><span className="text-[#009cde] italic">Pal</span>
                  </div>
                  <span className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] opacity-40 group-hover/btn:opacity-100 transition-opacity">
                    {isSubmitting ? 'Syncing Vibe...' : (!preferredEmail || !preferredEmail.includes('@') ? 'Enter Email First' : 'Secure Your Seat')}
                  </span>
                </button>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <PayPalButton
                    amount={selectedCourse?.price || 333}
                    bookingId={bookingId}
                    onSuccess={() => window.location.hash = 'success'}
                    onError={() => { setBookingId(null); setLockExpiry(null); }}
                  />
                  {timeRemaining && timeRemaining !== 'Expired' && (
                    <div className="text-center text-sm text-[#00F0FF] mt-6 py-4 px-6 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 font-bold uppercase tracking-widest animate-pulse">
                      Seat reserved for: {timeRemaining}
                    </div>
                  )}
                  {timeRemaining === 'Expired' && (
                    <div className="text-center text-xs text-red-400 mt-3 py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      Reservation expired. Please try again.
                    </div>
                  )}
                  <button
                    onClick={() => { setBookingId(null); setLockExpiry(null); setTimeRemaining(''); }}
                    className="w-full text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#00F0FF] mt-6 transition-colors"
                  >
                    Change Selection / Email
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                  <ShieldCheck size={14} className="text-[#00F0FF]/40" />
                  <span>SSL Encrypted Checkout Protocol</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left text-white/30">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="w-10 h-10 rounded-full border border-black bg-white/10 backdrop-blur-sm shadow-xl flex items-center justify-center">
                  <UserPlus size={14} className="opacity-40" />
                </div>
              ))}
            </div>
            <p className="text-xs md:text-sm italic">
              "Join 47+ founders who have fast-tracked their shipping."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
