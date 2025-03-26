
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Info, Check, AlertCircle, BellRing, Download, X, ExternalLink } from 'lucide-react';
import { Notification, NotificationType } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onDismiss,
  onRead 
}) => {
  const { id, title, message, type = 'default', createdAt, read, url } = notification;
  
  const getTypeIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'file-processing':
        return <Download className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleClick = () => {
    if (!read) {
      onRead(id);
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss(id);
  };
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRead(id);
  };
  
  const formattedTime = typeof createdAt === 'string' 
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : formatDistanceToNow(createdAt, { addSuffix: true });
  
  return (
    <div 
      className={cn(
        "flex p-3 gap-3 rounded-md transition-colors cursor-pointer",
        read ? "bg-background hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10",
        "relative"
      )}
      onClick={handleClick}
    >
      <div className="mt-1 flex-shrink-0">{getTypeIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className={cn(
            "text-sm font-medium",
            read ? "text-foreground" : "text-primary"
          )}>
            {title}
          </h4>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{message}</p>
        
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {notification.actions.map(action => (
              <Button 
                key={action.id} 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Action clicked:', action.label);
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        {!read && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6"
            onClick={handleMarkAsRead}
            title="Mark as read"
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6"
          onClick={handleDismiss}
          title="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        
        {url && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, '_blank');
            }}
            title="Open link"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {!read && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
      )}
    </div>
  );
};

export default NotificationItem;
