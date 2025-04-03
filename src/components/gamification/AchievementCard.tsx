
import React from 'react';
import { Award, Trophy, Star, Zap, Check, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types/gamification';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked?: boolean;
  progress?: number;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  unlocked = false,
  progress = 0,
  className
}) => {
  // Get icon based on achievement category
  const getIcon = () => {
    switch (achievement.category) {
      case 'learning':
        return <Star className={cn("h-5 w-5", unlocked ? "text-amber-500" : "text-muted-foreground")} />;
      case 'streak':
        return <Zap className={cn("h-5 w-5", unlocked ? "text-orange-500" : "text-muted-foreground")} />;
      case 'mastery':
        return <Trophy className={cn("h-5 w-5", unlocked ? "text-indigo-500" : "text-muted-foreground")} />;
      case 'social':
        return <Check className={cn("h-5 w-5", unlocked ? "text-green-500" : "text-muted-foreground")} />;
      default:
        return <Award className={cn("h-5 w-5", unlocked ? "text-primary" : "text-muted-foreground")} />;
    }
  };

  // Determine the color style based on the achievement category
  const getCategoryColor = () => {
    if (!unlocked) return "bg-muted text-muted-foreground";
    
    switch (achievement.category) {
      case 'learning':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case 'streak':
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case 'mastery':
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case 'social':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Card className={cn("relative overflow-hidden transition-all", 
      unlocked ? "border-primary/20" : "border-muted-foreground/20 opacity-80",
      className
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className={cn(
            "p-2 rounded-lg",
            unlocked ? getCategoryColor() : "bg-muted"
          )}>
            {getIcon()}
          </div>
          <div className="flex items-center space-x-2">
            {unlocked && (
              <Badge variant="outline" className="bg-primary/10">+{achievement.points} XP</Badge>
            )}
            {!unlocked && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <div>
          <h3 className={cn(
            "font-medium",
            !unlocked && "text-muted-foreground"
          )}>
            {achievement.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {achievement.description}
          </p>
        </div>
        
        {!unlocked && progress > 0 && progress < 100 && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
