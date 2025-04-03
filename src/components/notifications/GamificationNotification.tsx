
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Achievement, Level } from '@/types/gamification';
import { Link } from 'react-router-dom';

interface GamificationNotificationProps {
  type: 'achievement' | 'level' | 'streak';
  data: Achievement | { oldLevel: number; newLevel: number; levelDetails?: Level } | { streak: number };
  onClose: () => void;
  autoCloseDelay?: number;
}

const GamificationNotification: React.FC<GamificationNotificationProps> = ({
  type,
  data,
  onClose,
  autoCloseDelay = 5000,
}) => {
  const [visible, setVisible] = useState(true);

  // Auto close after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow time for exit animation
    }, autoCloseDelay);
    
    return () => clearTimeout(timer);
  }, [autoCloseDelay, onClose]);

  const renderContent = () => {
    switch (type) {
      case 'achievement':
        const achievement = data as Achievement;
        return (
          <div className="flex flex-col items-center p-4">
            <div className="bg-amber-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="font-bold text-xl mb-1">Achievement Unlocked!</h3>
            <p className="font-medium text-lg mb-2">{achievement.title}</p>
            <p className="text-muted-foreground text-sm mb-4">{achievement.description}</p>
            <p className="text-primary font-semibold">+{achievement.points} XP</p>
            
            <div className="mt-4 space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setVisible(false);
                  setTimeout(onClose, 300);
                }}
              >
                Dismiss
              </Button>
              <Button size="sm" asChild>
                <Link to="/achievements">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        );
        
      case 'level':
        const levelData = data as { oldLevel: number; newLevel: number; levelDetails?: Level };
        return (
          <div className="flex flex-col items-center p-4">
            <div className="bg-indigo-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="font-bold text-xl mb-1">Level Up!</h3>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-lg opacity-70">Level {levelData.oldLevel}</span>
              <ArrowRight className="h-4 w-4" />
              <span className="text-lg font-bold">Level {levelData.newLevel}</span>
            </div>
            {levelData.levelDetails?.title && (
              <p className="text-primary font-medium mb-4">
                You're now a "{levelData.levelDetails.title}"!
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              Keep learning to unlock more features and achievements.
            </p>
            
            <div className="mt-4 space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setVisible(false);
                  setTimeout(onClose, 300);
                }}
              >
                Dismiss
              </Button>
              <Button size="sm" asChild>
                <Link to="/profile">
                  View Profile <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        );
        
      case 'streak':
        const streakData = data as { streak: number };
        return (
          <div className="flex flex-col items-center p-4">
            <div className="bg-orange-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="font-bold text-xl mb-1">Streak Milestone!</h3>
            <p className="font-medium text-lg mb-2">{streakData.streak} Day Streak</p>
            <p className="text-muted-foreground text-sm mb-4">
              You've been consistent for {streakData.streak} days. Amazing work!
            </p>
            
            <div className="mt-4 space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setVisible(false);
                  setTimeout(onClose, 300);
                }}
              >
                Dismiss
              </Button>
              <Button size="sm" asChild>
                <Link to="/daily-question">
                  Practice Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50 w-80 bg-background shadow-xl rounded-lg border overflow-hidden"
        >
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GamificationNotification;
