
import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Clock, CheckSquare, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem';

interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalNotificationCenter: React.FC<GlobalNotificationCenterProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    notifications,
    markAsRead,
    removeNotification,
    markAllAsRead,
    clearAll,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const unreadNotifications = notifications.filter((n) => !n.read);
  const achievementNotifications = notifications.filter((n) => n.type === 'achievement' || n.type === 'milestone');
  const reminderNotifications = notifications.filter((n) => n.type === 'reminder');

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDismiss = async (id: string) => {
    await removeNotification(id);
  };

  const handleAction = (notification: any, actionId: string) => {
    const action = notification.actions?.find((a: any) => a.id === actionId);
    if (action && action.action) {
      action.action();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-medium">Notification Center</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 border-b">
            <TabsList className="grid grid-cols-4 gap-2">
              <TabsTrigger value="all" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                All
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              </TabsTrigger>
              
              <TabsTrigger value="unread" className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4" />
                Unread
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {unreadNotifications.length}
                </span>
              </TabsTrigger>
              
              <TabsTrigger value="achievements" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Achievements
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {achievementNotifications.length}
                </span>
              </TabsTrigger>
              
              <TabsTrigger value="reminders" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Reminders
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {reminderNotifications.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-2 border-b flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {activeTab === 'all' && `${notifications.length} notifications`}
                {activeTab === 'unread' && `${unreadNotifications.length} unread notifications`}
                {activeTab === 'achievements' && `${achievementNotifications.length} achievement notifications`}
                {activeTab === 'reminders' && `${reminderNotifications.length} reminder notifications`}
              </p>
              <div className="flex gap-2">
                {activeTab === 'unread' && unreadNotifications.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => markAllAsRead()}>
                    <CheckSquare className="mr-2 h-4 w-4" /> Mark all as read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => clearAll()}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear all
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="all" className="p-2 h-full">
                {notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={() => handleDismiss(notification.id)}
                        onRead={() => handleMarkAsRead(notification.id)}
                        onAction={(actionId) => handleAction(notification, actionId)}
                        showControls
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Bell className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">No notifications</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unread" className="p-2 h-full">
                {unreadNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {unreadNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={() => handleDismiss(notification.id)}
                        onRead={() => handleMarkAsRead(notification.id)}
                        onAction={(actionId) => handleAction(notification, actionId)}
                        showControls
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <CheckSquare className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">No unread notifications</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="p-2 h-full">
                {achievementNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {achievementNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={() => handleDismiss(notification.id)}
                        onRead={() => handleMarkAsRead(notification.id)}
                        onAction={(actionId) => handleAction(notification, actionId)}
                        showControls
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Bell className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">No achievement notifications</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reminders" className="p-2 h-full">
                {reminderNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {reminderNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={() => handleDismiss(notification.id)}
                        onRead={() => handleMarkAsRead(notification.id)}
                        onAction={(actionId) => handleAction(notification, actionId)}
                        showControls
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">No reminders</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalNotificationCenter;
