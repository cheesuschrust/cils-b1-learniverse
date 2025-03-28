
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, XCircle, Info, AlertTriangle, Bell, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationItemProps, NotificationAction } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const NotificationItem: React.FC<NotificationItemProps & { onAction?: (action: NotificationAction) => void }> = ({
  notification,
  onDismiss,
  onRead,
  className,
  onAction
}) => {
  const getIcon = () => {
    switch (notification.type) {
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
  
  const getTimeAgo = () => {
    if (!notification.createdAt) return '';
    return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
  };
  
  const handleDismiss = () => {
    if (notification.id && onDismiss) {
      onDismiss(notification.id);
    }
  };
  
  const handleRead = () => {
    if (notification.id && onRead && !notification.read) {
      onRead(notification.id);
    }
  };
  
  const handleActionClick = (action: NotificationAction) => {
    if (onAction) {
      onAction(action);
    } else if (action.action) {
      action.action();
    }
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        notification.read ? 'opacity-75' : 'bg-card/95 shadow-md',
        className
      )}
      onClick={handleRead}
    >
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-medium">{notification.title}</h3>
          {!notification.read && (
            <Badge variant="default" className="h-5 px-1.5 text-[10px]">NEW</Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        
        {notification.actions && notification.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {notification.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(action);
                }}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
        
        {notification.link && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 h-auto p-0 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(notification.link, '_blank');
            }}
          >
            View Details <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        )}
        
        {notification.createdAt && (
          <div className="mt-2 text-right text-xs text-muted-foreground">
            {getTimeAgo()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
