
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
  Bot,
  CreditCard,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      title: 'Content Upload',
      href: '/admin/content-upload',
      icon: <Upload className="h-5 w-5" />,
    },
    {
      title: 'Content Analysis',
      href: '/admin/content-analysis',
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: 'AI Management',
      href: '/admin/ai-management',
      icon: <Bot className="h-5 w-5" />,
    },
    {
      title: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Support Tickets',
      href: '/admin/support-tickets',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'System Health',
      href: '/admin/system-health',
      icon: <AlertCircle className="h-5 w-5" />,
    }
  ];

  return (
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => (
        <Link key={item.href} to={item.href}>
          <Button 
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            {item.icon}
            <span className="ml-3 flex-1">{item.title}</span>
            {item.beta && (
              <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                Beta
              </span>
            )}
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export default AdminNavigation;
