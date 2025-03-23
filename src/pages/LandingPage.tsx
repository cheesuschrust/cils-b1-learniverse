
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CallToActionSection from '@/components/landing/CallToActionSection';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0a0a1a] to-[#171730]">
      <main className="flex-1">
        <section className="py-20 min-h-[80vh] flex items-center">
          <div className="container">
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl text-white">
                CILS B2 Cittadinanza
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                Prepare for your Italian citizenship language exam with our comprehensive learning platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <CallToActionSection />
      </main>
    </div>
  );
};

export default LandingPage;
