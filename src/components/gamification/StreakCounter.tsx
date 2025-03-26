
import React from 'react';
import { useGamification } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  className?: string;
  showLabel?: boolean;
}

const StreakCounter: React.FC<StreakCounterProps> = ({
  className,
  showLabel = true
}) => {
  const { gamification } = useGamification();
  
  if (!gamification) {
    return null;
  }

  const streak = gamification.streakDays || 0;
  
  // Determine appearance based on streak length
  const getStreakStyle = () => {
    if (streak === 0) return "text-gray-500";
    if (streak < 3) return "text-blue-500";
    if (streak < 7) return "text-green-500";
    if (streak < 30) return "text-yellow-500";
    if (streak < 100) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className={cn(
      "flex items-center gap-1",
      getStreakStyle(),
      className
    )}>
      <Flame className={cn(
        "h-4 w-4",
        streak >= 7 ? "animate-pulse" : ""
      )} />
      <span className="font-medium">{streak}</span>
      {showLabel && <span className="text-xs text-muted-foreground ml-1">day streak</span>}
    </div>
  );
};

export default StreakCounter;
