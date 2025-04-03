
import React, { useEffect, useState } from 'react';
import { format, addDays, differenceInHours, isSameDay } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Calendar, Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Link } from 'react-router-dom';

const StreakWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const { streak, lastCompletionDate } = useDailyQuestion();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Check if user needs a streak warning
  useEffect(() => {
    const checkStreakStatus = () => {
      if (!lastCompletionDate || streak === 0) return;

      const now = new Date();
      const nextResetDate = addDays(lastCompletionDate, 1);
      const hoursRemaining = differenceInHours(nextResetDate, now);

      // Show warning if less than 6 hours remaining to maintain streak
      // and user hasn't completed today's challenge
      if (hoursRemaining <= 6 && hoursRemaining > 0 && !isSameDay(lastCompletionDate, now)) {
        // Only show the warning if streak is significant (3+ days)
        if (streak >= 3) {
          setShowWarning(true);
          
          // Also add a notification for the streak warning
          if (streak >= 5) {
            addNotification({
              title: 'Streak at Risk!',
              message: `Your ${streak}-day streak will expire in ${Math.floor(hoursRemaining)} hours. Complete today's challenge to maintain it!`,
              type: 'streak',
              priority: 'high',
              icon: 'flame',
              link: '/daily-question',
              actions: [
                {
                  id: 'practice-now',
                  label: 'Practice Now',
                  action: () => {
                    window.location.href = '/daily-question';
                  },
                  variant: 'default'
                }
              ]
            });
          }
        }
      } else {
        setShowWarning(false);
      }
    };

    // Check immediately and then set up hourly interval
    checkStreakStatus();
    
    const intervalId = setInterval(checkStreakStatus, 60 * 60 * 1000); // Check every hour
    
    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletionDate, streak, addNotification]);

  // Handle dismissing the warning
  const dismissWarning = () => {
    setShowWarning(false);
    
    // Show toast when dismissed
    toast({
      title: "Streak Warning Dismissed",
      description: "We'll remind you again in a few hours if you still haven't completed today's challenge.",
    });
  };

  // Schedule notification for later if dismissed
  const remindLater = () => {
    setShowWarning(false);
    
    // Schedule another warning in 2 hours
    setTimeout(() => {
      if (lastCompletionDate && !isSameDay(lastCompletionDate, new Date())) {
        setShowWarning(true);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours
    
    toast({
      title: "Reminder Scheduled",
      description: "We'll remind you again in 2 hours.",
    });
  };

  // If the last completion date is not available or there's no streak, don't show anything
  if (!lastCompletionDate || streak === 0) {
    return null;
  }

  // Calculate hours remaining
  const nextResetDate = addDays(lastCompletionDate, 1);
  const hoursRemaining = Math.max(0, Math.floor(differenceInHours(nextResetDate, new Date())));

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 right-4 z-50 w-80 bg-amber-50 border border-amber-200 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-bold text-amber-800">Streak at Risk!</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={dismissWarning}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="font-medium">{streak} day streak</span>
                </div>
                <div className="text-sm text-red-500 font-medium">
                  {hoursRemaining} hours left
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Complete today's practice to maintain your streak before it resets at{" "}
                <span className="font-semibold">
                  {format(nextResetDate, "h:mm a")}
                </span>
              </p>
              
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={remindLater}
                >
                  Remind Later
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  asChild
                >
                  <Link to="/daily-question">
                    Practice Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-100 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center text-xs text-amber-700">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Streak started: {format(new Date(addDays(new Date(), -streak + 1)), "MMM d, yyyy")}</span>
            </div>
            <span className="text-xs font-medium text-amber-700">Day {streak}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakWarning;
