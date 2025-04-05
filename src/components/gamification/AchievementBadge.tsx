
import React from 'react';
import { cn } from '@/lib/utils';
import { Star, Trophy, Award, Check, CheckCircle, Flame } from 'lucide-react';
import { Achievement } from '@/types/achievement';
import { Badge } from '@/components/ui/badge-fixed';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showTooltip = true,
  className
}) => {
  const isUnlocked = achievement.unlocked || achievement.unlockedAt !== undefined;
  
  // Get appropriate icon based on achievement category and id
  const renderIcon = () => {
    switch (achievement.icon) {
      case 'star':
        return <Star />;
      case 'trophy':
        return <Trophy />;
      case 'award':
        return <Award />;
      case 'check-circle':
        return <CheckCircle />;
      case 'flame':
        return <Flame />;
      default:
        return <Trophy />;
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-base'
  };

  // Icon size
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  // Get badge color based on category
  const getBadgeColor = () => {
    if (!isUnlocked) {
      return 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
    }
    
    switch (achievement.category) {
      case 'learning':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'streak':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'mastery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'social':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'challenge':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'special':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const badge = (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center transition-all",
        sizeClasses[size],
        getBadgeColor(),
        !isUnlocked && "opacity-60 grayscale",
        isUnlocked && "shadow-sm hover:scale-110",
        className
      )}
    >
      <div className={cn(iconSizes[size])}>
        {renderIcon()}
      </div>
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };
  
  // Calculate progress percentage
  const progressPercent = achievement.currentValue !== undefined && achievement.requiredValue
    ? Math.min(Math.round((achievement.currentValue / achievement.requiredValue) * 100), 100)
    : 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="p-0 overflow-hidden">
          <div className="flex flex-col w-64">
            <div className={cn(
              "px-4 py-2",
              isUnlocked ? getBadgeColor() : "bg-gray-200 dark:bg-gray-800"
            )}>
              <div className="font-bold">{achievement.title || achievement.name}</div>
              <div className="text-xs">{achievement.description}</div>
            </div>
            
            <div className="p-4 bg-background">
              {isUnlocked ? (
                <div className="text-xs flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="success" className="absolute -top-1 -right-1 bg-green-500 hover:bg-green-600">
                      <span>Unlocked</span>
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Earned:</span>
                    <span>{formatDate(achievement.unlockedAt || achievement.earnedAt || achievement.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XP Awarded:</span>
                    <span>+{achievement.points || 0}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0">Locked</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span>{achievement.currentValue || 0}/{achievement.requiredValue || achievement.threshold} ({progressPercent}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XP Reward:</span>
                    <span>+{achievement.points || 5}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
