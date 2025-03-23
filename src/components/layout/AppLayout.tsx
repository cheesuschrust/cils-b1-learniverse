
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
