
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Bell, CheckCircle, Clock, Download, Filter, History, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import NotificationItem from '@/components/notifications/NotificationItem';
import { cn } from '@/lib/utils';

const AdminNotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, getFileProcessingNotifications } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Apply type filter
    if (filter !== 'all' && notification.type !== filter) return false;
    
    // Apply search filter
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const fileProcessingNotifications = getFileProcessingNotifications();
  
  const handleDismiss = (id: string) => {
    console.log(`Dismissing notification: ${id}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all" className="flex items-center justify-center">
            <Bell className="h-4 w-4 mr-2" />
            All
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center justify-center">
            <History className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="file-processing" className="flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            Files
            {fileProcessingNotifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {fileProcessingNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center justify-center">
            <Clock className="h-4 w-4 mr-2" />
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {renderNotificationList(filteredNotifications)}
        </TabsContent>
        
        <TabsContent value="system">
          {renderNotificationList(notifications.filter(n => n.type === 'system'))}
        </TabsContent>
        
        <TabsContent value="file-processing">
          {renderNotificationList(fileProcessingNotifications)}
        </TabsContent>
        
        <TabsContent value="unread">
          {renderNotificationList(notifications.filter(n => !n.read))}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderNotificationList(notificationList: any[]) {
    if (notificationList.length === 0) {
      return (
        <Card className="flex items-center justify-center p-6">
          <div className="text-center">
            <Trash2 className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">No notifications found</p>
          </div>
        </Card>
      );
    }
    
    return (
      <ScrollArea className={cn("py-1", notificationList.length > 5 ? "h-[400px]" : "")}>
        <div className="space-y-1">
          {notificationList.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      </ScrollArea>
    );
  }
};

export default AdminNotificationCenter;
