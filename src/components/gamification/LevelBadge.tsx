
import React from 'react';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { getLevelInfo } from '@/lib/learning-utils';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LevelBadgeProps {
  level?: number;
  size?: 'sm' | 'default' | 'lg';
  showInfo?: boolean;
  className?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'default',
  showInfo = false,
  className
}) => {
  const { getUserLevel } = useGamificationContext();
  const currentLevel = level || getUserLevel();
  const levelInfo = getLevelInfo(currentLevel);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    default: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };
  
  // Get color based on level
  const getLevelColor = () => {
    switch (levelInfo.color) {
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'orange': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'purple': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'indigo': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'pink': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'emerald': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'amber': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  const badge = (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center font-semibold",
        sizeClasses[size],
        getLevelColor(),
        className
      )}
    >
      {currentLevel}
    </div>
  );
  
  if (!showInfo) {
    return badge;
  }
  
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2 p-1">
              <div className="font-medium">{levelInfo.title}</div>
              <div className="text-xs">Level {currentLevel}</div>
              <div className="text-xs text-muted-foreground">Next level: {levelInfo.maxXp} XP</div>
              {levelInfo.benefits.length > 0 && (
                <div className="text-xs">
                  <div className="font-medium mb-1">Level Benefits:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {levelInfo.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showInfo && (
        <div className="text-sm font-medium">
          Level {currentLevel} - {levelInfo.title}
        </div>
      )}
    </div>
  );
};

export default LevelBadge;
