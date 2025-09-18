import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Mission from '@/components/Mission';
import Testimonials from '@/components/Testimonials';
import Referral from '@/components/Referral';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and ensure all components are ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="services">
          <HowItWorks />
          <Mission />
        </section>
        <Testimonials />
        <Referral />
        <section id="faq">
          <FAQ />
        </section>
        <section id="contact">
          <CTA />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
