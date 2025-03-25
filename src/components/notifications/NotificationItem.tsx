
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck, X, Bell, FileText, Trophy, Clock, Sparkles, RefreshCw, BookOpen, HeadphonesIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onRead,
  onAction
}) => {
  // Format time as relative (e.g., "5 minutes ago")
  const formattedTime = notification.createdAt 
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : '';

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'file-processing':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'feature':
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
      case 'update':
        return <RefreshCw className="h-5 w-5 text-cyan-500" />;
      case 'lesson':
        return <BookOpen className="h-5 w-5 text-emerald-500" />;
      case 'support':
        return <HeadphonesIcon className="h-5 w-5 text-pink-500" />;
      case 'info':
      case 'system':
      default:
        return notification.icon ? (
          <div className="h-5 w-5 flex items-center justify-center">
            {notification.icon}
          </div>
        ) : (
          <Bell className="h-5 w-5 text-slate-500" />
        );
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <Card 
      className={cn(
        "mb-2 relative overflow-hidden transition-all hover:bg-accent/50 cursor-pointer",
        !notification.read && "border-l-4 border-l-primary"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold m-0 line-clamp-1">{notification.title}</h4>
              
              <div className="flex items-center gap-1">
                {notification.priority === 'high' && (
                  <Badge variant="destructive" className="text-xs">Important</Badge>
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">{formattedTime}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
            
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {notification.actions.map((action, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.action();
                      if (onAction) {
                        onAction(notification.id, action.label);
                      }
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
