
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, Settings, BookOpen, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function SiteHeader() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get user's initials for the avatar
  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">CILS B1 Prep</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link to="/" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/about" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          ) : isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.id.substring(0, 8)}...
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/study')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Study Materials</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                  Home
                </Link>
                <Link to="/about" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                  About
                </Link>
                <Link to="/contact" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                  Contact
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                      Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                      Settings
                    </Link>
                    <Button variant="ghost" onClick={() => {
                      handleLogout();
                      setSheetOpen(false);
                    }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <Link to="/auth/login" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                      Login
                    </Link>
                    <Link to="/auth/register" onClick={() => setSheetOpen(false)} className="text-lg font-medium">
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
