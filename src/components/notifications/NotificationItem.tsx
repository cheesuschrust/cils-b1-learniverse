
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  File, 
  Bell, 
  Check, 
  FileAudio, 
  FileText, 
  FileSpreadsheet, 
  FileImage 
} from 'lucide-react';
import { Notification, useNotifications } from '@/contexts/NotificationsContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead } = useNotifications();
  
  const getNotificationIcon = () => {
    const { type, metadata } = notification;
    
    if (type === 'file-processed') {
      const fileType = metadata?.fileType;
      if (fileType?.startsWith('audio')) return <FileAudio className="h-5 w-5" />;
      if (fileType?.startsWith('text') || fileType?.includes('txt')) return <FileText className="h-5 w-5" />;
      if (fileType?.includes('sheet') || fileType?.includes('csv')) return <FileSpreadsheet className="h-5 w-5" />;
      if (fileType?.startsWith('image')) return <FileImage className="h-5 w-5" />;
      return <File className="h-5 w-5" />;
    }
    
    return <Bell className="h-5 w-5" />;
  };
  
  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };
  
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-md transition-colors cursor-pointer",
        notification.read 
          ? "bg-background hover:bg-muted/50" 
          : "bg-muted/30 hover:bg-muted/50"
      )}
      onClick={handleMarkAsRead}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getNotificationIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h5 className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
            {notification.title}
          </h5>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
        
        {notification.type === 'file-processed' && notification.metadata && (
          <div className="mt-2 text-xs">
            {notification.metadata.contentType && (
              <div className="flex items-center justify-between">
                <span>Content Type:</span>
                <span className="font-medium capitalize">{notification.metadata.contentType}</span>
              </div>
            )}
            {notification.metadata.confidence !== undefined && (
              <div className="flex items-center justify-between">
                <span>Confidence:</span>
                <span className="font-medium">{notification.metadata.confidence.toFixed(1)}%</span>
              </div>
            )}
            {notification.metadata.detectedLanguage && (
              <div className="flex items-center justify-between">
                <span>Language:</span>
                <span className="font-medium capitalize">{notification.metadata.detectedLanguage}</span>
              </div>
            )}
          </div>
        )}
        
        {!notification.read && (
          <div className="mt-2 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead();
              }}
              className="h-6 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark as read
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
