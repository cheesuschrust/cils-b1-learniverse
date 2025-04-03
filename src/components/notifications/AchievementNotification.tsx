
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Zap, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Achievement } from '@/types/gamification';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  className?: string;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  className,
}) => {
  // Get icon based on achievement category
  const getIcon = () => {
    switch (achievement.category) {
      case 'learning':
        return <Star className="h-8 w-8 text-amber-500" />;
      case 'streak':
        return <Zap className="h-8 w-8 text-orange-500" />;
      case 'mastery':
        return <Trophy className="h-8 w-8 text-indigo-500" />;
      case 'social':
        return <Check className="h-8 w-8 text-green-500" />;
      default:
        return <Award className="h-8 w-8 text-primary" />;
    }
  };

  // Get background color based on achievement category
  const getBgColor = () => {
    switch (achievement.category) {
      case 'learning':
        return 'bg-amber-50 border-amber-200';
      case 'streak':
        return 'bg-orange-50 border-orange-200';
      case 'mastery':
        return 'bg-indigo-50 border-indigo-200';
      case 'social':
        return 'bg-green-50 border-green-200';
      case 'challenge':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-background border-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-full md:w-80 rounded-lg shadow-lg overflow-hidden border",
        getBgColor(),
        className
      )}
    >
      <div className="p-4 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full flex items-center justify-center mb-3 bg-opacity-20" style={{ backgroundColor: 'currentColor' }}>
          {getIcon()}
        </div>
        
        <h3 className="font-bold text-xl">Achievement Unlocked!</h3>
        <p className="font-medium text-lg mt-1">{achievement.title}</p>
        <p className="text-muted-foreground text-sm mt-2 mb-3">{achievement.description}</p>
        
        <div className="bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary">
          +{achievement.points} XP
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          <Button size="sm" asChild>
            <Link to="/achievements">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementNotification;
