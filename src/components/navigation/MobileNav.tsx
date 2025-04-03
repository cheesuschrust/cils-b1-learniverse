
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  BookOpen,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  Calendar
} from 'lucide-react';

const MobileNav: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Navigation items
  const navItems = [
    { name: 'Home', path: user ? '/dashboard' : '/', icon: <Home className="h-5 w-5 mr-2" /> },
    { name: 'Daily Question', path: '/daily-question', icon: <Calendar className="h-5 w-5 mr-2" /> },
    { name: 'Flashcards', path: '/flashcards', icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { name: 'Progress', path: '/progress', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 py-4">
            {user ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || ""} alt={user.email || "User"} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.isPremiumUser ? "Premium User" : "Free User"}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/auth?signup=true" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          <Separator />
          
          <nav className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <SheetClose key={item.path} asChild>
                <Link 
                  to={item.path}
                  className="flex items-center px-2 py-3 text-sm rounded-md hover:bg-accent"
                >
                  {item.icon}
                  {item.name}
                </Link>
              </SheetClose>
            ))}
          </nav>
          
          <Separator />
          
          {user && (
            <div className="flex flex-col gap-1 py-4 mt-auto">
              <SheetClose asChild>
                <Link 
                  to="/profile" 
                  className="flex items-center px-2 py-3 text-sm rounded-md hover:bg-accent"
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  to="/settings" 
                  className="flex items-center px-2 py-3 text-sm rounded-md hover:bg-accent"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Link>
              </SheetClose>
              <Button 
                variant="ghost" 
                className="justify-start px-2 mt-2"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Log out
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
