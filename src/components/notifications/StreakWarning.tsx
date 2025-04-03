
import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { differenceInHours, format } from 'date-fns';

const StreakWarning: React.FC = () => {
  const { user } = useAuth();
  const { streak, hasCompletedToday } = useDailyQuestion();
  const { addNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const [lastWarned, setLastWarned] = useState<Date | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user is about to break their streak
  useEffect(() => {
    // Only check for users with an active streak who haven't completed today's question
    if (!user || !streak || streak < 2 || hasCompletedToday) return;
    
    // Get the current time
    const now = new Date();
    const currentHour = now.getHours();
    
    // Show warning if:
    // 1. It's after 8pm
    // 2. User is not on the daily question page
    // 3. User hasn't been warned in the last 4 hours
    if (
      currentHour >= 20 && 
      location.pathname !== '/daily-question' &&
      (!lastWarned || differenceInHours(now, lastWarned) > 4)
    ) {
      const checkLastStreak = localStorage.getItem('lastStreakWarning');
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Only show warning once per day
      if (checkLastStreak !== today) {
        setOpen(true);
        localStorage.setItem('lastStreakWarning', today);
        setLastWarned(now);
        
        // Add notification
        addNotification({
          title: "Streak at Risk!",
          message: `Your ${streak}-day streak will be lost if you don't complete today's question.`,
          type: 'streak',
          priority: 'high',
          icon: 'flame',
          actions: [
            {
              id: 'go-to-daily',
              label: 'Go to Daily Question',
              action: () => {
                navigate('/daily-question');
              }
            }
          ]
        });
      }
    }
  }, [user, streak, hasCompletedToday, location.pathname, lastWarned, addNotification, navigate]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-orange-500">
            <Flame className="h-5 w-5" />
            <AlertDialogTitle>Your streak is at risk!</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            You have a {streak}-day streak, but you haven't completed today's question yet.
            Would you like to go to the daily question now to maintain your streak?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Maybe Later</AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate('/daily-question')}>
            Go to Daily Question
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StreakWarning;
