
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Trash2, BellOff } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from '@/components/notifications/NotificationItem';

const GlobalNotificationCenter: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    dismissNotification,
    dismissAll
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<string>('all');
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'info':
        return notifications.filter(n => n.type === 'info');
      case 'alerts':
        return notifications.filter(n => n.type === 'warning' || n.type === 'error');
      default:
        return notifications;
    }
  };
  
  const handleDismiss = (id: string) => {
    dismissNotification(id);
  };
  
  const handleAction = (id: string, action: string) => {
    // Mark as read when action is taken
    markAsRead(id);
    
    // Handle specific actions
    console.log(`Action ${action} taken on notification ${id}`);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={dismissAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
        <CardDescription>
          Stay informed about system updates and your learning progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredNotifications().length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications().map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismiss}
                    onAction={handleAction}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <BellOff className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications to display</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GlobalNotificationCenter;
