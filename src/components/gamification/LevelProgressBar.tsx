
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { calculateLevelProgress } from '@/lib/learning-utils';
import { cn } from '@/lib/utils';
import LevelBadge from './LevelBadge';

interface LevelProgressBarProps {
  currentXP?: number;
  requiredXP?: number;
  levelXP?: number;
  nextLevelXP?: number;
  level?: number;
  showLevel?: boolean;
  className?: string;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  currentXP,
  requiredXP,
  levelXP,
  nextLevelXP,
  level,
  showLevel = true,
  className
}) => {
  const { getCurrentXP, getUserLevel } = useGamificationContext();
  
  // Use context values if props not provided
  const xp = currentXP !== undefined ? currentXP : getCurrentXP();
  const currentLevel = level !== undefined ? level : getUserLevel();
  
  // Calculate progress percentage
  const progress = React.useMemo(() => {
    if (requiredXP && levelXP && nextLevelXP) {
      const xpForLevel = xp - levelXP;
      const xpNeeded = nextLevelXP - levelXP;
      return Math.min(100, Math.round((xpForLevel / xpNeeded) * 100));
    }
    
    // Use utility function if we don't have all the XP values
    const { progress } = calculateLevelProgress(xp);
    return progress;
  }, [xp, requiredXP, levelXP, nextLevelXP]);
  
  // Get XP values for display
  const { currentLevelXP, nextLevelXP: calculatedNextLevelXP } = calculateLevelProgress(xp);
  const displayNextLevelXP = nextLevelXP || calculatedNextLevelXP;
  const remaining = displayNextLevelXP - xp;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {showLevel && (
          <LevelBadge level={currentLevel} showInfo />
        )}
        
        <div className="text-sm text-muted-foreground">
          {xp.toLocaleString()} / {displayNextLevelXP.toLocaleString()} XP
        </div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="text-xs text-muted-foreground text-right">
        {remaining.toLocaleString()} XP to level {currentLevel + 1}
      </div>
    </div>
  );
};

export default LevelProgressBar;
