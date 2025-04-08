
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Database,
  Bot,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  UploadCloud
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminNavigation: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'User Management', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Content Management', path: '/admin/content', icon: <FileText className="h-5 w-5" /> },
    { name: 'File Uploader', path: '/admin/file-uploader', icon: <UploadCloud className="h-5 w-5" /> },
    { name: 'AI Management', path: '/admin/ai-management', icon: <Bot className="h-5 w-5" /> },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'System Health', path: '/admin/system-health', icon: <ShieldAlert className="h-5 w-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          end={item.path === '/admin'}
        >
          <span className="mr-3">{item.icon}</span>
          {item.name}
        </NavLink>
      ))}
      
      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <a 
          href="https://docs.example.com/admin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-5 w-5 mr-3" />
          Admin Guide
        </a>
      </div>
    </nav>
  );
};

export default AdminNavigation;
