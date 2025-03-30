
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Users, FileText, BarChart3, Sparkles, Activity, Settings2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Admin navigation links
  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'User Management', href: '/admin/user-management', icon: Users },
    { name: 'Content Uploader', href: '/admin/content-uploader', icon: FileText },
    { name: 'AI Management', href: '/admin/ai-management', icon: Sparkles },
    { name: 'System Logs', href: '/admin/system-logs', icon: Activity },
    { name: 'System Settings', href: '/admin/system-settings', icon: Settings2 },
    { name: 'Database', href: '/admin/database', icon: Database },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Admin Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r">
        <div className="flex h-16 items-center px-4 border-b">
          <span className="font-semibold">Admin Dashboard</span>
        </div>
        <nav className="flex-1 overflow-auto py-6">
          <ul className="space-y-2 px-2">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                        isActive
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                          : ""
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full" onClick={() => navigate('/app/dashboard')}>
            Back to App
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="border-b bg-background z-10">
          <div className="h-16 px-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            
            {/* Title for mobile */}
            <div className="md:hidden font-bold text-lg">Admin Panel</div>
            
            {/* Right side items */}
            <div className="flex items-center space-x-4">
              <ModeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/app/dashboard')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Back to App</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default AdminLayout;
