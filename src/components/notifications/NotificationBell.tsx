
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from './NotificationItem';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllAsRead, dismissNotification, markAsRead } = useNotifications();
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  return (
    <div className="relative" ref={popoverRef}>
      <Button
        variant="ghost"
        size="icon"
        className={cn("relative", className)}
        onClick={toggleNotifications}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background rounded-md shadow-lg overflow-hidden z-50 border">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="max-h-[calc(80vh-9rem)]">
            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 5).map(notification => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => dismissNotification(notification.id)}
                    onRead={() => markAsRead(notification.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
          {notifications.length > 5 && (
            <div className="p-2 border-t text-center">
              <Button 
                variant="link" 
                size="sm" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                View all ({notifications.length})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
