
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart2, 
  Layers, 
  Settings,
  MessageSquare,
  Brain,
  ChevronDown, 
  ChevronRight
} from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const [openContent, setOpenContent] = React.useState(true);
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };
  
  return (
    <div className="h-full py-6 space-y-4">
      <div className="px-3 mb-8">
        <h2 className="font-semibold text-lg mb-1">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your learning platform</p>
      </div>
      
      <div className="space-y-1 px-3">
        <NavItem 
          href="/admin" 
          label="Dashboard" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          isActive={location.pathname === '/admin'} 
        />
        
        <NavItem 
          href="/admin/users" 
          label="User Management" 
          icon={<Users className="h-5 w-5" />} 
          isActive={isActive('/admin/users')} 
        />
        
        <Collapsible open={openContent} onOpenChange={setOpenContent}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span>Content</span>
            </div>
            {openContent ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="ml-8 space-y-1 pt-1">
            <NavItem 
              href="/admin/content" 
              label="Manage Content" 
              icon={<Layers className="h-4 w-4" />} 
              isActive={isActive('/admin/content')} 
            />
            
            <NavItem 
              href="/admin/content-analysis" 
              label="AI Analysis" 
              icon={<Brain className="h-4 w-4" />} 
              isActive={isActive('/admin/content-analysis')} 
            />
          </CollapsibleContent>
        </Collapsible>
        
        <NavItem 
          href="/admin/logs" 
          label="System Logs" 
          icon={<BarChart2 className="h-5 w-5" />} 
          isActive={isActive('/admin/logs')} 
        />
        
        <NavItem 
          href="/admin/tickets" 
          label="Support Tickets" 
          icon={<MessageSquare className="h-5 w-5" />} 
          isActive={isActive('/admin/tickets')} 
        />
        
        <NavItem 
          href="/admin/settings" 
          label="System Settings" 
          icon={<Settings className="h-5 w-5" />} 
          isActive={isActive('/admin/settings')} 
        />
      </div>
    </div>
  );
};

export default AdminSidebar;
