
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  // Simple implementation for now
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
