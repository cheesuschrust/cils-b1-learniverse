
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Star, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Trash2,
  AlertTriangle,
  File,
  MessageSquare
} from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onRemove,
  onClick,
}) => {
  // Format the time since the notification was created
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { 
    addSuffix: true 
  });

  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'streak':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      case 'file-processing':
        return <File className="h-5 w-5 text-green-500" />;
      case 'feedback':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get the priority class for styling
  const getPriorityClass = () => {
    switch (notification.priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
      default:
        return 'border-l-transparent';
    }
  };

  // Handle click on the notification
  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    
    if (onClick) {
      onClick(notification);
    }
  };

  // Check if notification is expired
  const isExpired = notification.expires ? new Date(notification.expires) < new Date() : false;

  // Render notification actions if present
  const renderActions = () => {
    if (!notification.actions || notification.actions.length === 0) {
      return null;
    }

    return (
      <div className="flex mt-2 gap-2">
        {notification.actions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              action.action();
              // Mark as read when action is taken
              if (!notification.read) {
                onRead(notification.id);
              }
            }}
          >
            {action.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "p-4 hover:bg-muted/50 transition-colors cursor-pointer border-l-4",
        !notification.read && "bg-muted/20",
        getPriorityClass(),
        isExpired && "opacity-50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {!notification.read && (
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {timeAgo}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          {renderActions()}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationItem;
