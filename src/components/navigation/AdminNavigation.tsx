
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  BrainCircuit,
  CreditCard,
  LifeBuoy,
  ActivitySquare,
  Upload,
  FolderKanban,
  FileSearch,
  Map,
} from 'lucide-react';

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    {
      group: 'Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: <Home className="h-5 w-5" />,
        },
        {
          name: 'Project Status',
          href: '/admin/project-status',
          icon: <Map className="h-5 w-5" />,
        },
        {
          name: 'Analytics',
          href: '/admin/analytics',
          icon: <BarChart3 className="h-5 w-5" />,
        },
      ],
    },
    {
      group: 'Content',
      items: [
        {
          name: 'Content Manager',
          href: '/admin/content',
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: 'Content Uploader',
          href: '/admin/content-upload',
          icon: <Upload className="h-5 w-5" />,
        },
        {
          name: 'Content Analysis',
          href: '/admin/content-analysis',
          icon: <FileSearch className="h-5 w-5" />,
        },
      ],
    },
    {
      group: 'Users',
      items: [
        {
          name: 'User Management',
          href: '/admin/users',
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: 'Support Tickets',
          href: '/admin/support-tickets',
          icon: <LifeBuoy className="h-5 w-5" />,
        },
        {
          name: 'Subscriptions',
          href: '/admin/subscriptions',
          icon: <CreditCard className="h-5 w-5" />,
        },
      ],
    },
    {
      group: 'System',
      items: [
        {
          name: 'AI Management',
          href: '/admin/ai-management',
          icon: <BrainCircuit className="h-5 w-5" />,
        },
        {
          name: 'System Health',
          href: '/admin/system-health',
          icon: <ActivitySquare className="h-5 w-5" />,
        },
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ];
  
  return (
    <nav className="space-y-6">
      {navItems.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4">
            {group.group}
          </h3>
          <ul className="space-y-1">
            {group.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default AdminNavigation;
