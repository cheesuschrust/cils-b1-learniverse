
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BookOpen, CheckCircle, FileText, History, Info, MessageCircle, Settings, Star, Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  key: string;
  onDismiss: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss, onAction }) => {
  // Choose icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'feature':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'update':
        return <Info className="h-5 w-5 text-green-500" />;
      case 'lesson':
        return <BookOpen className="h-5 w-5 text-teal-500" />;
      case 'support':
        return <MessageCircle className="h-5 w-5 text-pink-500" />;
      case 'file-processing':
        return <FileText className="h-5 w-5 text-indigo-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // For custom icons provided in the notification
  const getCustomIcon = () => {
    if (notification.icon === 'trophy') return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (notification.icon === 'history') return <History className="h-5 w-5 text-blue-500" />;
    if (notification.icon === 'check') return <CheckCircle className="h-5 w-5 text-green-500" />;
    return null;
  };
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDismiss(notification.id);
  };
  
  const handleAction = (action: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAction) {
      onAction(notification.id, action);
    }
  };
  
  const notificationContent = (
    <Card className={cn(
      "flex items-start p-4 space-x-4 cursor-pointer hover:bg-muted/50 transition-colors",
      !notification.read && "border-l-4 border-l-primary"
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {notification.icon ? getCustomIcon() : getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{notification.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex space-x-2 mt-2">
            {notification.actions.map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={handleAction(action.action)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0 opacity-50 hover:opacity-100"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </Card>
  );
  
  // If there's a link, wrap the notification in a Link component
  if (notification.link) {
    return (
      <Link to={notification.link}>
        {notificationContent}
      </Link>
    );
  }
  
  return notificationContent;
};

export default NotificationItem;
