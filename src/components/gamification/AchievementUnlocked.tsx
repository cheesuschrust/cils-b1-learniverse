
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/gamification';
import { Trophy, Star, Award, CheckCircle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementUnlockedProps {
  achievement: Achievement;
  onComplete: () => void;
  className?: string;
}

const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({
  achievement,
  onComplete,
  className
}) => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500); // Allow exit animation to complete
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  // Render appropriate icon based on achievement
  const renderIcon = () => {
    switch (achievement.icon) {
      case 'trophy':
        return <Trophy className="h-10 w-10 text-white" />;
      case 'star':
        return <Star className="h-10 w-10 text-white" />;
      case 'award':
        return <Award className="h-10 w-10 text-white" />;
      case 'check-circle':
        return <CheckCircle className="h-10 w-10 text-white" />;
      case 'flame':
        return <Flame className="h-10 w-10 text-white" />;
      default:
        return <Trophy className="h-10 w-10 text-white" />;
    }
  };
  
  // Get gradient colors based on achievement category
  const getGradient = () => {
    switch (achievement.category) {
      case 'learning':
        return 'from-green-400 to-green-600';
      case 'streak':
        return 'from-orange-400 to-orange-600';
      case 'mastery':
        return 'from-purple-400 to-purple-600';
      case 'social':
        return 'from-blue-400 to-blue-600';
      case 'challenge':
        return 'from-yellow-400 to-yellow-600';
      case 'special':
        return 'from-red-400 to-red-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={cn(
            "fixed top-16 right-4 z-50 max-w-sm shadow-lg rounded-lg overflow-hidden",
            className
          )}
        >
          <div className="flex">
            <div className={cn(
              "w-20 flex items-center justify-center bg-gradient-to-br p-4",
              getGradient()
            )}>
              {renderIcon()}
            </div>
            
            <div className="flex-1 bg-white dark:bg-gray-800 p-4">
              <div className="font-bold text-lg mb-1">Achievement Unlocked!</div>
              <div className="font-medium">{achievement.title}</div>
              <div className="text-sm text-muted-foreground">{achievement.description}</div>
              <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                +{achievement.points} XP
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementUnlocked;
