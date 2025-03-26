
import React from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  X, 
  FilePlus, 
  Bell, 
  Award, 
  ExternalLink, 
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/contexts/NotificationsContext';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onDismiss?: () => void;
  onRead?: () => void;
  showControls?: boolean;
  maxHeight?: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onRead,
  showControls = false,
  maxHeight = 300
}) => {
  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'file-processing':
        return <FilePlus className="h-5 w-5 text-indigo-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "relative p-4 hover:bg-muted/50 transition-colors",
        notification.read ? "opacity-80" : "bg-muted/30"
      )}
    >
      <div className="flex">
        <div className="mr-3 mt-0.5">
          {notification.icon ? (
            <span className="flex h-6 w-6 items-center justify-center">{getIcon()}</span>
          ) : (
            getIcon()
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-start justify-between">
            <h4 className={cn(
              "font-medium text-sm",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            
            {showControls && (
              <div className="flex gap-1 ml-2">
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5" 
                    onClick={onRead}
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  onClick={onDismiss}
                  title="Dismiss"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div 
            className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words"
            style={{ maxHeight: maxHeight ? `${maxHeight}px` : 'none', overflow: 'hidden' }}
          >
            {notification.message}
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatTime(notification.timestamp instanceof Date ? notification.timestamp : new Date(notification.timestamp))}
            </span>
            
            {notification.link && (
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs flex items-center gap-1"
                asChild
              >
                <a href={notification.link} target="_blank" rel="noopener noreferrer">
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
            
            {notification.priority === 'high' && (
              <span className="text-xs font-medium text-red-500">High priority</span>
            )}
          </div>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-2 flex gap-2">
              {notification.actions.map((action, index) => (
                <Button 
                  key={index} 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    // Action would typically dispatch an event or call a handler
                    console.log(`Action "${action.action}" clicked for notification ${notification.id}`);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
