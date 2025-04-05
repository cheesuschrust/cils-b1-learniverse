import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Bell, CheckCircle, Clock, Download, Filter, History, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge-fixed';
import NotificationItem from '@/components/notifications/NotificationItem';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/types/notification';

const AdminNotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    getFileProcessingNotifications, 
    markAsRead, 
    dismissNotification 
  } = useNotifications();
  
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Apply type filter
    if (filter !== 'all' && filter !== 'unread') {
      if (filter === 'system' && notification.type !== 'system') {
        return false;
      } else if (filter === 'unread' && notification.read) {
        return false;
      }
    }
    
    if (filter === 'unread' && notification.read) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const fileProcessingNotifications = getFileProcessingNotifications();
  const hasFileProcessingNotifications = fileProcessingNotifications.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notification Center
            {unreadCount > 0 && (
              <Badge className="ml-2" variant="secondary">{unreadCount} unread</Badge>
            )}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={markAllAsRead} title="Mark all as read">
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Export notifications">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon" title="Filter notifications">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="px-4 border-b">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>All</TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setFilter('unread')}>Unread</TabsTrigger>
            <TabsTrigger value="system" onClick={() => setFilter('system')}>System</TabsTrigger>
            <TabsTrigger value="files" disabled={!hasFileProcessingNotifications}>Files</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="flex-1 p-0">
          <ScrollArea className="h-full max-h-[500px]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p>No notifications found</p>
                <p className="text-sm">
                  {searchQuery ? 'Try adjusting your search query' : 'You have no notifications at this time'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => dismissNotification(notification.id)}
                    onRead={() => markAsRead(notification.id)}
                    showControls={true}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="unread" className="flex-1 p-0">
          <ScrollArea className="h-full max-h-[500px]">
            {/* Unread notifications */}
            <div className="divide-y">
              {filteredNotifications
                .filter(notification => !notification.read)
                .map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => dismissNotification(notification.id)}
                    onRead={() => markAsRead(notification.id)}
                    showControls={true}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="system" className="flex-1 p-0">
          <ScrollArea className="h-full max-h-[500px]">
            {/* System notifications */}
            <div className="divide-y">
              {filteredNotifications
                .filter(notification => notification.type === 'system' as NotificationType)
                .map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => dismissNotification(notification.id)}
                    onRead={() => markAsRead(notification.id)}
                    showControls={true}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="files" className="flex-1 p-0">
          <ScrollArea className="h-full max-h-[500px]">
            {/* File processing notifications */}
            <div className="divide-y">
              {fileProcessingNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={() => dismissNotification(notification.id)}
                  onRead={() => markAsRead(notification.id)}
                  showControls={true}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Updated {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center">
          <History className="h-3 w-3 mr-1" />
          <span>Showing {filteredNotifications.length} of {notifications.length}</span>
        </div>
      </div>
    </Card>
  );
};

export default AdminNotificationCenter;
