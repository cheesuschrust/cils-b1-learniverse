
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from './NotificationItem';
import { Trash2, Check, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    unreadCount,
    markAllAsRead,
    clearAll,
    markAsRead,
    removeNotification
  } = useNotifications();
  
  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    } else {
      return notifications.filter(notification => notification.type === activeTab);
    }
  };

  // Count notifications by type
  const getTypeCount = (type: string) => {
    return notifications.filter(notification => 
      type === 'all' ? true : notification.type === type
    ).length;
  };
  
  // Get unread count by type
  const getUnreadCountByType = (type: string) => {
    return notifications.filter(notification => 
      (type === 'all' ? true : notification.type === type) && !notification.read
    ).length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Notifications 
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="flex justify-between">
            <span>Stay updated with your Italian learning journey</span>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => markAllAsRead()}
                >
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => clearAll()}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" className="relative">
              All
              {getUnreadCountByType('all') > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                  {getUnreadCountByType('all')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="achievement" className="relative">
              Achievements
              {getUnreadCountByType('achievement') > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                  {getUnreadCountByType('achievement')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="streak" className="relative">
              Streaks
              {getUnreadCountByType('streak') > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                  {getUnreadCountByType('streak')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reminder" className="relative">
              Reminders
              {getUnreadCountByType('reminder') > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                  {getUnreadCountByType('reminder')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="milestone" className="relative">
              Milestones
              {getUnreadCountByType('milestone') > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                  {getUnreadCountByType('milestone')}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] pr-4">
            {getFilteredNotifications().length > 0 ? (
              <div className="space-y-2">
                {getFilteredNotifications().map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onRead={() => markAsRead(notification.id)}
                    onRemove={() => removeNotification(notification.id)}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                      if (notification.link) {
                        window.location.href = notification.link;
                        onOpenChange(false);
                      }
                    }}
                    expanded
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground opacity-20 mb-3" />
                <p className="text-muted-foreground text-sm">No notifications</p>
                <p className="text-muted-foreground text-xs mt-1">
                  When you receive new notifications, they'll appear here
                </p>
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalNotificationCenter;
