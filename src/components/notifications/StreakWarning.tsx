
import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Flame, AlertTriangle } from 'lucide-react';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { useNavigate } from 'react-router-dom';

const StreakWarning: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { addNotification } = useNotifications();
  const { currentStreak, lastActivity } = useGamificationContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if streak is at risk (last activity was yesterday)
    const checkStreakRisk = () => {
      if (!lastActivity) return false;
      
      const now = new Date();
      const lastActivityDate = new Date(lastActivity);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If last activity was yesterday and it's past 6 PM, show warning
      if (
        lastActivityDate.getDate() === yesterday.getDate() &&
        lastActivityDate.getMonth() === yesterday.getMonth() &&
        lastActivityDate.getFullYear() === yesterday.getFullYear() &&
        now.getHours() >= 18
      ) {
        return true;
      }
      
      return false;
    };
    
    // Check every hour if streak is at risk
    const checkInterval = setInterval(() => {
      if (checkStreakRisk() && currentStreak >= 2) {
        setOpen(true);
        
        // Also add a notification
        addNotification({
          title: "Streak at risk!",
          message: `Complete a lesson today to maintain your ${currentStreak}-day streak.`,
          type: "streak",
          priority: "high",
          link: "/daily-question",
          icon: "flame"
        });
      }
    }, 3600000); // check every hour
    
    // Initial check
    if (checkStreakRisk() && currentStreak >= 2) {
      setOpen(true);
    }
    
    return () => clearInterval(checkInterval);
  }, [currentStreak, lastActivity, addNotification]);
  
  const handleStartLesson = () => {
    navigate('/daily-question');
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <DialogTitle className="text-center text-xl">Streak at Risk!</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Flame className="h-10 w-10 text-orange-500" />
              <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {currentStreak}
              </span>
            </div>
          </div>
          <p className="mb-1 font-medium">Your {currentStreak}-day streak is about to end!</p>
          <p className="text-muted-foreground">
            Complete at least one activity today to keep your streak going.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Streak will reset at midnight</span>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handleStartLesson} className="w-full">
            Complete Daily Question
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
            Remind Me Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StreakWarning;
