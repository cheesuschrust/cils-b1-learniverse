
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, Bell, LogOut, User, Settings, HomeIcon,
  Users, FileText, Upload, Cog, ShieldAlert, AlertTriangle, Database, Cpu,
  MessageSquareText, LayoutDashboard
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const AdminMobileNav = ({ onNavItemClick }: { onNavItemClick: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const userInitials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'A';
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 h-16 border-b">
        <div className="flex items-center">
          <ShieldAlert className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-bold">Admin Panel</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <nav className="flex-1 space-y-1">
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Dashboard
            </h3>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/dashboard" icon={HomeIcon}>Dashboard</SideNavItem>
            </div>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/users" icon={Users}>User Management</SideNavItem>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Content
            </h3>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/content" icon={FileText}>Content Uploader</SideNavItem>
            </div>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/content-analysis" icon={MessageSquareText}>Content Analysis</SideNavItem>
            </div>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/file-uploader" icon={Upload}>File Uploader</SideNavItem>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              System
            </h3>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/ai-management" icon={Cpu}>AI Management</SideNavItem>
            </div>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/settings" icon={Cog}>Settings</SideNavItem>
            </div>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/logs" icon={AlertTriangle}>System Logs</SideNavItem>
            </div>
            <div onClick={onNavItemClick}>
              <SideNavItem to="/admin/support-tickets" icon={MessageSquareText}>Support Tickets</SideNavItem>
            </div>
          </div>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar className="h-9 w-9 mr-2">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-medium">{user?.displayName || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button className="w-full" variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const userInitials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'A';
  
  return (
    <>
      <Helmet>
        <title>Admin Panel - Italian Learning</title>
      </Helmet>
      
      <div className="flex h-screen bg-background">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col border-r">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div className="flex items-center px-4 h-16">
              <NavLink to="/admin/dashboard" className="flex items-center">
                <ShieldAlert className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">Admin Panel</span>
              </NavLink>
            </div>
            
            <ScrollArea className="flex-1 px-3 py-6">
              <nav className="flex-1 space-y-1 px-2">
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Dashboard
                  </h3>
                  <SideNavItem to="/admin/dashboard" icon={LayoutDashboard}>Dashboard</SideNavItem>
                  <SideNavItem to="/admin/users" icon={Users}>User Management</SideNavItem>
                </div>
                
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Content
                  </h3>
                  <SideNavItem to="/admin/content" icon={FileText}>Content Uploader</SideNavItem>
                  <SideNavItem to="/admin/content-analysis" icon={MessageSquareText}>Content Analysis</SideNavItem>
                  <SideNavItem to="/admin/file-uploader" icon={Upload}>File Uploader</SideNavItem>
                </div>
                
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    System
                  </h3>
                  <SideNavItem to="/admin/ai-management" icon={Cpu}>AI Management</SideNavItem>
                  <SideNavItem to="/admin/settings" icon={Settings}>Settings</SideNavItem>
                  <SideNavItem to="/admin/logs" icon={AlertTriangle}>System Logs</SideNavItem>
                  <SideNavItem to="/admin/support-tickets" icon={MessageSquareText}>Support Tickets</SideNavItem>
                </div>
                
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    App Access
                  </h3>
                  <SideNavItem to="/app/dashboard" icon={HomeIcon}>Return to App</SideNavItem>
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
                          <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
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
                  <AdminMobileNav onNavItemClick={() => setIsMobileNavOpen(false)} />
                </SheetContent>
              </Sheet>
              
              <NavLink to="/admin/dashboard" className="flex items-center ml-3">
                <ShieldAlert className="h-6 w-6 text-primary mr-1" />
                <span className="text-lg font-bold">Admin</span>
              </NavLink>
            </div>
            
            <div className="flex items-center space-x-2">
              <AIStatus minimal={true} />
              
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/notifications')}>
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
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

export default AdminLayout;
