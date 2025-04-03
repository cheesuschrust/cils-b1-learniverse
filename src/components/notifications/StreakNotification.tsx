
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Calendar, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface StreakNotificationProps {
  streak: number;
  onClose: () => void;
  isStreak100?: boolean; // Special treatment for 100-day streak
  isComboStreak?: boolean; // E.g., "Perfect Week" (7 days without mistakes)
  lastUpdateDate?: Date;
  className?: string;
  autoCloseDelay?: number;
}

const StreakNotification: React.FC<StreakNotificationProps> = ({
  streak,
  isStreak100,
  isComboStreak,
  lastUpdateDate,
  onClose,
  className,
  autoCloseDelay = 8000,
}) => {
  const [visible, setVisible] = useState(true);

  // Auto close after delay
  useEffect(() => {
    if (autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Allow time for exit animation
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoCloseDelay, onClose]);

  // Handle manual close
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Allow time for exit animation
  };

  // Get streak title
  const getStreakTitle = () => {
    if (isStreak100) return "Incredible Achievement!";
    if (isComboStreak) return "Perfect Streak!";
    
    if (streak >= 100) return "Legendary Streak!";
    if (streak >= 30) return "Monthly Master!";
    if (streak >= 7) return "Weekly Warrior!";
    return "Streak Milestone!";
  };

  // Get streak icon
  const getStreakIcon = () => {
    if (isStreak100 || streak >= 100) return <Trophy className="h-10 w-10 text-amber-500" />;
    if (isComboStreak) return <Star className="h-10 w-10 text-indigo-500" />;
    return <Flame className="h-10 w-10 text-orange-500" />;
  };

  // Get streak color
  const getStreakColor = () => {
    if (isStreak100 || streak >= 100) return "bg-amber-50 border-amber-200";
    if (isComboStreak) return "bg-indigo-50 border-indigo-200";
    if (streak >= 30) return "bg-orange-50 border-orange-200";
    if (streak >= 7) return "bg-orange-50 border-orange-200";
    return "bg-orange-50 border-orange-200";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed bottom-4 right-4 z-50 w-80 rounded-lg border overflow-hidden shadow-lg",
            getStreakColor(),
            className
          )}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-3"
              >
                {getStreakIcon()}
              </motion.div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full -mr-2 -mt-2"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <h3 className="font-bold text-xl mb-1">{getStreakTitle()}</h3>
            <p className="font-medium text-lg mb-2">{streak} Day Streak</p>
            
            <p className="text-sm text-muted-foreground mb-4">
              {isComboStreak
                ? "You've completed daily practice without mistakes for a week. Amazing discipline!"
                : `You've been consistent for ${streak} days. Keep up the great work!`
              }
            </p>
            
            {lastUpdateDate && (
              <div className="flex items-center text-xs text-muted-foreground mb-4">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Last activity: {formatDistanceToNow(lastUpdateDate, { addSuffix: true })}</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                Dismiss
              </Button>
              <Button 
                size="sm" 
                asChild
                className={isStreak100 || streak >= 100 ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                <Link to="/daily-question">
                  Keep Going
                </Link>
              </Button>
            </div>
          </div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: autoCloseDelay / 1000, ease: "linear" }}
            style={{ originX: 0 }}
            className="h-1 bg-gradient-to-r from-primary to-primary/50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakNotification;
