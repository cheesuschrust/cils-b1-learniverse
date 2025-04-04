
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Book, 
  Headphones, 
  Pen, 
  Mic, 
  Award, 
  Home, 
  Menu, 
  X, 
  LogOut,
  User
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { href: '/flashcards', label: 'Flashcards', icon: <Book className="h-5 w-5" /> },
    { href: '/speaking', label: 'Speaking', icon: <Mic className="h-5 w-5" /> },
    { href: '/writing', label: 'Writing', icon: <Pen className="h-5 w-5" /> },
    { href: '/listening', label: 'Listening', icon: <Headphones className="h-5 w-5" /> },
    { 
      href: '/italian-citizenship-test', 
      label: 'Citizenship Test', 
      icon: <Award className="h-5 w-5" />,
      badge: 'B1'
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">ItalianMaster</h2>
                <Button variant="ghost" size="icon" onClick={closeMenu}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <nav className="flex-1 overflow-auto p-2">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground mb-1"
                  onClick={closeMenu}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </a>
              ))}
            </nav>
            
            <div className="p-4 mt-auto border-t">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.firstName || user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.isPremiumUser ? 'Premium Member' : 'Free Account'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button asChild className="w-full">
                    <a href="/login">Log In</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">ItalianMaster</h2>
            <p className="text-xs text-muted-foreground">CILS B1 Prep</p>
          </div>
          
          <nav className="flex-1 overflow-auto p-3 space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
                  location.pathname === item.href
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="outline" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </a>
            ))}
          </nav>
          
          <Separator />
          
          <div className="p-4">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.firstName || user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.isPremiumUser ? 'Premium Member' : 'Free Account'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <a href="/login">Log In</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/signup">Sign Up</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 w-full">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
