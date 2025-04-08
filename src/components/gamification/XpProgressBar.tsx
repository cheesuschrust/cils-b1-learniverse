
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { calculateLevelProgress } from '@/lib/learning-utils';

interface XpProgressBarProps {
  className?: string;
  showDetails?: boolean;
}

const XpProgressBar: React.FC<XpProgressBarProps> = ({ 
  className,
  showDetails = true
}) => {
  const { getCurrentXP } = useGamificationContext();
  const currentXP = getCurrentXP();
  
  const { level, currentLevelXP, nextLevelXP, progress } = calculateLevelProgress(currentXP);
  
  return (
    <div className={`space-y-1 ${className}`}>
      <Progress value={progress} className="h-2" />
      
      {showDetails && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>{currentXP.toLocaleString()} XP</div>
          <div>{(nextLevelXP - currentXP).toLocaleString()} XP to level {level + 1}</div>
        </div>
      )}
    </div>
  );
};

export default XpProgressBar;
