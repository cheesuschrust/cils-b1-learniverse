
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, 
  Book, 
  Settings, 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  Headphones, 
  Mic, 
  Calendar as CalendarIcon, 
  User,
  BarChart,
  Crown,
  Menu,
  X
} from 'lucide-react';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/app/dashboard",
      icon: Home
    },
    {
      name: "Flashcards",
      href: "/app/flashcards",
      icon: Book
    },
    {
      name: "Multiple Choice",
      href: "/app/multiple-choice",
      icon: FileText
    },
    {
      name: "Listening",
      href: "/app/listening",
      icon: Headphones
    },
    {
      name: "Speaking",
      href: "/app/speaking",
      icon: Mic
    },
    {
      name: "Writing",
      href: "/app/writing",
      icon: MessageSquare
    },
    {
      name: "Calendar",
      href: "/app/calendar",
      icon: CalendarIcon
    },
    {
      name: "Analytics",
      href: "/app/analytics",
      icon: BarChart
    },
    {
      name: "Profile",
      href: "/app/profile",
      icon: User
    },
    {
      name: "Settings",
      href: "/app/settings",
      icon: Settings
    },
    {
      name: "Support",
      href: "/app/support",
      icon: HelpCircle
    },
    {
      name: "Subscription",
      href: "/app/subscription",
      icon: Crown
    }
  ];

  // Desktop sidebar
  const desktopNavigation = (
    <div className="hidden md:flex flex-col w-64 border-r h-[calc(100vh-4rem)] bg-background">
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile menu (hamburger toggle)
  const mobileNavigation = (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <Link to="/app/dashboard" className="font-bold text-xl">
                CILS B1 Learniverse
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </ScrollArea>
            
            <div className="absolute bottom-6 left-6 right-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileNavigation}
      {desktopNavigation}
    </>
  );
};

export default MainNavigation;
