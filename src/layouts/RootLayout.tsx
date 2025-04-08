
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavigation from '@/components/navigation/MainNavigation';
import Footer from '@/components/layout/Footer';
import AIStatusIndicator from '@/components/ai/AIStatusIndicator';
import { LanguageToggle } from '@/components/language/LanguageToggle';
import { Flag } from 'lucide-react';

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <MainNavigation />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center border-r pr-3">
              <Flag className="h-4 w-4 mr-2 text-italian-green" />
              <LanguageToggle />
            </div>
            <AIStatusIndicator />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default RootLayout;
