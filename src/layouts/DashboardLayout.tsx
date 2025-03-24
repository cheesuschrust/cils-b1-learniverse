
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MobileNav } from '@/components/navigation/MobileNav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { 
  BookOpenText, GraduationCap, Menu, Bell, LogOut, User, Settings,
  HomeIcon, MessageSquareText, Headphones, Pen, CalendarDays, 
  Users, LineChart, HelpCircle, 
} from 'lucide-react';
import AIStatus from '@/components/ai/AIStatus';

const SideNavItem = ({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: any }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <NavLink 
      to={to} 
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
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { theme } = useUserPreferences();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const userInitials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';
  
  return (
    <>
      <Helmet>
        <title>Dashboard - Italian Learning</title>
      </Helmet>
      
      <div className="flex h-screen bg-background">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col border-r">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-16">
              <NavLink to="/app/dashboard" className="flex items-center">
                <BookOpenText className="h-7 w-7 text-primary mr-2" />
                <span className="text-xl font-bold">ItalianApp</span>
              </NavLink>
            </div>
            
            <ScrollArea className="flex-1 px-3 py-6">
              <nav className="flex-1 space-y-1 px-2 font-medium">
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Main
                  </h3>
                  <SideNavItem to="/app/dashboard" icon={HomeIcon}>Dashboard</SideNavItem>
                  <SideNavItem to="/app/lessons" icon={GraduationCap}>Lessons</SideNavItem>
                  <SideNavItem to="/app/calendar" icon={CalendarDays}>Calendar</SideNavItem>
                </div>
                
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Study Tools
                  </h3>
                  <SideNavItem to="/app/flashcards" icon={BookOpenText}>Flashcards</SideNavItem>
                  <SideNavItem to="/app/multiple-choice" icon={MessageSquareText}>Multiple Choice</SideNavItem>
                  <SideNavItem to="/app/speaking" icon={Headphones}>Speaking Practice</SideNavItem>
                  <SideNavItem to="/app/listening" icon={Headphones}>Listening Exercises</SideNavItem>
                  <SideNavItem to="/app/writing" icon={Pen}>Writing Exercises</SideNavItem>
                </div>
                
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Community
                  </h3>
                  <SideNavItem to="/app/communities" icon={Users}>Communities</SideNavItem>
                  <SideNavItem to="/app/progress" icon={LineChart}>Progress Tracker</SideNavItem>
                </div>
                
                <div>
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Support
                  </h3>
                  <SideNavItem to="/app/support" icon={HelpCircle}>Help & Support</SideNavItem>
                </div>
              </nav>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <AIStatus minimal={true} />
              </div>
            </div>
          </div>
        </aside>
        
        {/* Mobile navbar */}
        <div className="md:hidden border-b z-20 bg-background">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0" onCloseAutoFocus={() => setIsMobileNavOpen(false)}>
                  <MobileNav onNavItemClick={() => setIsMobileNavOpen(false)} />
                </SheetContent>
              </Sheet>
              
              <NavLink to="/app/dashboard" className="flex items-center ml-3">
                <BookOpenText className="h-6 w-6 text-primary mr-1" />
                <span className="text-lg font-bold">ItalianApp</span>
              </NavLink>
            </div>
            
            <div className="flex items-center space-x-2">
              <AIStatus minimal={true} />
              
              <Button variant="ghost" size="icon" onClick={() => navigate('/app/notifications')}>
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
