
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavigation from '@/components/navigation/MainNavigation';
import Footer from '@/components/layout/Footer';
import AIStatusIndicator from '@/components/ai/AIStatusIndicator';

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigation />
      <div className="fixed top-20 right-4 z-50">
        <AIStatusIndicator />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
