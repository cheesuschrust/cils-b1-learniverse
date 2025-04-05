import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Check, Trash2, ChevronRight, Calendar, Award, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
  onDismiss: () => void;
  onClick?: () => void;
  expanded?: boolean;
  showControls?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDismiss,
  onClick,
  expanded = false,
  showControls = false
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // Get icon for notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-amber-500" />;
      case 'streak':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'milestone':
        return <Award className="h-5 w-5 text-green-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "border rounded-lg p-3 cursor-pointer",
        notification.read ? "bg-muted/50" : "bg-muted/20",
        !notification.read && "border-primary/20"
      )}
      onClick={() => {
        if (onClick) onClick();
        setIsExpanded(!isExpanded);
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            notification.read ? "bg-muted/50" : "bg-primary/10"
          )}>
            {getIcon()}
          </div>
          <div>
            <h3 className={cn(
              "font-medium line-clamp-2",
              notification.read ? "text-muted-foreground" : ""
            )}>
              {notification.title}
            </h3>
            {isExpanded ? (
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.message}
              </p>
            )}
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          {showActions || expanded ? (
            <div className="flex gap-1">
              {!notification.read && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead();
                  }}
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {isExpanded && notification.actions && notification.actions.length > 0 && (
        <div className="mt-3 flex gap-2 justify-end">
          {notification.actions.map(action => (
            <Button 
              key={action.id} 
              size="sm" 
              variant={action.variant || "outline"}
              onClick={(e) => {
                e.stopPropagation();
                action.action();
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NotificationItem;
