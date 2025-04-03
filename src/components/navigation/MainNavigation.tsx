
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  FileText,
  Settings,
  User,
  MessageSquare,
  Milestone,
  FlaskConical,
  Award,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationBell from '@/components/notifications/NotificationBell';
import GlobalNotificationCenter from '@/components/notifications/GlobalNotificationCenter';
import { useNotifications } from '@/contexts/NotificationsContext';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const routes = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/daily-question',
      label: 'Daily Question',
      icon: Calendar,
    },
    {
      href: '/practice',
      label: 'Practice',
      icon: FlaskConical,
    },
    {
      href: '/learning',
      label: 'Learn',
      icon: BookOpen,
    },
    {
      href: '/achievements',
      label: 'Achievements',
      icon: Award,
    },
    {
      href: '/progress',
      label: 'Progress',
      icon: Milestone,
    },
    {
      href: '/chat',
      label: 'Chat',
      icon: MessageSquare,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <NotificationBell onClick={() => setNotificationsOpen(true)} />
      </div>
      
      <GlobalNotificationCenter
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <nav className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "text-sm flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-accent",
                      location.pathname === route.href
                        ? "bg-accent font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

function Menu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default MainNavigation;
