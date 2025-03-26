import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Menu, 
  X, 
  FileText, 
  BarChart2, 
  Settings, 
  Server, 
  AlertTriangle, 
  MessageSquare,
  Layers,
  Bell,
  Brain
} from 'lucide-react';
import { AIStatus } from '@/components/ai/AIStatus';
import AdminNavigation from '@/components/navigation/AdminNavigation';
import Footer from '@/components/common/Footer';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden absolute top-4 left-4 z-10 p-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar / Navigation */}
      <aside
        className={`bg-white dark:bg-gray-800 w-64 flex-shrink-0 p-4 space-y-6 md:block fixed md:sticky top-0 left-0 h-full md:z-0 z-20 transform md:translate-x-0 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center space-x-2 px-4">
          <Brain className="text-primary h-6 w-6" />
          <Link to="/admin/dashboard" className="text-lg font-semibold">
            Admin Dashboard
          </Link>
        </div>

        <AdminNavigation />

        <div className="mt-auto p-4">
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <AIStatus status="ready" />
            <NotificationBell />
          </div>
          <Footer />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:ml-64">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
