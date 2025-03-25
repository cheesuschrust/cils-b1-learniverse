
import React from 'react';
import { 
  BellRing, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  X, 
  FileText,
  Trophy,
  Calendar,
  Sparkles,
  RefreshCw,
  BookOpen,
  MessageSquareText
} from 'lucide-react';
import { Notification, NotificationType } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  const getIcon = (type: NotificationType) => {
    if (type === 'success') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (type === 'info') {
      return <Info className="h-5 w-5 text-blue-500" />;
    } else if (type === 'warning') {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else if (type === 'error') {
      return <X className="h-5 w-5 text-red-500" />;
    } else if (type === 'file-processing') {
      return <FileText className="h-5 w-5 text-indigo-500" />;
    } else if (type === 'achievement') {
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    } else if (type === 'reminder') {
      return <Calendar className="h-5 w-5 text-purple-500" />;
    } else if (type === 'feature') {
      return <Sparkles className="h-5 w-5 text-cyan-500" />;
    } else if (type === 'update') {
      return <RefreshCw className="h-5 w-5 text-emerald-500" />;
    } else if (type === 'lesson') {
      return <BookOpen className="h-5 w-5 text-violet-500" />;
    } else if (type === 'support') {
      return <MessageSquareText className="h-5 w-5 text-pink-500" />;
    } else {
      return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getPriorityClasses = () => {
    if (notification.priority === 'high') {
      return "border-l-4 border-red-500";
    } else if (notification.priority === 'medium') {
      return "border-l-4 border-amber-500";
    }
    return "";
  };
  
  const handleActionClick = (action: () => void) => {
    // Mark as read when an action is clicked
    onRead(notification.id);
    action();
  };
  
  return (
    <div 
      className={`p-4 bg-card rounded-md mb-2 shadow-sm 
        ${notification.read ? 'opacity-70' : ''} 
        ${getPriorityClasses()}`}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="mt-0.5">
            {notification.icon ? 
              <img src={notification.icon} alt="" className="h-5 w-5" /> : 
              getIcon(notification.type)
            }
          </div>
          
          <div className="flex-1">
            <div className="font-medium text-sm">
              {notification.title}
            </div>
            <div className="text-sm text-muted-foreground">
              {notification.message}
            </div>
            
            {notification.link && (
              <Link 
                to={notification.link} 
                className="text-xs text-primary hover:underline mt-1 inline-block"
                onClick={() => onRead(notification.id)}
              >
                View details
              </Link>
            )}
            
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-2">
                {notification.actions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleActionClick(action.action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationItem;
