
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';

const MainLayout: React.FC = () => {
  return (
    <AIUtilsProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AIUtilsProvider>
  );
};

export default MainLayout;
