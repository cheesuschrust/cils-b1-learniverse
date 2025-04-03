
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/gamification';
import AchievementNotification from './AchievementNotification';
import LevelUpNotification from './LevelUpNotification';
import StreakMilestoneNotification from './StreakMilestoneNotification';

interface GamificationNotificationProps {
  type: 'achievement' | 'level' | 'streak';
  data: any;
  onClose: () => void;
  autoCloseDelay?: number;
}

const GamificationNotification: React.FC<GamificationNotificationProps> = ({
  type,
  data,
  onClose,
  autoCloseDelay = 8000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, autoCloseDelay);
    
    return () => clearTimeout(timer);
  }, [autoCloseDelay, onClose]);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 300, 
              damping: 20 
            }}
          >
            {type === 'achievement' && (
              <AchievementNotification 
                achievement={data as Achievement} 
                onClose={() => setIsVisible(false)}
              />
            )}
            
            {type === 'level' && (
              <LevelUpNotification 
                oldLevel={data.oldLevel}
                newLevel={data.newLevel}
                onClose={() => setIsVisible(false)}
              />
            )}
            
            {type === 'streak' && (
              <StreakMilestoneNotification
                days={data.days}
                onClose={() => setIsVisible(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamificationNotification;
