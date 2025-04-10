import React from "react";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  Users,
  Activity,
  MessageSquare,
  FileText,
  Image,
  Video,
  Music,
  ListChecks,
  BarChart,
  Lock,
  Shield,
  ServerCog,
  Mail,
  Bell,
  BookOpenCheck,
  BrainCircuit,
  PuzzlePiece,
  Network,
  Layers,
  GitFork,
  Download,
  Info,
  Volume2
} from "lucide-react";
import { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
    },
    {
      title: "AI Models",
      href: "/admin/ai-models",
      icon: <BrainCircuit className="h-5 w-5" />,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      title: "AI Architecture",
      href: "/admin/ai-architecture",
      icon: <PuzzlePiece className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "AI Training",
      href: "/admin/ai-training",
      icon: <Network className="h-5 w-5" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "AI Settings",
      href: "/admin/ai-settings",
      icon: <Layers className="h-5 w-5" />,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      title: "Content Management",
      href: "/admin/content-management",
      icon: <FileText className="h-5 w-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "User Management",
      href: "/admin/user-management",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Activity Logs",
      href: "/admin/activity-logs",
      icon: <Activity className="h-5 w-5" />,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      title: "Feedback & Support",
      href: "/admin/feedback-support",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Image Analysis",
      href: "/admin/image-analysis",
      icon: <Image className="h-5 w-5" />,
      color: "text-fuchsia-500",
      bgColor: "bg-fuchsia-500/10",
    },
    {
      title: "Video Processing",
      href: "/admin/video-processing",
      icon: <Video className="h-5 w-5" />,
      color: "text-lime-500",
      bgColor: "bg-lime-500/10",
    },
    {
      title: "Audio Analysis",
      href: "/admin/audio-analysis",
      icon: <Music className="h-5 w-5" />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Database Performance",
      href: "/admin/database-performance",
      icon: <BarChart className="h-5 w-5" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Security Settings",
      href: "/admin/security-settings",
      icon: <Lock className="h-5 w-5" />,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
    },
    {
      title: "System Status",
      href: "/admin/system-status",
      icon: <ServerCog className="h-5 w-5" />,
      color: "text-zinc-500",
      bgColor: "bg-zinc-500/10",
    },
    {
      title: "Email Configuration",
      href: "/admin/email-configuration",
      icon: <Mail className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Notification Rules",
      href: "/admin/notification-rules",
      icon: <Bell className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Content Validation",
      href: "/admin/content-validation",
      icon: <BookOpenCheck className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Voice System",
      href: "/admin/voice-system",
      icon: <Volume2 className="h-5 w-5" />,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className={cn("flex flex-col space-y-4 w-64 border-r py-4", className)}>
      <div className="px-3 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src={user?.avatarUrl || ""} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium leading-none">{user?.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount className="w-60">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            icon={item.icon}
            title={item.title}
            color={item.color}
            bgColor={item.bgColor}
          />
        ))}
      </div>
      <div className="mt-auto px-3 py-2">
        <Button variant="outline" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Support
        </Button>
      </div>
    </div>
  );
};

interface LinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  bgColor: string;
}

const Link: React.FC<LinkProps> = ({ href, icon, title, color, bgColor }) => {
  const navigate = useNavigate();
  const isActive = (pathname: string) => pathname === href;

  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start px-3 py-2",
        isActive(window.location.pathname)
          ? "font-semibold"
          : "text-muted-foreground hover:text-foreground",
        isActive(window.location.pathname) ? color : "",
        isActive(window.location.pathname) ? bgColor : ""
      )}
      onClick={() => navigate(href)}
    >
      {icon}
      <span>{title}</span>
    </Button>
  );
};

export default AdminSidebar;
