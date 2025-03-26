
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Database,
  MessageSquare,
  Upload,
  AlertCircle,
  Box,
  Brain,
  Tags,
  Store,
  Building,
  MessageSquareText,
  AppWindow,
  Search
} from 'lucide-react';

export interface AdminNavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  beta?: boolean;
}

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems: AdminNavigationItem[] = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Content Management',
      href: '/admin/content',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Content Analysis',
      href: '/admin/content-analysis',
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: 'AI Management',
      href: '/admin/ai-management',
      icon: <Brain className="h-5 w-5" />,
    },
    {
      title: 'System Tests',
      href: '/admin/system-tests',
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      title: 'System Logs',
      href: '/admin/logs',
      icon: <Database className="h-5 w-5" />,
    },
    {
      title: 'Support Tickets',
      href: '/admin/support-tickets',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'File Uploader',
      href: '/admin/file-uploader',
      icon: <Upload className="h-5 w-5" />,
    },
    {
      title: 'Analytics Dashboard',
      href: '/admin/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      beta: true,
    },
    {
      title: 'Email Configuration',
      href: '/admin/email-config',
      icon: <MessageSquareText className="h-5 w-5" />,
    },
    {
      title: 'Institutional Licensing',
      href: '/admin/institutional-licensing',
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: 'Ad Management',
      href: '/admin/ad-management',
      icon: <Tags className="h-5 w-5" />,
    },
    {
      title: 'Chatbot Management',
      href: '/admin/chatbot-management',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'App Store Listing',
      href: '/admin/app-store-listing',
      icon: <AppWindow className="h-5 w-5" />,
    },
    {
      title: 'E-commerce Integration',
      href: '/admin/ecommerce',
      icon: <Store className="h-5 w-5" />,
      beta: true,
    },
    {
      title: 'SEO Management',
      href: '/admin/seo',
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`flex items-center px-3 py-2 text-sm rounded-md group ${
            isActive(item.href)
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {item.icon}
          <span className="ml-3 flex-1">{item.title}</span>
          {item.beta && (
            <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
              Beta
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default AdminNavigation;
