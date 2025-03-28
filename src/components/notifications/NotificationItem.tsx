
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { NotificationItemProps, NotificationAction } from '@/types/notification'; 
import GlobalNotificationAction from './GlobalNotificationAction';

// Helper to format notification date
const formatNotificationDate = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy');
  }
};

const NotificationItem: React.FC<NotificationItemProps & { 
  onAction?: (action: NotificationAction) => void 
}> = ({ 
  notification, 
  onDismiss, 
  onRead, 
  className = "",
  showControls = false,
  onAction 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // If no id provided, use a fallback
  const notificationId = notification.id ?? 'notification-id';
  
  const handleDismiss = () => {
    onDismiss(notificationId);
  };
  
  const handleRead = () => {
    if (!notification.read) {
      onRead(notificationId);
    }
  };

  const handleAction = (action: NotificationAction) => {
    if (onAction) {
      onAction(action);
    } else {
      // If no onAction handler provided, just execute the action directly
      action.action();
    }
  };
  
  // Determine icon based on notification type
  const getIcon = () => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get formatted timestamp
  const getTimestamp = () => {
    const date = notification.createdAt || notification.timestamp || new Date();
    return typeof date === 'string' ? new Date(date) : date;
  };
  
  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200 border-l-4",
        !notification.read ? "bg-background" : "bg-muted/30",
        notification.type === 'success' && "border-l-green-500",
        notification.type === 'error' && "border-l-red-500", 
        notification.type === 'warning' && "border-l-yellow-500",
        notification.type === 'info' && "border-l-blue-500",
        notification.type === 'system' && "border-l-purple-500",
        !notification.type && "border-l-gray-500",
        isHovered && "shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRead}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-foreground line-clamp-1">
              {notification.title}
            </h4>
            
            <div className="flex items-center gap-1 ml-2">
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              )}
              
              {showControls && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          
          {notification.link && (
            <a 
              href={notification.link} 
              className="text-xs text-blue-500 hover:underline mt-1 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              View details
            </a>
          )}
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {notification.actions.map((action, index) => (
                <GlobalNotificationAction
                  key={index}
                  label={action.label}
                  onClick={action.action}
                  id={notificationId}
                  variant={action.variant || "default"}
                  icon={action.icon}
                />
              ))}
            </div>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatNotificationDate(getTimestamp())}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
