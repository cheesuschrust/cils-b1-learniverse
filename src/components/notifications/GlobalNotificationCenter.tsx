
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Settings 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { useNotifications } from '@/contexts/NotificationsContext';

export interface NotificationCenterProps {
  maxNotifications?: number;
  className?: string;
}

export const GlobalNotificationCenter: React.FC<NotificationCenterProps> = ({
  maxNotifications = 5,
  className = ""
}) => {
  const { 
    notifications, 
    markAllAsRead, 
    markAsRead,
    clearAll, 
    userPreferences,
    updatePreferences
  } = useNotifications();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);
  
  const handleTogglePreference = (key: keyof typeof userPreferences) => {
    updatePreferences({
      ...userPreferences,
      [key]: !userPreferences[key]
    });
  };
  
  return (
    <Card className={`${className} w-full max-w-sm shadow-lg`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Your recent notifications
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Notification settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <h4 className="font-medium mb-2">Notification Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-notifications" className="text-sm">System</Label>
                    <Switch 
                      id="system-notifications" 
                      checked={userPreferences.system}
                      onCheckedChange={() => handleTogglePreference('system')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="learning-notifications" className="text-sm">Learning</Label>
                    <Switch 
                      id="learning-notifications" 
                      checked={userPreferences.learning}
                      onCheckedChange={() => handleTogglePreference('learning')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="achievement-notifications" className="text-sm">Achievements</Label>
                    <Switch 
                      id="achievement-notifications" 
                      checked={userPreferences.achievements}
                      onCheckedChange={() => handleTogglePreference('achievements')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-notifications" className="text-sm">Marketing</Label>
                    <Switch 
                      id="marketing-notifications" 
                      checked={userPreferences.marketing}
                      onCheckedChange={() => handleTogglePreference('marketing')}
                    />
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={clearAll}>
            <X className="h-4 w-4" />
            <span className="sr-only">Clear all</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications to display</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {notifications.slice(0, maxNotifications).map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            </ScrollArea>
            
            {unreadCount > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalNotificationCenter;
