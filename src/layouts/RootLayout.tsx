
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavigation from '@/components/navigation/MainNavigation';
import MobileNav from '@/components/navigation/MobileNav';
import { ScrollArea } from '@/components/ui/scroll-area';

const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex justify-between items-center h-16">
          <MainNavigation />
          <div className="block md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <ScrollArea className="h-full">
          <Outlet />
        </ScrollArea>
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CILS Italian Exam Prep. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
