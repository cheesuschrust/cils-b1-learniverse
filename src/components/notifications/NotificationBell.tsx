
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import GlobalNotificationCenter from './GlobalNotificationCenter';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={() => setShowNotifications(true)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <div className="relative">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Button>
      
      <GlobalNotificationCenter
        open={showNotifications}
        onOpenChange={setShowNotifications}
      />
    </>
  );
};

export default NotificationBell;
