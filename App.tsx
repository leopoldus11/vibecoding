
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import MacBookAudit from './components/MacBookAudit';
import CreatorStack from './components/CreatorStack';
import BookingSection from './components/BookingSection';
import TalkToLeopold from './components/TalkToLeopold';
import Footer from './components/Footer';
import MobileStickyFooter from './components/MobileStickyFooter';
import Privacy from './components/Privacy';
import Imprint from './components/Imprint';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentError from './components/PaymentError';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#home');

  useEffect(() => {
    // SEO & Global styling
    document.title = "AI VibeCoding Courses | Leopold Blau";

    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#home');
      // Scroll to top when path changes to a major view
      if (['#privacy', '#imprint', '#success', '#payment-issue'].includes(window.location.hash)) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Router based on Hash
  const renderContent = () => {
    if (currentPath === '#privacy') return <Privacy />;
    if (currentPath === '#imprint') return <Imprint />;
    if (currentPath === '#success') return <PaymentSuccess />;
    if (currentPath === '#payment-issue') return <PaymentError />;

    return (
      <>
        <Header />
        <main className="relative">
          <Hero />
          <Problem />
          <MacBookAudit />
          <CreatorStack />
          <BookingSection embedUrl={calComUrl} paypalUrl={paypalUrl} />
          <TalkToLeopold />
        </main>
        <Footer />
        <MobileStickyFooter />
      </>
    );
  };

  // Get URLs from environment variables
  const calComUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_CALCOM_URL : undefined;
  const paypalUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_PAYPAL_URL : undefined;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden transition-all duration-700">
      {renderContent()}
    </div>
  );
};

export default App;
