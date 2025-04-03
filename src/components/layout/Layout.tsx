
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainNavigation from './MainNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigation />
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CILS Italian Citizenship Test Preparation Platform
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
