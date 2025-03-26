import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Menu, 
  X, 
  BookOpen, 
  Calendar, 
  Settings, 
  User, 
  BarChart2, 
  HelpCircle,
  MessageSquare,
  LayoutGrid,
  Globe,
  Mic,
  Bell
} from 'lucide-react';
import { AIStatus } from '@/components/ai/AIStatus';
import MainNavigation from '@/components/navigation/MainNavigation';
import Footer from '@/components/common/Footer';
import { useToast } from '@/components/ui/use-toast';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toast({
      title: "Theme toggled!",
      description: "Your selected theme has been applied.",
    });
  };

  return (
    <div className="flex h-screen bg-background antialiased">
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <Separator />
            <div className="flex-1 py-4">
              <MainNavigation closeMenu={closeMenu} />
            </div>
            <Footer />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden border-r bg-secondary w-60 flex-col md:flex">
        <div className="flex items-center border-b px-4 py-2">
          <Link to="/app/dashboard" className="flex items-center gap-2 font-bold">
            <LayoutGrid className="h-5 w-5" />
            Dashboard
          </Link>
          <span className="ml-auto text-sm">
            <AIStatus status="ready" />
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <MainNavigation />
        </div>
        <Footer />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-4">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
