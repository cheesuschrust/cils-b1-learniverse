
import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { 
  Bell, 
  Check, 
  Trash, 
  ExternalLink, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Award,
  Calendar,
  Clock 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge-fixed';
import { cn } from '@/lib/utils';
import { Notification, NotificationItemProps } from '@/types/notification';

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onRead,
  showControls = true
}) => {
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(notification.id);
    }
  };
  
  const handleRead = () => {
    if (onRead && !notification.read) {
      onRead(notification.id);
    }
  };
  
  const handleActionClick = () => {
    if (notification.actionHandler) {
      notification.actionHandler();
    }
    
    // Mark as read after clicking an action
    handleRead();
  };
  
  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'streak':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <Award className="h-5 w-5 text-purple-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getNotificationBadge = () => {
    switch (notification.type) {
      case 'achievement':
        return <Badge variant="success">Achievement</Badge>;
      case 'streak':
        return <Badge variant="warning">Streak</Badge>;
      case 'milestone':
        return <Badge variant="info">Milestone</Badge>;
      case 'reminder':
        return <Badge variant="secondary">Reminder</Badge>;
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'info':
        return <Badge variant="info">Info</Badge>;
      case 'speaking':
        return <Badge variant="info">Speaking</Badge>;
      case 'listening':
        return <Badge variant="info">Listening</Badge>;
      default:
        return <Badge>System</Badge>;
    }
  };
  
  return (
    <Card
      className={cn(
        "w-full shadow-none border-0 border-b rounded-none transition-colors",
        !notification.read ? "bg-muted/40" : "",
        showControls ? "hover:bg-muted/60" : ""
      )}
      onClick={handleRead}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {getNotificationIcon()}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{notification.title}</h4>
                {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
              </div>
              {getNotificationBadge()}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDate(notification.createdAt)}
              </span>
              
              <div className="flex items-center gap-2">
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex items-center gap-2">
                    {notification.actions.map(action => (
                      <Button
                        key={action.id}
                        variant={action.variant || "default"}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          action.action();
                          handleRead();
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                {notification.actionLabel && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleActionClick}
                  >
                    {notification.actionLabel}
                    {notification.link && <ExternalLink className="ml-1 h-3 w-3" />}
                  </Button>
                )}
                
                {showControls && (
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRead();
                        }}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                      }}
                    >
                      <Trash className="h-3.5 w-3.5" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
