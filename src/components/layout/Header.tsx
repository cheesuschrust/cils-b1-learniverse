
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, UserCog, Award, Star, BarChart } from 'lucide-react';
import LevelBadge from '@/components/gamification/LevelBadge';
import StreakCounter from '@/components/gamification/StreakCounter';
import XpProgressBar from '@/components/gamification/XpProgressBar';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Learning App</Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/flashcards" className="hover:text-primary">Flashcards</Link>
          <Link to="/multiple-choice" className="hover:text-primary">Multiple Choice</Link>
          <Link to="/listening" className="hover:text-primary">Listening</Link>
          <Link to="/speaking" className="hover:text-primary">Speaking</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/achievements" className="flex items-center gap-1.5 hover:text-primary">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </Link>
                <Link to="/analytics" className="flex items-center gap-1.5 hover:text-primary">
                  <BarChart className="h-5 w-5" />
                  <span>Analytics</span>
                </Link>
              </div>
              
              <div className="hidden md:flex items-center gap-3 border-l pl-4">
                <StreakCounter showLabel={false} />
                <LevelBadge />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <div>My Account</div>
                      <XpProgressBar compact />
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/achievements">
                      <Award className="mr-2 h-4 w-4" />
                      <span>Achievements</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/analytics">
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>Learning Analytics</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/users">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
