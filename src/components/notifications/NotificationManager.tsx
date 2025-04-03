
import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useGamificationContext } from '@/contexts/GamificationContext';
import GamificationNotification from './GamificationNotification';
import ReminderManager from '@/components/reminders/ReminderManager';
import StreakWarning from './StreakWarning';
import { Button } from '@/components/ui/button';
import { Bell, Clock } from 'lucide-react';

const NotificationManager: React.FC = () => {
  const [showReminderManager, setShowReminderManager] = useState(false);
  const [gamificationNotification, setGamificationNotification] = useState<{
    type: 'achievement' | 'level' | 'streak';
    data: any;
  } | null>(null);

  const { unreadCount } = useNotifications();
  
  // Set up gamification context hooks
  const originalShowAchievement = useGamificationContext().showAchievementUnlock;
  const originalShowLevelUp = useGamificationContext().showLevelUp;
  
  // Override the showAchievementUnlock function to display our custom notification
  useEffect(() => {
    useGamificationContext().showAchievementUnlock = (achievement) => {
      // Call original function first
      originalShowAchievement(achievement);
      
      // Then show our custom notification
      setGamificationNotification({
        type: 'achievement',
        data: achievement
      });
    };
    
    // Override the showLevelUp function
    useGamificationContext().showLevelUp = (oldLevel, newLevel) => {
      // Call original function first
      originalShowLevelUp(oldLevel, newLevel);
      
      // Then show our custom notification
      setGamificationNotification({
        type: 'level',
        data: { oldLevel, newLevel }
      });
    };
    
    // Clean up overrides when component unmounts
    return () => {
      useGamificationContext().showAchievementUnlock = originalShowAchievement;
      useGamificationContext().showLevelUp = originalShowLevelUp;
    };
  }, [originalShowAchievement, originalShowLevelUp]);

  return (
    <>
      {/* Display streak warning when needed */}
      <StreakWarning />
      
      {/* Floating button for creating reminders */}
      <div className="fixed bottom-4 left-4 z-30">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full px-4 shadow-md"
          onClick={() => setShowReminderManager(true)}
        >
          <Clock className="h-4 w-4" />
          <span>Set Reminder</span>
        </Button>
      </div>
      
      {/* Reminder manager dialog */}
      <ReminderManager 
        open={showReminderManager} 
        onOpenChange={setShowReminderManager} 
      />
      
      {/* Gamification notifications (achievements, level ups, etc.) */}
      {gamificationNotification && (
        <GamificationNotification
          type={gamificationNotification.type}
          data={gamificationNotification.data}
          onClose={() => setGamificationNotification(null)}
          autoCloseDelay={6000}
        />
      )}
    </>
  );
};

export default NotificationManager;
