
import React, { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Home, Users, Upload, Settings, FileUp, Brain, BarChart, MessageSquare } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = React.useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Memoize the links array to prevent re-renders
  const sidebarLinks = useMemo(() => [
    { to: "/admin/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { to: "/admin/users", label: "User Management", icon: <Users className="h-4 w-4" /> },
    { to: "/admin/file-uploader", label: "Content Uploader", icon: <Upload className="h-4 w-4" /> },
    { to: "/admin/content-analysis", label: "AI Content Analysis", icon: <Brain className="h-4 w-4" /> },
    { to: "/admin/logs", label: "System Logs", icon: <BarChart className="h-4 w-4" /> },
    { to: "/admin/tickets", label: "Support Tickets", icon: <MessageSquare className="h-4 w-4" /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ], []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex">
        <AdminSidebar 
          links={sidebarLinks}
          isOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-background pt-16">
          <div className="min-h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(AdminLayout);
