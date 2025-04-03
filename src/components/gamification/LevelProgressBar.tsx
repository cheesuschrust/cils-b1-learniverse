
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LevelProgressBarProps {
  currentXP: number;
  levelXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  currentXP,
  levelXP,
  nextLevelXP,
  level,
  className
}) => {
  // Calculate progress percentage
  const progressValue = Math.min(
    Math.round(((currentXP - levelXP) / (nextLevelXP - levelXP)) * 100),
    100
  );
  
  // Calculate remaining XP to next level
  const remainingXP = nextLevelXP - currentXP;
  
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold">
            {level}
          </div>
          <span className="font-medium">Level {level}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {remainingXP > 0 ? `${remainingXP} XP to Level ${level + 1}` : "Max level reached!"}
        </div>
      </div>
      
      <div className="space-y-1">
        <Progress value={progressValue} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentXP - levelXP} XP</span>
          <span>{nextLevelXP - levelXP} XP</span>
        </div>
      </div>
      
      <div className="text-xs text-center mt-2 text-muted-foreground">
        {progressValue}% complete
      </div>
    </Card>
  );
};

export default LevelProgressBar;
