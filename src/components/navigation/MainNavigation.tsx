
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import GlobalNotificationCenter from '@/components/notifications/GlobalNotificationCenter';
import {
  Home,
  BookOpen,
  BarChart3,
  User,
  Settings,
  Calendar
} from 'lucide-react';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  // Only show navigation items if user is logged in
  const navItems = user ? [
    { name: 'Home', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Daily Question', path: '/daily-question', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Flashcards', path: '/flashcards', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Progress', path: '/progress', icon: <BarChart3 className="h-5 w-5" /> },
  ] : [];

  return (
    <>
      <div className="flex-1 flex items-center space-x-4">
        <Link to={user ? '/dashboard' : '/'} className="text-lg font-bold flex items-center">
          <span>CILS Practice</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to={item.path} className="flex items-center space-x-2">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {user && (
        <div className="flex items-center gap-2">
          <NotificationBell 
            onClick={() => setNotificationCenterOpen(true)}
          />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      )}

      <GlobalNotificationCenter 
        open={notificationCenterOpen} 
        onOpenChange={setNotificationCenterOpen} 
      />
    </>
  );
};

export default MainNavigation;
