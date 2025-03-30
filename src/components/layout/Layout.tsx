
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '@/components/ui/toaster';
import DataWizard from '@/components/DataWizard';
import DatabaseOptimizer from '@/components/DatabaseOptimizer';
import DataMagic from '@/components/DataMagic';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      
      <Footer />
      <Toaster />
      <DataWizard />
      <DatabaseOptimizer />
      <DataMagic />
    </div>
  );
};

export default Layout;
