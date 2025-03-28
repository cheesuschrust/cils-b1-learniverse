
import React from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle,
  X,
  Check,
  Trash2,
  FileText,
  Crown,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import GlobalNotificationAction from './GlobalNotificationAction';
import { NotificationType } from '@/types/notification';

const getIconForNotificationType = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'achievement':
      return <Crown className="h-5 w-5 text-purple-500" />;
    case 'file-processing':
      return <FileText className="h-5 w-5 text-gray-500" />;
    case 'update':
      return <RefreshCw className="h-5 w-5 text-teal-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

interface GlobalNotificationCenterProps {
  className?: string;
  maxHeight?: number;
  showBadge?: boolean;
}

const GlobalNotificationCenter: React.FC<GlobalNotificationCenterProps> = ({
  className = '',
  maxHeight = 400,
  showBadge = true,
}) => {
  const { 
    notifications, 
    removeNotification, 
    markAsRead, 
    clearAll, 
    unreadCount, 
    markAllAsRead 
  } = useNotifications();
  
  if (notifications.length === 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Bell className="h-5 w-5" />
            {showBadge && unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="py-6 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Group by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const todayNotifications = notifications.filter(n => 
    n.createdAt && new Date(n.createdAt) >= today
  );
  
  const yesterdayNotifications = notifications.filter(n => 
    n.createdAt && 
    new Date(n.createdAt) >= yesterday && 
    new Date(n.createdAt) < today
  );
  
  const thisWeekNotifications = notifications.filter(n => 
    n.createdAt && 
    new Date(n.createdAt) >= thisWeek && 
    new Date(n.createdAt) < yesterday
  );
  
  const olderNotifications = notifications.filter(n => 
    !n.createdAt || new Date(n.createdAt) < thisWeek
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Bell className="h-5 w-5" />
          {showBadge && unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex space-x-1">
            {unreadCount > 0 && (
              <GlobalNotificationAction
                label="Mark all as read"
                icon={<Check className="h-4 w-4" />}
                onClick={markAllAsRead}
                id=""
                variant="ghost"
                className="h-8 px-2 text-xs"
              />
            )}
            {notifications.length > 0 && (
              <GlobalNotificationAction
                label="Clear all"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={clearAll}
                id=""
                variant="ghost"
                className="h-8 px-2 text-xs"
              />
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className={`max-h-[${maxHeight}px] overflow-y-auto`}>
          {todayNotifications.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Today</DropdownMenuLabel>
              {todayNotifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 focus:bg-muted">
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5">{getIconForNotificationType(notification.type)}</div>
                      <div>
                        <div className="font-medium leading-none">{notification.title}</div>
                        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{notification.message}</div>
                        
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {notification.actions.map((action, index) => (
                              <GlobalNotificationAction
                                key={index}
                                label={action.label}
                                onClick={action.action}
                                id=""
                                variant={action.variant || 'default'}
                                className="h-7 px-2 text-xs"
                                icon={action.icon}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <GlobalNotificationAction
                          label=""
                          onClick={markAsRead}
                          id={notification.id || ''}
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          icon={<Check className="h-3.5 w-3.5" />}
                        />
                      )}
                      <GlobalNotificationAction
                        label=""
                        onClick={removeNotification}
                        id={notification.id || ''}
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        icon={<X className="h-3.5 w-3.5" />}
                      />
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="mt-1 self-end">
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px]">NEW</Badge>
                    </div>
                  )}
                  {notification.createdAt && (
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}
          
          {yesterdayNotifications.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Yesterday</DropdownMenuLabel>
              {yesterdayNotifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 focus:bg-muted">
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5">{getIconForNotificationType(notification.type)}</div>
                      <div>
                        <div className="font-medium leading-none">{notification.title}</div>
                        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{notification.message}</div>
                        
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {notification.actions.map((action, index) => (
                              <GlobalNotificationAction
                                key={index}
                                label={action.label}
                                onClick={action.action}
                                id=""
                                variant={action.variant || 'default'}
                                className="h-7 px-2 text-xs"
                                icon={action.icon}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <GlobalNotificationAction
                          label=""
                          onClick={markAsRead}
                          id={notification.id || ''}
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          icon={<Check className="h-3.5 w-3.5" />}
                        />
                      )}
                      <GlobalNotificationAction
                        label=""
                        onClick={removeNotification}
                        id={notification.id || ''}
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        icon={<X className="h-3.5 w-3.5" />}
                      />
                    </div>
                  </div>
                  {notification.createdAt && (
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GlobalNotificationCenter;
