
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import MacBookAudit from './components/MacBookAudit';
import CreatorStack from './components/CreatorStack';
import BookingSection from './components/BookingSection';
import TalkToLeopold from './components/TalkToLeopold';
import Footer from './components/Footer';
import Privacy from './components/Privacy';
import Imprint from './components/Imprint';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentError from './components/PaymentError';
import ConsentBanner from './components/ConsentBanner';
import { analytics } from './lib/analytics';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#home');

  useEffect(() => {
    // SEO & Global styling
    document.title = "AI VibeCoding Courses | Leopold Blau";
    analytics.pageView();

    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#home');
      if (['#privacy', '#imprint', '#success', '#payment-issue'].includes(window.location.hash)) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const calComUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_CALCOM_URL : undefined;
  const paypalUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_PAYPAL_URL : undefined;

  // Simple Router based on Hash
  const renderContent = () => {
    if (currentPath === '#privacy') return <Privacy />;
    if (currentPath === '#imprint') return <Imprint />;
    if (currentPath === '#success') return <PaymentSuccess />;
    if (currentPath === '#payment-issue') return <PaymentError />;

    return (
      <div className="h-[100dvh] w-full flex flex-col bg-[#050505] text-white">
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden snap-y snap-proximity scroll-smooth"
          onScroll={(e) => {
            const scrollPos = e.currentTarget.scrollTop;
            window.dispatchEvent(new CustomEvent('scroll-container', { detail: scrollPos }));
          }}
        >
          <div className="snap-start min-h-[100dvh] flex flex-col relative">
            <Header />
            <Hero />
          </div>
          <div className="snap-start min-h-[100dvh]">
            <Problem />
          </div>
          <div className="snap-start min-h-[100dvh]">
            <MacBookAudit />
          </div>
          <div className="snap-start min-h-[100dvh]">
            <CreatorStack />
          </div>
          <div className="snap-start min-h-[100dvh]">
            <BookingSection embedUrl={calComUrl} paypalUrl={paypalUrl} />
          </div>
          <div className="snap-start min-h-[100dvh]">
            <TalkToLeopold />
          </div>
          <div className="snap-start">
            <Footer />
          </div>
        </div>

        {/* Sticky Elements - Outside of the scrollable container */}
        <ConsentBanner />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden transition-all duration-700">
      {renderContent()}
    </div>
  );
};

export default App;
