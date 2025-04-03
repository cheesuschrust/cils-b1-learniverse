
import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Notification, NotificationType } from '@/types/notification';
import { useLocation } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import { 
  Bell, 
  Star, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Flame,
  Download
} from 'lucide-react';
import { addDays, isPast, isToday, format, subDays } from 'date-fns';

interface GlobalNotificationCenterProps {
  checkIntervalMinutes?: number;
}

const GlobalNotificationCenter: React.FC<GlobalNotificationCenterProps> = ({
  checkIntervalMinutes = 5
}) => {
  const { user } = useAuth();
  const { streak } = useDailyQuestion();
  const { notifications, addNotification, markAsRead } = useNotifications();
  const { toast } = useToast();
  const location = useLocation();
  const [lastCheckedStreak, setLastCheckedStreak] = useState(0);
  const [lastReminderSent, setLastReminderSent] = useState<Date | null>(null);
  
  // Display toast notification based on notification type
  const displayToastNotification = (notification: Notification) => {
    // Skip if already read
    if (notification.read) return;
    
    // Mark notification as read when toast is shown
    markAsRead(notification.id);
    
    // Determine toast variant based on notification type
    let variant = "default";
    let icon = <Bell className="h-5 w-5" />;
    
    if (notification.type === "achievement") {
      variant = "success";
      icon = <Star className="h-5 w-5 text-yellow-500" />;
    } else if (notification.type === "streak") {
      variant = "success";
      icon = <Flame className="h-5 w-5 text-orange-500" />;
    } else if (notification.type === "reminder") {
      variant = "info";
      icon = <Clock className="h-5 w-5 text-blue-500" />;
    } else if (notification.type === "milestone") {
      variant = "success";
      icon = <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (notification.type === "system") {
      variant = "default";
      icon = <Info className="h-5 w-5 text-gray-500" />;
    } else if (notification.type === "file-processing") {
      variant = "default";
      icon = <RefreshCw className="h-5 w-5 text-blue-500" />;
    } else if (notification.type === "feedback") {
      variant = "info";
      icon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    
    // Display the toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: variant as any,
      action: notification.actions?.length ? (
        <div className="flex gap-2 mt-2">
          {notification.actions.map((action) => (
            <button
              key={action.id}
              className={`px-3 py-1 rounded text-xs font-medium ${
                action.variant === "destructive" 
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              onClick={() => {
                action.action();
              }}
            >
              {action.icon && (
                <span className="mr-1">{action.icon}</span>
              )}
              {action.label}
            </button>
          ))}
        </div>
      ) : undefined,
    });
  };

  // Check for streak notifications
  useEffect(() => {
    // Only run when streak changes and is greater than lastCheckedStreak
    if (user && streak > lastCheckedStreak && streak > 0) {
      // Special streak milestones
      if (streak % 7 === 0) {
        // Weekly streak milestone
        addNotification({
          id: `streak-weekly-${streak}-${Date.now()}`,
          title: `${streak}-Day Streak Milestone!`,
          message: `Congratulations! You've maintained your streak for ${streak} days. Keep up the fantastic work!`,
          type: 'streak',
          createdAt: new Date(),
          read: false,
          priority: 'high',
          icon: 'flame',
          actions: [
            {
              id: 'view-streak',
              label: 'View Progress',
              action: () => {
                window.location.href = '/progress';
              }
            }
          ]
        });
      } else if (streak % 30 === 0) {
        // Monthly streak milestone
        addNotification({
          id: `streak-monthly-${streak}-${Date.now()}`,
          title: `${streak}-Day Streak Achievement!`,
          message: `Amazing! You've practiced consistently for ${streak} days. You're making incredible progress in your Italian learning journey!`,
          type: 'achievement',
          createdAt: new Date(),
          read: false,
          priority: 'high',
          icon: 'trophy',
        });
      } else if (streak % 100 === 0) {
        // Century streak milestone
        addNotification({
          id: `streak-century-${streak}-${Date.now()}`,
          title: `${streak} Day Streak Master!`,
          message: `Incredible achievement! You've maintained your learning streak for ${streak} days. You're truly dedicated to mastering Italian!`,
          type: 'achievement',
          createdAt: new Date(),
          read: false,
          priority: 'high',
          icon: 'trophy',
        });
      } else if (streak === 3 || streak === 5) {
        // Small milestone for early encouragement
        addNotification({
          id: `streak-small-${streak}-${Date.now()}`,
          title: `${streak} Day Streak!`,
          message: `You're building momentum! Keep practicing daily to maintain your streak.`,
          type: 'streak',
          createdAt: new Date(),
          read: false,
          priority: 'medium',
          icon: 'flame',
        });
      }
      
      // Update last checked streak
      setLastCheckedStreak(streak);
    }
  }, [streak, lastCheckedStreak, user, addNotification]);

  // Show streak warning notification when user hasn't completed daily question
  useEffect(() => {
    if (!user) return;
    
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Only send reminders in the afternoon/evening (after 4pm)
      if (currentHour >= 16 && (!lastReminderSent || !isToday(lastReminderSent))) {
        // Check if user has completed daily question
        if (location.pathname !== '/daily-question') {
          addNotification({
            id: `streak-reminder-${Date.now()}`,
            title: "Don't Break Your Streak!",
            message: streak > 0 
              ? `You're on a ${streak}-day streak. Don't forget to complete your daily question today!`
              : "Don't forget to complete your daily question today!",
            type: 'reminder',
            createdAt: new Date(),
            read: false,
            priority: 'medium',
            icon: 'flame',
            actions: [
              {
                id: 'go-to-daily',
                label: 'Go to Daily Question',
                action: () => {
                  window.location.href = '/daily-question';
                }
              }
            ]
          });
          
          // Update last reminder sent
          setLastReminderSent(new Date());
        }
      }
    }, checkIntervalMinutes * 60 * 1000);
    
    return () => clearInterval(checkInterval);
  }, [user, streak, lastReminderSent, location.pathname, addNotification, checkIntervalMinutes]);

  // Process unread notifications
  useEffect(() => {
    // Find unread notifications to display as toasts
    const unreadNotifications = notifications.filter(n => !n.read);
    
    // Display at most 3 unread notifications as toasts to avoid overwhelming the user
    unreadNotifications.slice(0, 3).forEach(notification => {
      displayToastNotification(notification);
    });
  }, [notifications]);

  return <NotificationCenter />;
};

export default GlobalNotificationCenter;
