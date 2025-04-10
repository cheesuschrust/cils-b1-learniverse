
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Footer } from '@/components/common/Footer';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Sidebar for authenticated users */}
        <AppSidebar />
        
        <div className="flex flex-col flex-1">
          {/* App Header with user info, notifications, etc. */}
          <AppHeader />
          
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default RootLayout;
