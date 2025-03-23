
import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex">
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 bg-background border-r`}>
          <AdminSidebar />
        </div>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="min-h-full pt-16 pb-12 px-4 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
