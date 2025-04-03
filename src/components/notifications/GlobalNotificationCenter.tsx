
import React, { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from '@/components/notifications/NotificationItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCheck, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalNotificationCenter: React.FC<GlobalNotificationCenterProps> = ({
  open,
  onOpenChange
}) => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAll,
    markAsRead,
    removeNotification,
  } = useNotifications();

  // Mark notifications as read when opening
  useEffect(() => {
    if (open && unreadCount > 0) {
      // We don't want to mark all as read immediately, just when viewed
    }
  }, [open, unreadCount]);

  // Separate notifications by type/priority
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high');
  const otherNotifications = notifications.filter(n => n.priority !== 'high');
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    await clearAll();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <SheetTitle>Notifications</SheetTitle>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs h-8"
              >
                <CheckCheck className="mr-1 h-4 w-4" />
                Mark all as read
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
                className="text-xs h-8"
              >
                <Trash className="mr-1 h-4 w-4" />
                Clear all
              </Button>
            </div>
          </div>
          <SheetDescription className="flex justify-between items-center">
            <span>Stay updated with your learning progress</span>
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all" className="flex gap-2 items-center">
                All
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex gap-2 items-center">
                Unread
                {unreadNotifications.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="important" className="flex gap-2 items-center">
                Important
                {highPriorityNotifications.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1">
                    {highPriorityNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1">
            <TabsContent value="all" className="m-0">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={() => removeNotification(notification.id)}
                      onRead={() => markAsRead(notification.id)}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          window.location.href = notification.link;
                          onOpenChange(false);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="font-medium text-lg">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              {unreadNotifications.length > 0 ? (
                <div className="divide-y">
                  {unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={() => removeNotification(notification.id)}
                      onRead={() => markAsRead(notification.id)}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          window.location.href = notification.link;
                          onOpenChange(false);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
                  <CheckCheck className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="font-medium text-lg">No unread notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You've read all your notifications.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="important" className="m-0">
              {highPriorityNotifications.length > 0 ? (
                <div className="divide-y">
                  {highPriorityNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={() => removeNotification(notification.id)}
                      onRead={() => markAsRead(notification.id)}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          window.location.href = notification.link;
                          onOpenChange(false);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="font-medium text-lg">No important notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have any high-priority notifications at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-4 border-t">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline" 
            className="w-full"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GlobalNotificationCenter;
