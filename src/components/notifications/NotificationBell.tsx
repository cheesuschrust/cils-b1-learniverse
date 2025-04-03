
import React, { useState, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClickOutside } from '@/hooks/useClickOutside';
import NotificationItem from './NotificationItem';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    removeNotification,
    markAllAsRead 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useClickOutside(ref, () => {
    if (isOpen) setIsOpen(false);
  });

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDismiss = async (id: string) => {
    await removeNotification(id);
  };

  const handleClearAll = async () => {
    await markAllAsRead();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className={`relative ${className || ''}`}
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background shadow-lg rounded-md border overflow-hidden z-50">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <div className="space-x-1">
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Mark all as read
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => handleDismiss(notification.id)}
                    onRead={() => handleMarkAsRead(notification.id)}
                  />
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
