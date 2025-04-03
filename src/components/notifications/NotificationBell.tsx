
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import GlobalNotificationCenter from './GlobalNotificationCenter';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  className?: string;
  variant?: 'default' | 'nav';
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  className,
  variant = 'default'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();
  
  return (
    <>
      <Button
        variant={variant === 'nav' ? "ghost" : "outline"}
        size={variant === 'nav' ? "icon" : "sm"}
        className={cn(
          "relative",
          className
        )}
        onClick={() => setShowNotifications(true)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <div className="relative">
          <Bell className={cn("h-4 w-4", variant === 'nav' ? "h-5 w-5" : "")} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={cn(
                  "absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1",
                  variant === 'nav' ? "-top-2 -right-2" : "-top-1.5 -right-1.5"
                )}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {variant !== 'nav' && (
          <span className="ml-2 hidden sm:inline-block">Notifications</span>
        )}
      </Button>
      
      <GlobalNotificationCenter
        open={showNotifications}
        onOpenChange={setShowNotifications}
      />
    </>
  );
};

export default NotificationBell;
