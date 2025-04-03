
import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Bell, 
  Calendar, 
  Trophy, 
  Clock, 
  Flame,
  MessageSquare,
  Info,
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  NotificationType, 
  Notification,
  NotificationAction,
} from '@/types/notification';

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: () => void;
  onRead: () => void;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onRead,
  onClick
}) => {
  const {
    id,
    title,
    message,
    type,
    createdAt,
    read,
    actions,
    icon,
    link
  } = notification;

  const handleClick = () => {
    if (!read) {
      onRead();
    }
    if (onClick) {
      onClick();
    } else if (link) {
      window.location.href = link;
    }
  };

  const renderIcon = () => {
    const iconClasses = "h-5 w-5";
    const defaultIcon = type === 'achievement' ? Trophy : 
                       type === 'streak' ? Flame : 
                       type === 'system' ? Bell : 
                       type === 'reminder' ? Clock : 
                       type === 'milestone' ? Calendar : 
                       MessageSquare;
    
    // If a custom icon name is provided, render the corresponding icon
    if (icon === 'trophy') return <Trophy className={iconClasses} />;
    if (icon === 'flame') return <Flame className={iconClasses} />;
    if (icon === 'bell') return <Bell className={iconClasses} />;
    if (icon === 'clock') return <Clock className={iconClasses} />;
    if (icon === 'calendar') return <Calendar className={iconClasses} />;
    if (icon === 'info') return <Info className={iconClasses} />;
    if (icon === 'alert') return <AlertCircle className={iconClasses} />;
    if (icon === 'check') return <CheckCircle className={iconClasses} />;
    
    // Fallback to the default icon based on notification type
    const IconComponent = defaultIcon;
    return <IconComponent className={iconClasses} />;
  };

  const getTypeStyles = () => {
    switch(type) {
      case 'achievement':
        return 'bg-green-50 border-green-200';
      case 'streak':
        return 'bg-orange-50 border-orange-200';
      case 'system':
        return 'bg-blue-50 border-blue-200';
      case 'reminder':
        return 'bg-purple-50 border-purple-200';
      case 'milestone':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div 
      className={cn(
        "p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer",
        read ? 'opacity-75' : 'border-l-4',
        getTypeStyles()
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
          {renderIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">
              {title}
            </h4>
            <button 
              className="text-muted-foreground hover:text-foreground p-1 rounded-full" 
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
            {message}
          </p>
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {actions.map((action) => (
                <Button 
                  key={action.id} 
                  size="sm" 
                  variant={action.variant || "outline"} 
                  onClick={(e) => {
                    e.stopPropagation();
                    action.action();
                  }}
                  className="text-xs h-7"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
            {link && (
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
