
import React, { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Notification } from '@/types/notification';

interface NotificationToastProps {
  notification: Notification;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  const { markAsRead } = useNotifications();
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
        if (!notification.read) markAsRead(notification.id);
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [notification.id, autoClose, autoCloseDelay, markAsRead, onClose]);
  
  // Get background color based on notification type
  const getBgColor = () => {
    switch (notification.type) {
      case 'achievement':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800';
      case 'streak':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800';
      case 'reminder':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
      case 'milestone':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'system':
      default:
        return 'bg-background border-border';
    }
  };

  const showInToast = () => {
    toast({
      title: notification.title,
      description: notification.message,
      action: notification.link ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            if (notification.link) window.location.href = notification.link;
          }}
        >
          View
        </Button>
      ) : undefined,
    });
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div 
      className={cn(
        "p-4 rounded-lg border shadow-sm mb-2",
        getBgColor()
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{notification.title}</h3>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {!notification.read && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7"
              onClick={() => markAsRead(notification.id)}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
      {notification.actions && notification.actions.length > 0 && (
        <div className="mt-3 flex gap-2 justify-end">
          {notification.actions.map(action => (
            <Button 
              key={action.id} 
              size="sm" 
              variant={action.variant || "outline"}
              onClick={() => {
                action.action();
                if (onClose) onClose();
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationToast;
