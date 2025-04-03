
import React, { useState, useEffect } from 'react';
import { X, Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReminderBannerProps {
  title: string;
  message: string;
  link: string;
  timeRemaining?: Date;
  onDismiss: () => void;
  type?: 'practice' | 'streak' | 'goal' | 'event';
  className?: string;
}

const ReminderBanner: React.FC<ReminderBannerProps> = ({
  title,
  message,
  link,
  timeRemaining,
  onDismiss,
  type = 'practice',
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string | null>(
    timeRemaining ? formatDistanceToNow(timeRemaining, { addSuffix: true }) : null
  );
  const navigate = useNavigate();
  
  useEffect(() => {
    if (timeRemaining) {
      const interval = setInterval(() => {
        setTimeLeft(formatDistanceToNow(timeRemaining, { addSuffix: true }));
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [timeRemaining]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300); // Allow animation to complete
  };
  
  const getBannerColor = () => {
    switch (type) {
      case 'streak':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800';
      case 'goal':
        return 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800';
      case 'event':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-950/50 dark:border-purple-800';
      case 'practice':
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'streak':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'goal':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'practice':
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "w-full rounded-lg border shadow-sm p-4 flex items-center justify-between transition-all",
      getBannerColor(),
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {getIcon()}
        </div>
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{message}</p>
          {timeLeft && (
            <p className="text-xs font-medium mt-1">{timeLeft}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm"
          variant="ghost" 
          className="h-8 px-3"
          onClick={() => navigate(link)}
        >
          Take Action
        </Button>
        <Button 
          size="icon"
          variant="ghost" 
          className="h-8 w-8"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReminderBanner;
