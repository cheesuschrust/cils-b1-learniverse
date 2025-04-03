
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Calendar, Flame, Award, CheckCircle2 } from 'lucide-react';
import { Achievement } from '@/types/gamification';
import { motion } from 'framer-motion';

interface AchievementUnlockedProps {
  achievement: Achievement;
  onComplete: () => void;
  autoHideDuration?: number;
}

const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({
  achievement,
  onComplete,
  autoHideDuration = 5000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, autoHideDuration);
    
    return () => clearTimeout(timer);
  }, [onComplete, autoHideDuration]);
  
  const getIcon = () => {
    switch (achievement.icon) {
      case 'trophy':
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 'star':
        return <Star className="h-8 w-8 text-yellow-500" />;
      case 'flame':
        return <Flame className="h-8 w-8 text-orange-500" />;
      case 'calendar':
        return <Calendar className="h-8 w-8 text-blue-500" />;
      case 'award':
        return <Award className="h-8 w-8 text-purple-500" />;
      case 'badge':
        return <Award className="h-8 w-8 text-emerald-500" />;
      case 'check-circle':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      default:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
    }
  };
  
  const getCategoryColor = () => {
    switch (achievement.category) {
      case 'streak':
        return 'border-orange-500 bg-orange-100 text-orange-700';
      case 'mastery':
        return 'border-purple-500 bg-purple-100 text-purple-700';
      case 'learning':
        return 'border-green-500 bg-green-100 text-green-700';
      case 'challenge':
        return 'border-blue-500 bg-blue-100 text-blue-700';
      default:
        return 'border-yellow-500 bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 max-w-sm"
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className={`border-2 ${getCategoryColor()} p-4 shadow-lg overflow-hidden`}>
        <div className="flex items-start gap-4">
          <div className="bg-white rounded-full p-2 shadow">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                className="text-yellow-500 mr-2"
              >
                <Star className="h-5 w-5 inline fill-yellow-400" />
              </motion.div>
              <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            </div>
            <h4 className="font-semibold">{achievement.title}</h4>
            <p className="text-sm mt-1">{achievement.description}</p>
            
            <div className="flex items-center mt-2 text-sm">
              <span className="font-medium">+{achievement.points} XP</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground capitalize">{achievement.category}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AchievementUnlocked;
