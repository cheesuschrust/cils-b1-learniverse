
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { format, differenceInDays, startOfDay, isAfter } from 'date-fns';
// Explicitly adding type definition imports to fix the module resolution
import { utcToZonedTime } from 'date-fns-tz';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Link } from 'react-router-dom';

const StreakWarning: React.FC = () => {
  const { user } = useAuth();
  const { streak, lastCompletionDate } = useDailyQuestion();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [shouldWarn, setShouldWarn] = useState<boolean>(false);
  const [userTimezone, setUserTimezone] = useState<string>('UTC');
  const [lastShown, setLastShown] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(timezone || 'UTC');
    } catch (e) {
      console.error('Error detecting timezone:', e);
    }
  }, []);

  useEffect(() => {
    // Only check for streak warnings if the user is logged in and has a streak
    if (!user || streak <= 0 || !lastCompletionDate) return;
    
    checkStreakStatus();
    
    // Check every hour
    const interval = setInterval(checkStreakStatus, 3600000);
    return () => clearInterval(interval);
  }, [user, streak, lastCompletionDate, userTimezone]);

  const checkStreakStatus = () => {
    if (!lastCompletionDate || streak <= 0) return;
    
    try {
      const now = utcToZonedTime(new Date(), userTimezone);
      const lastCompletion = new Date(lastCompletionDate);
      const daysDifference = differenceInDays(now, lastCompletion);
      
      // If it's been at least 22 hours since the last warning
      const shouldShowWarning = !lastShown || 
        isAfter(now, new Date(lastShown.getTime() + 22 * 60 * 60 * 1000));
      
      // Show warning if:
      // 1. It's been at least 22 hours since we last showed a warning
      // 2. User completed a question yesterday but not today
      // 3. The local time is after 5 PM
      if (shouldShowWarning && 
          daysDifference === 1 && 
          now.getHours() >= 17 && 
          streak > 3) {
        
        setShouldWarn(true);
        setLastShown(now);
        
        // Show toast notification
        toast({
          title: "Streak at Risk!",
          description: `Your ${streak}-day streak will be lost if you don't complete today's question.`,
          variant: "warning",
          action: (
            <Button variant="default" size="sm" asChild>
              <Link to="/daily-question">Practice Now</Link>
            </Button>
          ),
        });
        
        // Add to notification center
        addNotification({
          title: "Don't Break Your Streak!",
          message: `Your ${streak}-day streak will be lost if you don't complete today's question.`,
          type: "streak",
          priority: "high",
          createdAt: now,
          icon: "flame",
          link: "/daily-question",
          actions: [
            {
              id: "go-to-practice",
              label: "Practice Now",
              action: () => {
                window.location.href = "/daily-question";
              },
              variant: "default"
            }
          ]
        });
      } else {
        setShouldWarn(false);
      }
    } catch (e) {
      console.error('Error checking streak status:', e);
    }
  };

  if (!shouldWarn) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-card shadow-lg rounded-lg p-4 border border-orange-300">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-lg">Streak Alert!</h3>
          <p className="text-sm text-muted-foreground">
            Complete today's practice to keep your {streak}-day streak!
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShouldWarn(false)}
        >
          Dismiss
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          asChild
        >
          <Link to="/daily-question">Practice Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default StreakWarning;
