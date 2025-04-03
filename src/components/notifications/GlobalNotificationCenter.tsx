
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from './NotificationItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalNotificationCenter: React.FC<GlobalNotificationCenterProps> = ({
  open,
  onOpenChange
}) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  // Filter notifications by read status
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  // Handle removing a notification
  const handleRemove = async (id: string) => {
    await removeNotification(id);
  };

  // Handle clearing all notifications
  const handleClearAll = async () => {
    await clearAll();
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" /> Notifications
          </SheetTitle>
          <SheetDescription>
            Stay updated on your progress, achievements, and reminders.
          </SheetDescription>
          <div className="flex justify-between mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={handleMarkAllAsRead}
              disabled={unreadNotifications.length === 0}
            >
              <Check className="h-3 w-3 mr-1" /> Mark all as read
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Clear all
            </Button>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-220px)]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mb-4 opacity-20" />
                  <p>No notifications yet</p>
                  <p className="text-sm">We'll notify you of important updates and reminders</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NotificationItem
                        notification={notification}
                        onDismiss={() => handleRemove(notification.id)}
                        onRead={() => handleMarkAsRead(notification.id)}
                      />
                      <Separator />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread">
            <ScrollArea className="h-[calc(100vh-220px)]">
              {unreadNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Check className="h-12 w-12 mb-4 opacity-20" />
                  <p>No unread notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {unreadNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NotificationItem
                        notification={notification}
                        onDismiss={() => handleRemove(notification.id)}
                        onRead={() => handleMarkAsRead(notification.id)}
                      />
                      <Separator />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="read">
            <ScrollArea className="h-[calc(100vh-220px)]">
              {readNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mb-4 opacity-20" />
                  <p>No read notifications</p>
                  <p className="text-sm">Read notifications will appear here</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {readNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NotificationItem
                        notification={notification}
                        onDismiss={() => handleRemove(notification.id)}
                      />
                      <Separator />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default GlobalNotificationCenter;
