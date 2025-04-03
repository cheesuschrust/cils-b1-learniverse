
import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellRing, Check, Trash2, Calendar, Star, Clock, AlertTriangle } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { Badge } from '@/components/ui/badge';

interface NotificationCenterProps {
  maxHeight?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  maxHeight = '400px' 
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAll,
    markAsRead,
    removeNotification
  } = useNotifications();
  
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close the popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

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

  // Handle marking a notification as read when clicked
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle any navigation or action associated with the notification
    if (notification.link) {
      // Use history to navigate without a full page reload
      window.location.href = notification.link;
      setOpen(false);
    }
  };

  // Get the appropriate icon for each notification type
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Star className="h-4 w-4" />;
      case 'streak':
        return <Calendar className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      case 'milestone':
        return <Star className="h-4 w-4" />;
      case 'system':
        return <Bell className="h-4 w-4" />;
      case 'file-processing':
        return <Clock className="h-4 w-4" />;
      case 'feedback':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div ref={popoverRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            aria-label="Open notifications"
          >
            {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            {unreadCount > 0 && (
              <Badge 
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[380px] p-0" align="end">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
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
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => clearAll()}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="flex w-full rounded-none bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2"
                >
                  All
                  {getTypeCount('all') > 0 && (
                    <Badge variant="secondary" className="ml-1.5 h-5 text-xs">
                      {getTypeCount('all')}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="achievement" 
                  className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2"
                >
                  Achievements
                  {getTypeCount('achievement') > 0 && (
                    <Badge variant="secondary" className="ml-1.5 h-5 text-xs">
                      {getTypeCount('achievement')}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="streak" 
                  className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2"
                >
                  Streaks
                  {getTypeCount('streak') > 0 && (
                    <Badge variant="secondary" className="ml-1.5 h-5 text-xs">
                      {getTypeCount('streak')}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea style={{ height: maxHeight }}>
              {['all', 'achievement', 'streak'].map((tab) => (
                <TabsContent key={tab} value={tab} className="m-0 p-0">
                  {getFilteredNotifications().length > 0 ? (
                    <div className="divide-y">
                      {getFilteredNotifications().map((notification) => (
                        <NotificationItem 
                          key={notification.id}
                          notification={notification}
                          onRead={() => markAsRead(notification.id)}
                          onRemove={() => removeNotification(notification.id)}
                          onClick={() => handleNotificationClick(notification)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Bell className="h-10 w-10 text-muted-foreground opacity-20 mb-3" />
                      <p className="text-muted-foreground text-sm">No notifications yet</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationCenter;
