
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, FileText, Upload, Mail, Settings, 
  HelpCircle, BookOpen, Edit, ChevronRight, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

export interface AdminSidebarProps {
  isOpen?: boolean;
  links?: Array<{ to: string; label: string; icon: React.ReactNode }>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = true, links }) => {
  const { user, logout } = useAuth();
  
  // Default links if none provided
  const defaultLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { to: "/admin/content-analysis", label: "Content Analysis", icon: <FileText size={20} /> },
    { to: "/admin/file-uploader", label: "File Uploader", icon: <Upload size={20} /> },
    { to: "/admin/email-settings", label: "Email Settings", icon: <Mail size={20} /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
    { to: "/admin/support", label: "Support", icon: <HelpCircle size={20} /> },
    { to: "/admin/guide", label: "Admin Guide", icon: <BookOpen size={20} /> },
    { to: "/admin/questions/editor", label: "Question Editor", icon: <Edit size={20} /> },
  ];
  
  const navLinks = links || defaultLinks;
  
  const handleLogout = async () => {
    await logout();
  };

  if (!isOpen) {
    return (
      <div className="bg-secondary-900 w-[70px] min-h-screen flex flex-col items-center pt-6 pb-4">
        {/* Collapsed sidebar view */}
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `w-full flex justify-center py-3 mb-1 ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-primary/5"}`
            }
          >
            {link.icon}
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card border-r w-64 min-h-screen py-6 px-4 flex flex-col">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 mb-1 rounded-md transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <Separator className="my-4" />
      
      <div className="px-3 mb-2">
        {user && <p className="text-sm font-medium">{user.displayName || `${user.firstName} ${user.lastName}`}</p>}
        <p className="text-xs text-muted-foreground">
          {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
        </p>
      </div>
      
      <Button 
        variant="ghost" 
        className="flex w-full justify-start px-3" 
        onClick={handleLogout}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>
    </div>
  );
};

export default AdminSidebar;
