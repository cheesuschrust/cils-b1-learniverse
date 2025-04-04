
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from '@/components/theme-toggle';
import { NotificationCenter } from '@/components/ui/notification-center';
import { User, Settings, LogOut, Home, Award, BarChart4 } from 'lucide-react';
import { useGamificationContext } from '@/contexts/GamificationContext';
import XPPointsDisplay from '@/components/gamification/XPPointsDisplay';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { getCurrentXP } = useGamificationContext();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const getInitials = (name: string | null): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">CILS Prep</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link 
              to="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link 
              to="/daily-questions"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Daily Practice
            </Link>
            <Link 
              to="/progress"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Progress
            </Link>
            <Link 
              to="/achievements"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Achievements
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <XPPointsDisplay xp={getCurrentXP()} />
          </div>
          
          <NotificationCenter />
          <ModeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full"
                data-testid="user-menu-button"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || ''} />
                  <AvatarFallback>{getInitials(user?.display_name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.display_name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={() => navigate('/achievements')}
              >
                <Award className="mr-2 h-4 w-4" />
                <span>Achievements</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={() => navigate('/analytics')}
              >
                <BarChart4 className="mr-2 h-4 w-4" />
                <span>Statistics</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={() => navigate('/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
