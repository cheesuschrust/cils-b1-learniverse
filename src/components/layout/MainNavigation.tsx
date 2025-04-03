
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  BookOpen,
  Home,
  LogOut,
  Menu,
  Mic,
  PenLine,
  Settings,
  User,
  X,
  BookOpenCheck,
  Trophy,
  Zap,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { Headphones } from '@/components/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const MainNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return '?';
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user.firstName) {
      return user.firstName[0].toUpperCase() + (user.lastName ? user.lastName[0].toUpperCase() : '');
    }
    return user.email[0].toUpperCase();
  };
  
  // Nav items configuration
  const navItems = [
    { label: 'Home', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
    { label: 'Daily Question', href: '/daily-question', icon: <Zap className="h-4 w-4" /> },
    { label: 'Reading', href: '/reading', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Writing', href: '/writing', icon: <PenLine className="h-4 w-4" /> },
    { label: 'Speaking', href: '/speaking', icon: <Mic className="h-4 w-4" /> },
    { label: 'Listening', href: '/listening', icon: <Headphones className="h-4 w-4" /> },
    { label: 'Flashcards', href: '/flashcards', icon: <BookOpenCheck className="h-4 w-4" /> },
    { label: 'Progress', href: '/progress', icon: <Trophy className="h-4 w-4" /> },
  ];
  
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden md:inline">CILS B1 Prep</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.firstName || 'User'} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || user.firstName || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full flex">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/achievements" className="cursor-pointer w-full flex">
                        <Trophy className="mr-2 h-4 w-4" />
                        <span>Achievements</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/calendar" className="cursor-pointer w-full flex">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Calendar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer w-full flex">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help" className="cursor-pointer w-full flex">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Help</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Toggle menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-sm">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      CILS B1 Prep
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-muted"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
