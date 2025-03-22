
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Home, Users, Upload, Settings, FileUp, Brain } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex">
        <AdminSidebar 
          links={[
            { to: "/admin/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
            { to: "/admin/users", label: "User Management", icon: <Users className="h-4 w-4" /> },
            { to: "/admin/content", label: "Content Uploader", icon: <Upload className="h-4 w-4" /> },
            { to: "/admin/content-analysis", label: "AI Content Analysis", icon: <Brain className="h-4 w-4" /> },
            { to: "/admin/file-uploader", label: "File Uploader", icon: <FileUp className="h-4 w-4" /> },
            { to: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
          ]}
          isOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="min-h-full pt-16 pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
