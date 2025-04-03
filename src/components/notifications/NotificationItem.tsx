
import React from 'react';
import { format } from 'date-fns';
import { Check, X, ChevronRight, Bell, Award, Calendar, Clock, Flag, AlertTriangle } from 'lucide-react';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onDismiss?: () => void;
  onRead?: () => void;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onRead,
  onClick,
}) => {
  // Format the notification creation date
  const formattedDate = format(
    new Date(notification.createdAt),
    'MMM d, h:mm a'
  );

  // Determine if the notification is expired
  const isExpired = notification.expires && new Date(notification.expires) < new Date();

  // Skip rendering expired notifications
  if (isExpired) return null;

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-indigo-500" />;
      case 'streak':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <Flag className="h-5 w-5 text-green-500" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get priority style
  const getPriorityStyle = () => {
    switch (notification.priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
      default:
        return '';
    }
  };

  return (
    <div 
      className={cn(
        "p-4 hover:bg-accent cursor-pointer relative",
        notification.read ? 'opacity-75' : '',
        getPriorityStyle()
      )}
      onClick={() => {
        if (!notification.read && onRead) {
          onRead();
        }
        if (onClick) {
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className={cn(
              "text-sm font-medium",
              notification.read ? 'text-muted-foreground' : ''
            )}>
              {notification.title}
            </h4>
            <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
              {formattedDate}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {notification.actions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || 'default'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.action();
                  }}
                  className="h-7 text-xs px-2 py-1"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {!notification.read && (
          <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        )}
      </div>
      
      <div className="absolute top-2 right-2 flex space-x-1">
        {onRead && !notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onRead();
            }}
            aria-label="Mark as read"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            aria-label="Dismiss notification"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
