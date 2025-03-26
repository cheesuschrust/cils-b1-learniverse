
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from './NotificationItem';
import { Bell, BellOff, Archive, X } from 'lucide-react';

interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalNotificationCenter: React.FC<GlobalNotificationCenterProps> = ({
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const { 
    notifications, 
    dismissNotification, 
    markAsRead, 
    markAllAsRead, 
    dismissAllNotifications 
  } = useNotifications();
  
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  useEffect(() => {
    if (!open) {
      // Reset active tab when dialog closes
      setActiveTab('all');
    }
  }, [open]);

  const handleAction = (id: string, action: string) => {
    // Handle custom actions from notifications
    console.log(`Action ${action} triggered for notification ${id}`);
    
    // Mark as read automatically when action is taken
    markAsRead(id);
  };

  const handleNotificationRead = (id: string) => {
    markAsRead(id);
  };

  const getActiveNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return unreadNotifications;
      case 'read':
        return readNotifications;
      case 'all':
      default:
        return allNotifications;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Notification Center</DialogTitle>
          <DialogDescription>
            View and manage all your notifications
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center px-4 pb-2">
            <TabsList>
              <TabsTrigger value="all">
                All ({allNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({readNotifications.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px] border-t">
            <TabsContent value="all" className="m-0">
              {renderNotificationList(getActiveNotifications())}
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              {renderNotificationList(getActiveNotifications())}
            </TabsContent>
            
            <TabsContent value="read" className="m-0">
              {renderNotificationList(getActiveNotifications())}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 p-4 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => markAllAsRead()}
          >
            <BellOff className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => dismissAllNotifications()}
          >
            <Archive className="h-4 w-4 mr-2" />
            Dismiss all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  function renderNotificationList(notificationList: any[]) {
    if (notificationList.length === 0) {
      return (
        <div className="flex h-[300px] flex-col items-center justify-center p-6 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-lg font-medium">No notifications</p>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === 'unread' 
              ? "You've read all your notifications" 
              : activeTab === 'read' 
                ? "You have no read notifications" 
                : "You don't have any notifications yet"}
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y">
        {notificationList.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={dismissNotification}
            onAction={handleAction}
            onRead={handleNotificationRead}
          />
        ))}
      </div>
    );
  }
};

export default GlobalNotificationCenter;
