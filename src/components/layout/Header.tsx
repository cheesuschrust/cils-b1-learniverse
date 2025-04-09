
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import {
  User,
  LogOut,
  BookOpen,
  Settings,
  Home,
  Award,
  BarChart,
  Menu,
  X,
  FileText,
  Headphones,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Extract first name from email (or use a fallback)
  const firstName = user?.email?.split('@')[0] || 'User';
  const userInitial = firstName.charAt(0).toUpperCase();

  // Main navigation items
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart, authRequired: true },
    { name: 'Flashcards', path: '/flashcards', icon: BookOpen, authRequired: true },
    { name: 'Reading', path: '/reading', icon: FileText, authRequired: true },
    { name: 'Listening', path: '/listening', icon: Headphones, authRequired: true },
    { name: 'Speaking', path: '/speaking', icon: MessageSquare, authRequired: true },
    { name: 'Mock Exams', path: '/exams', icon: AlertCircle, authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="hidden font-bold text-xl sm:inline-block">CILS B1 Prep</span>
            <span className="font-bold text-xl sm:hidden">CILS</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              (!item.authRequired || isAuthenticated) && (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center transition-colors hover:text-foreground/80 ${
                    location.pathname === item.path ? 'text-primary font-medium' : 'text-foreground/60'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              )
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
          ) : isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={firstName} />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{firstName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/flashcards')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Study Materials
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">Get Started</Link>
                </Button>
              </div>
              <div className="sm:hidden">
                <Button asChild>
                  <Link to="/auth/login">Sign in</Link>
                </Button>
              </div>
            </>
          )}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-2">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <span className="font-bold text-xl">CILS B1 Prep</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    (!item.authRequired || isAuthenticated) && (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center py-2 px-3 rounded-md ${
                          location.pathname === item.path 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    )
                  ))}
                </nav>
                
                {isAuthenticated && (
                  <>
                    <div className="mt-4 border-t pt-4">
                      <Link
                        to="/profile"
                        className="flex items-center py-2 px-3 rounded-md hover:bg-muted"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center py-2 px-3 rounded-md hover:bg-muted"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="mt-auto border-t pt-4">
                      <button
                        className="flex w-full items-center py-2 px-3 rounded-md text-destructive hover:bg-muted"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
                
                {!isAuthenticated && (
                  <div className="mt-auto border-t pt-4 flex flex-col gap-2">
                    <Button asChild variant="outline" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      <Link to="/auth/login">
                        <User className="h-5 w-5 mr-3" />
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      <Link to="/auth/register">
                        <User className="h-5 w-5 mr-3" />
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
