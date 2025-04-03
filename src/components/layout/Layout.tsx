
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavigation from '@/components/navigation/MainNavigation';
import { Toaster } from '@/components/ui/toaster';
import { ScrollArea } from '@/components/ui/scroll-area';
import MobileNav from '@/components/navigation/MobileNav';
import { useAuth } from '@/contexts/AuthContext';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

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
      
      <main className="flex-1 flex flex-col">
        <ScrollArea className="h-full">
          {children || <Outlet />}
        </ScrollArea>
      </main>
      
      <Toaster />
    </div>
  );
};

export default Layout;
