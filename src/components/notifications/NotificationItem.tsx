
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationItemProps } from '@/types/interface-fixes';
import { formatDistanceToNow } from 'date-fns';
import { X, Bell, Info, CheckCircle, AlertTriangle, AlertCircle, File, Zap } from 'lucide-react';

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onDismiss, 
  onRead,
  onAction 
}) => {
  const handleDismiss = () => {
    onDismiss(notification.id);
  };

  const handleRead = () => {
    onRead(notification.id);
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(notification.id, action);
    }
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'file-processing':
        return <File className="h-5 w-5 text-purple-500" />;
      case 'achievement':
        return <Zap className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get background color based on priority
  const getCardClasses = () => {
    if (notification.read) {
      return "bg-muted";
    }
    
    switch (notification.priority) {
      case 'high':
        return "bg-red-50 dark:bg-red-900/20";
      case 'normal':
        return "bg-blue-50 dark:bg-blue-900/20";
      default:
        return "";
    }
  };

  // Format notification time
  const getFormattedTime = () => {
    const timestamp = new Date(notification.timestamp);
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <Card className={`mb-3 relative ${getCardClasses()}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
      
      <CardHeader className="pb-2 pt-6">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getIcon()}</div>
          <div className="flex-1">
            <CardTitle className="text-base font-semibold">
              {notification.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {getFormattedTime()}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm">{notification.message}</p>
        
        {notification.priority === 'high' && (
          <Badge variant="destructive" className="mt-2">Important</Badge>
        )}
        
        {notification.type === 'file-processing' && (
          <div className="mt-3">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${notification.progress || 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Processing: {notification.progress || 0}% complete
            </p>
          </div>
        )}
      </CardContent>
      
      {(notification.actions && notification.actions.length > 0) && (
        <CardFooter className="flex flex-wrap gap-2">
          {notification.actions.map((action, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm"
              onClick={() => handleAction(action.action)}
            >
              {action.label}
            </Button>
          ))}
          
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRead}
            >
              Mark as read
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationItem;
