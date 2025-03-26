
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Library,
  Headphones,
  MessageSquare,
  Calendar,
  Settings,
  User,
  BarChart2,
  Users,
  HelpCircle,
  Menu,
  X,
  Activity,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MainNavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const navItems: MainNavigationItem[] = [
    {
      title: 'Dashboard',
      href: '/app/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Flashcards',
      href: '/app/flashcards',
      icon: <Library className="h-5 w-5" />,
    },
    {
      title: 'Multiple Choice',
      href: '/app/multiple-choice',
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: 'Lessons',
      href: '/app/lessons',
      icon: <Library className="h-5 w-5" />,
    },
    {
      title: 'Speaking Practice',
      href: '/app/speaking',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Listening Exercises',
      href: '/app/listening',
      icon: <Headphones className="h-5 w-5" />,
    },
    {
      title: 'Writing Exercises',
      href: '/app/writing',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Learning Calendar',
      href: '/app/calendar',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Progress Tracker',
      href: '/app/progress',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Communities',
      href: '/app/communities',
      icon: <Users className="h-5 w-5" />,
      disabled: true, // Disabled if feature is not ready
    },
    {
      title: 'Support',
      href: '/app/support',
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  const accountItems: MainNavigationItem[] = [
    {
      title: 'Profile',
      href: '/app/profile',
      icon: <User className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/app/settings',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      href: '/app/analytics',
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-muted-foreground">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 flex-col bg-background p-6 shadow-lg lg:static lg:flex lg:w-64 border-r lg:shadow-none",
        isOpen ? "flex" : "hidden lg:flex"
      )}>
        <div className="flex items-center justify-between lg:hidden">
          <div className="font-bold text-xl">Menu</div>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="mt-8 lg:mt-0 overflow-y-auto flex-1">
          <nav className="space-y-6">
            <div>
              <h3 className="px-3 text-xs font-medium uppercase text-muted-foreground mb-2">
                Learning
              </h3>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md group",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      item.disabled && "pointer-events-none opacity-50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                    {item.disabled && (
                      <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-3 text-xs font-medium uppercase text-muted-foreground mb-2">
                Account
              </h3>
              <div className="space-y-1">
                {accountItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md group",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {user?.isAdmin && (
          <div className="mt-auto pt-4 border-t">
            <Link
              to="/admin"
              className="flex items-center w-full px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span className="ml-3">Admin Panel</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MainNavigation;
