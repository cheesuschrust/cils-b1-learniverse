
import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  Home,
  BookOpen,
  Pencil,
  Mic,
  Headphones,
  FlaskConical,
  User,
  LogOut,
  Settings,
  Crown,
} from 'lucide-react';

const MainLayout = () => {
  const { user, profile, logout, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };
  
  const getInitials = () => {
    if (!profile) return 'U';
    
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    
    return (first + last).toUpperCase();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Reading', path: '/reading', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Writing', path: '/writing', icon: <Pencil className="h-5 w-5" /> },
    { name: 'Speaking', path: '/speaking', icon: <Mic className="h-5 w-5" /> },
    { name: 'Listening', path: '/listening', icon: <Headphones className="h-5 w-5" /> },
    { name: 'Flashcards', path: '/flashcards', icon: <FlaskConical className="h-5 w-5" /> },
  ];
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden p-0 w-12 h-12">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex items-center mb-8">
            <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <img src="/logo.svg" alt="CILS B2 Prep" className="h-8 w-auto" />
              <span className="font-bold text-xl">CILS B2 Prep</span>
            </Link>
          </div>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                asChild
                className="justify-start h-12"
                onClick={() => setOpen(false)}
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </Button>
            ))}
            
            {isPremium && (
              <Button
                variant={isActive('/premium') ? "secondary" : "ghost"}
                asChild
                className="justify-start h-12"
                onClick={() => setOpen(false)}
              >
                <Link to="/premium">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="ml-3">Premium Content</span>
                </Link>
              </Button>
            )}
            
            {!isPremium && (
              <Button
                variant="outline"
                asChild
                className="justify-start h-12 border-amber-500 text-amber-500"
                onClick={() => setOpen(false)}
              >
                <Link to="/subscription">
                  <Crown className="h-5 w-5" />
                  <span className="ml-3">Upgrade to Premium</span>
                </Link>
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:bg-card">
        <div className="flex items-center h-16 px-6 border-b">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="CILS B2 Prep" className="h-8 w-auto" />
            <span className="font-bold text-xl">CILS B2 Prep</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-6 px-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                asChild
                className="w-full justify-start h-12"
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </Button>
            ))}
            
            {isPremium && (
              <Button
                variant={isActive('/premium') ? "secondary" : "ghost"}
                asChild
                className="w-full justify-start h-12"
              >
                <Link to="/premium">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="ml-3">Premium Content</span>
                </Link>
              </Button>
            )}
          </div>
          
          {!isPremium && (
            <div className="mt-6">
              <Button
                variant="outline"
                asChild
                className="w-full justify-start h-12 border-amber-500 text-amber-500"
              >
                <Link to="/subscription">
                  <Crown className="h-5 w-5" />
                  <span className="ml-3">Upgrade to Premium</span>
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="h-16 border-b flex items-center px-6 justify-between">
          <div className="lg:hidden">
            <img src="/logo.svg" alt="CILS B2 Prep" className="h-8 w-auto" />
          </div>
          
          <div className="flex items-center ml-auto space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.display_name || user?.email || 'User'} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.display_name || `${profile?.first_name} ${profile?.last_name}` || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/subscription" className="cursor-pointer">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
