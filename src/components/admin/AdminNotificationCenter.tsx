
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Filter, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from '@/components/notifications/NotificationItem';
import { useSystemLog } from '@/hooks/use-system-log';

const AdminNotificationCenter = () => {
  const { notifications, unreadCount, markAllAsRead, getFileProcessingNotifications } = useNotifications();
  const { logSystemAction } = useSystemLog();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const fileProcessingNotifications = getFileProcessingNotifications();
  const unreadFileProcessingCount = fileProcessingNotifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    logSystemAction('admin_marked_all_read', 'Admin marked all notifications as read');
  };
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notification Center</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border bg-muted p-1 text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                className={`px-2 py-1 h-8 ${filter === 'all' ? 'bg-background text-foreground' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`px-2 py-1 h-8 ${filter === 'unread' ? 'bg-background text-foreground' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Mark all as read</span>
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          View and manage all system notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="all">
              All Notifications 
              {unreadCount > 0 && (
                <Badge variant="outline" className="ml-2">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="files">
              File Processing 
              {unreadFileProcessingCount > 0 && (
                <Badge variant="outline" className="ml-2">{unreadFileProcessingCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredNotifications.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredNotifications.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p>{filter === 'unread' ? 'No unread notifications' : 'No notifications'}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="files">
            {fileProcessingNotifications.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {fileProcessingNotifications
                    .filter(n => filter === 'all' || !n.read)
                    .map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                      />
                    ))
                  }
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Filter className="h-8 w-8 mb-2 opacity-50" />
                <p>No file processing notifications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminNotificationCenter;
