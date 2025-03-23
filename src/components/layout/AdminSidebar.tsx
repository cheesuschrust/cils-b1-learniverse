
import React from "react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Upload, 
  Sparkles, 
  MessageSquare,
  Mail,
  BarChart2,
  BookText,
  HelpCircle,
  ShieldAlert,
  BellRing,
  Package,
  GraduationCap
} from "lucide-react";

type AdminSidebarProps = {
  isOpen: boolean;
};

export const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const { user } = useAuth();
  
  const links = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      to: "/admin/users",
      label: "User Management",
      icon: <Users className="h-4 w-4" />,
    },
    {
      to: "/admin/content-uploader",
      label: "Content Uploader",
      icon: <Upload className="h-4 w-4" />,
    },
    {
      to: "/admin/content-analysis",
      label: "AI Content Analysis",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      to: "/admin/learning-materials",
      label: "Learning Materials",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      to: "/admin/support-tickets",
      label: "Support Tickets",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      to: "/admin/analytics",
      label: "Analytics",
      icon: <BarChart2 className="h-4 w-4" />,
    },
    {
      to: "/admin/email-settings",
      label: "Email Settings",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      to: "/admin/notifications",
      label: "Notifications",
      icon: <BellRing className="h-4 w-4" />,
    },
    {
      to: "/admin/admin-guide",
      label: "Admin Guide",
      icon: <BookText className="h-4 w-4" />,
    },
    {
      to: "/admin/system-logs",
      label: "System Logs",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      to: "/admin/security",
      label: "Security",
      icon: <ShieldAlert className="h-4 w-4" />,
    },
    {
      to: "/admin/subscription",
      label: "Subscription Plans",
      icon: <Package className="h-4 w-4" />,
    },
    {
      to: "/admin/settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      to: "/admin/help",
      label: "Help & Support",
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ];

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <aside 
      className={`fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-56 border-r bg-background overflow-y-auto transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
      }`}
    >
      <ScrollArea className="h-full py-4">
        <nav className="px-2">
          <ul className="space-y-1">
            {links.map((link, index) => (
              <li key={index}>
                {isOpen ? (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`
                    }
                    end={link.to === "/admin" || link.to === "/admin/dashboard"}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) =>
                            `flex items-center justify-center rounded-md py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`
                          }
                          end={link.to === "/admin" || link.to === "/admin/dashboard"}
                        >
                          {link.icon}
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {link.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default AdminSidebar;
