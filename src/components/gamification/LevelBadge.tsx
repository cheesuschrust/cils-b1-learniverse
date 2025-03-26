
import React from 'react';
import { useGamification } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { Level } from '@/types/gamification';

interface LevelBadgeProps {
  level?: number;
  showInfo?: boolean;
  className?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  showInfo = false,
  className 
}) => {
  const { gamification, levelDetails: loadedLevelDetails } = useGamification();
  
  // Use provided level or fall back to user's current level
  const displayLevel = level || gamification?.level || 1;
  
  // Get level details for the display level
  let levelDetails: Level | null = null;
  if (displayLevel === gamification?.level && loadedLevelDetails) {
    levelDetails = loadedLevelDetails;
  } else {
    // If we're showing a different level, calculate its details
    const allLevels = Array.from({ length: 30 }, (_, i) => ({
      level: i + 1,
      minXp: Math.floor(100 * Math.pow(1.5, i)),
      maxXp: Math.floor(100 * Math.pow(1.5, i + 1)) - 1,
      title: getLevelTitle(i + 1)
    }));
    levelDetails = allLevels.find(l => l.level === displayLevel) || allLevels[0];
  }

  function getLevelTitle(level: number): string {
    if (level <= 5) return "Beginner";
    if (level <= 10) return "Novice";
    if (level <= 15) return "Intermediate";
    if (level <= 20) return "Advanced";
    if (level <= 25) return "Expert";
    return "Master";
  }

  // Calculate color based on level
  const getColorClass = () => {
    if (displayLevel <= 5) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (displayLevel <= 10) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (displayLevel <= 15) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (displayLevel <= 20) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    if (displayLevel <= 25) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        getColorClass()
      )}>
        <Star className="h-3 w-3" />
        <span>Lvl {displayLevel}</span>
      </div>
      
      {showInfo && levelDetails && (
        <div className="ml-2 text-xs text-muted-foreground">
          {levelDetails.title}
        </div>
      )}
    </div>
  );
};

export default LevelBadge;
