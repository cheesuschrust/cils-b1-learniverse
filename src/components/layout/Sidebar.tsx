
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  User, 
  Settings, 
  HelpCircle, 
  Award, 
  BarChart, 
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Learning', path: '/dashboard/learning', icon: BookOpen },
    { name: 'Progress', path: '/dashboard/progress', icon: BarChart },
    { name: 'Practice Tests', path: '/dashboard/tests', icon: Award },
    { name: 'Community', path: '/dashboard/community', icon: MessageSquare },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Help', path: '/dashboard/help', icon: HelpCircle },
  ];

  return (
    <aside className={cn("h-screen flex flex-col border-r bg-background", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">CILS B1</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Trial expires in 14 days</p>
            <p className="text-xs font-medium text-foreground">Upgrade to Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
