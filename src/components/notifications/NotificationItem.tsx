
import React from 'react';
import { X, Info, AlertCircle, CheckCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

const notificationVariants = cva("", {
  variants: {
    variant: {
      default: "border-l-4 border-primary bg-primary/5",
      info: "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20",
      success: "border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20",
      warning: "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
      error: "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-primary" />;
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onRead,
  onAction
}) => {
  const { id, title, message, type = 'default', createdAt, read, actions } = notification;

  const handleClick = () => {
    if (!read) {
      onRead(id);
    }
  };

  const formattedDate = formatDistanceToNow(
    new Date(createdAt),
    { addSuffix: true }
  );

  return (
    <div 
      className={cn(
        "relative p-4 hover:bg-muted/50 transition-colors",
        notificationVariants({ variant: type as any }),
        !read && "font-medium"
      )}
      onClick={handleClick}
    >
      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(id);
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>

      <div className="flex gap-3 pr-6">
        <div className="mt-0.5 flex-shrink-0">
          {getNotificationIcon(type)}
        </div>
        <div className="space-y-1">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{message}</div>
          
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAction) {
                      onAction(id, action.id);
                    }
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-1">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
