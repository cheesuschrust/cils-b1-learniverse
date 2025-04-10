
import React from 'react';
import { Outlet } from 'react-router-dom';
import MarketingNavbar from '@/components/layout/MarketingNavbar';
import { Footer } from '@/components/common/Footer';
import { Toaster } from '@/components/ui/toaster';
import CookieConsent from '@/components/common/CookieConsent';

const MarketingLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Marketing Navigation */}
      <MarketingNavbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default MarketingLayout;
