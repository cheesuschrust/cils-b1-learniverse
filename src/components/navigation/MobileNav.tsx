
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon, BookOpenText, GraduationCap, Headphones, Pen, 
  CalendarDays, Users, LineChart, HelpCircle, User, Settings, LogOut
} from 'lucide-react';

interface MobileNavProps {
  onNavItemClick?: () => void;
}

export function MobileNav({ onNavItemClick }: MobileNavProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onNavItemClick?.();
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onNavItemClick?.();
  };
  
  const NavItem = ({ 
    to, 
    children, 
    icon: Icon 
  }: { 
    to: string; 
    children: React.ReactNode; 
    icon: React.ElementType 
  }) => (
    <NavLink 
      to={to} 
      onClick={onNavItemClick}
      className={({ isActive }) => 
        `flex items-center py-2 px-3 my-1 text-sm font-medium rounded-md ${
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`
      }
    >
      <Icon className="mr-2 h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  );
  
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 py-2">
        <div className="flex items-center">
          <BookOpenText className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">ItalianApp</span>
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6">
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Main
            </h3>
            <NavItem to="/app/dashboard" icon={HomeIcon}>Dashboard</NavItem>
            <NavItem to="/app/lessons" icon={GraduationCap}>Lessons</NavItem>
            <NavItem to="/app/calendar" icon={CalendarDays}>Calendar</NavItem>
          </div>
          
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Study Tools
            </h3>
            <NavItem to="/app/flashcards" icon={BookOpenText}>Flashcards</NavItem>
            <NavItem to="/app/multiple-choice" icon={BookOpenText}>Multiple Choice</NavItem>
            <NavItem to="/app/speaking" icon={Headphones}>Speaking Practice</NavItem>
            <NavItem to="/app/listening" icon={Headphones}>Listening Exercises</NavItem>
            <NavItem to="/app/writing" icon={Pen}>Writing Exercises</NavItem>
          </div>
          
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Community
            </h3>
            <NavItem to="/app/communities" icon={Users}>Communities</NavItem>
            <NavItem to="/app/progress" icon={LineChart}>Progress Tracker</NavItem>
          </div>
          
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Support
            </h3>
            <NavItem to="/app/support" icon={HelpCircle}>Help & Support</NavItem>
          </div>
        </div>
      </ScrollArea>
      
      <div className="mt-auto px-3 py-2">
        <Separator className="my-2" />
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => handleNavigation('/app/profile')}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => handleNavigation('/app/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
