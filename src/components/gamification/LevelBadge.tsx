
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  showInfo?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  showInfo = false,
  size = 'default',
  className
}) => {
  const { getUserLevel } = useGamificationContext();
  const level = getUserLevel();
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    default: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };
  
  const badge = (
    <div className={cn(
      "rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center font-bold text-white",
      sizeClasses[size],
      className
    )}>
      {level}
    </div>
  );
  
  if (!showInfo) {
    return badge;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-sm">
            <p className="font-semibold">Level {level}</p>
            <p className="text-xs text-muted-foreground">Keep learning to level up!</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LevelBadge;
