
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, CheckCircle, Clock, Medal, 
  Flame, AlertTriangle, Info, MessageCircle 
} from 'lucide-react';

export interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
  onDismiss: () => void;
  onAction?: (actionId: string) => void;
  showControls?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDismiss,
  onAction,
  showControls = false,
}) => {
  const getIconForType = () => {
    switch (notification.type) {
      case 'achievement':
        return <Medal className="h-5 w-5 text-amber-500" />;
      case 'streak':
        return <Flame className="h-5 w-5 text-orange-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'system':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'progress':
        return <Info className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCardClass = () => {
    if (notification.read) {
      return 'bg-muted/40';
    }
    
    switch (notification.priority) {
      case 'high':
        return 'bg-white dark:bg-gray-800 border-l-4 border-orange-500';
      case 'medium':
        return 'bg-white dark:bg-gray-800 border-l-4 border-blue-500';
      case 'low':
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  const handleActionClick = (actionId: string) => {
    if (onAction) {
      onAction(actionId);
    }
    onRead();
  };

  return (
    <Card className={`mb-2 overflow-hidden ${getCardClass()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {notification.icon ? (
              <div className="h-6 w-6 text-primary">{getIconForType()}</div>
            ) : (
              getIconForType()
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">
                {notification.title}
              </h4>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 mb-2">{notification.message}</p>

            {notification.actions && notification.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {notification.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={() => handleActionClick(action.id)}
                  >
                    {action.icon && <MessageCircle className="mr-1 h-4 w-4" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {showControls && (
          <div className="flex justify-end gap-2 mt-2">
            {!notification.read && (
              <Button size="sm" variant="ghost" onClick={onRead} className="text-xs">
                Mark as read
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onDismiss} className="text-xs">
              Dismiss
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
