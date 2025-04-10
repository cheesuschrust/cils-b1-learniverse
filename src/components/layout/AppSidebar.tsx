
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Book, 
  BarChart2, 
  User, 
  Settings, 
  MessageSquare, 
  BookOpen, 
  Award, 
  CircleUser
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isPremium = user?.isPremiumUser;
  
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/app/dashboard',
      icon: <Home className="h-5 w-5" />
    },
    {
      title: 'Flashcards',
      href: '/app/flashcards',
      icon: <Book className="h-5 w-5" />
    },
    {
      title: 'Practice',
      href: '/app/practice',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: 'Progress',
      href: '/app/progress',
      icon: <BarChart2 className="h-5 w-5" />
    },
    {
      title: 'Achievements',
      href: '/app/achievements',
      icon: <Award className="h-5 w-5" />
    },
    {
      title: 'AI Tutor',
      href: '/app/tutor',
      icon: <MessageSquare className="h-5 w-5" />,
      premium: true
    },
    {
      title: 'Profile',
      href: '/app/profile',
      icon: <CircleUser className="h-5 w-5" />
    },
    {
      title: 'Settings',
      href: '/app/settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  return (
    <nav className="hidden md:block w-64 border-r bg-background p-4 pt-0">
      {/* App Logo */}
      <div className="flex h-16 items-center border-b mb-4">
        <Link to="/app/dashboard" className="flex items-center">
          <span className="text-xl font-bold">CILS<span className="text-primary">B1</span></span>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <div className="space-y-1">
        {menuItems.map((item) => {
          // Skip premium features if user is not premium
          if (item.premium && !isPremium) return null;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
              {item.premium && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                  PRO
                </span>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Upgrade Banner (Only for non-premium users) */}
      {!isPremium && (
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get unlimited access to all premium features and enhance your learning experience.
          </p>
          <Link 
            to="/pricing" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block text-sm px-3 py-2 rounded-md w-full text-center"
          >
            View Plans
          </Link>
        </div>
      )}
    </nav>
  );
};

export default AppSidebar;
