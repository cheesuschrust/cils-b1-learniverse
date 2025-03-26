
import React from 'react';
import { useGamification } from '@/hooks/useGamification';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface XpProgressBarProps {
  className?: string;
  showText?: boolean;
  compact?: boolean;
}

const XpProgressBar: React.FC<XpProgressBarProps> = ({
  className,
  showText = true,
  compact = false
}) => {
  const { gamification, levelDetails } = useGamification();
  
  if (!gamification || !levelDetails) {
    return null;
  }

  // Calculate current XP progress within the level
  const currentXp = gamification.xp;
  const { minXp, maxXp } = levelDetails;
  const levelXp = currentXp - minXp;
  const levelXpRequired = maxXp - minXp;
  const percentage = Math.min(Math.round((levelXp / levelXpRequired) * 100), 100);
  
  return (
    <div className={cn("space-y-1", className)}>
      {showText && !compact && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>XP: {currentXp}</span>
          <span>{levelXp}/{levelXpRequired} to level {gamification.level + 1}</span>
        </div>
      )}
      
      <Progress 
        value={percentage} 
        className={cn("h-2", compact ? "h-1" : "")}
      />
      
      {showText && compact && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{percentage}%</span>
          <span>{levelXp}/{levelXpRequired}</span>
        </div>
      )}
    </div>
  );
};

export default XpProgressBar;
