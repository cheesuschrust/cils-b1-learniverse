
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellRing, CheckCheck, Archive } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from './NotificationItem';

export interface GlobalNotificationCenterProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const GlobalNotificationCenter: React.FC<GlobalNotificationCenterProps> = ({
  open,
  onOpenChange
}) => {
  const { 
    notifications, 
    dismissNotification, 
    markAsRead,
    dismissAllNotifications
  } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const [isOpen, setIsOpen] = useState(open || false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Handle controlled component behavior
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    
    // If closing the notification center, mark all visible notifications as read
    if (!newOpen && activeTab === 'unread') {
      notifications
        .filter(notification => !notification.read)
        .forEach(notification => markAsRead(notification.id));
    }
    
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  // Check for new notifications
  useEffect(() => {
    const hasUnread = notifications.some(notification => !notification.read);
    setHasNewNotifications(hasUnread);
  }, [notifications]);

  // Filter notifications based on the active tab
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(notification => !notification.read);
      case 'read':
        return notifications.filter(notification => notification.read);
      default:
        return notifications;
    }
  };

  // Handle notification actions
  const handleNotificationAction = (id: string, action: string) => {
    console.log(`Action ${action} triggered for notification ${id}`);
    // Implement specific action handling here
    // For now, just mark as read
    markAsRead(id);
  };

  const markAllAsRead = () => {
    notifications
      .filter(notification => !notification.read)
      .forEach(notification => markAsRead(notification.id));
  };

  const clearAllNotifications = () => {
    dismissAllNotifications();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellRing className="h-5 w-5" />
          {hasNewNotifications && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex justify-between items-center">
            Notifications
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearAllNotifications}
                title="Clear all notifications"
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="secondary" className="ml-1">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Unread
              <Badge variant="secondary" className="ml-1">
                {notifications.filter(n => !n.read).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="read" className="flex items-center gap-2">
              Read
              <Badge variant="secondary" className="ml-1">
                {notifications.filter(n => n.read).length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 max-h-[70vh] overflow-y-auto">
            {getFilteredNotifications().length === 0 ? (
              <div className="text-center py-8">
                <BellRing className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              getFilteredNotifications().map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                  onRead={markAsRead}
                  onAction={handleNotificationAction}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-0 max-h-[70vh] overflow-y-auto">
            {getFilteredNotifications().length === 0 ? (
              <div className="text-center py-8">
                <CheckCheck className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No unread notifications</p>
              </div>
            ) : (
              getFilteredNotifications().map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                  onRead={markAsRead}
                  onAction={handleNotificationAction}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="read" className="mt-0 max-h-[70vh] overflow-y-auto">
            {getFilteredNotifications().length === 0 ? (
              <div className="text-center py-8">
                <Archive className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No read notifications</p>
              </div>
            ) : (
              getFilteredNotifications().map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                  onRead={markAsRead}
                  onAction={handleNotificationAction}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default GlobalNotificationCenter;
