
import React from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPPointsDisplayProps {
  xp: number;
  xpToday?: number;
  showTodayXP?: boolean;
  className?: string;
}

const XPPointsDisplay: React.FC<XPPointsDisplayProps> = ({
  xp,
  xpToday = 0,
  showTodayXP = false,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Award className="h-5 w-5 text-amber-500" />
      <span className="font-medium">{xp.toLocaleString()} XP</span>
      
      {showTodayXP && xpToday > 0 && (
        <div className="flex items-center ml-2 text-sm text-green-600 dark:text-green-400">
          <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
          <span>+{xpToday} today</span>
        </div>
      )}
    </div>
  );
};

export default XPPointsDisplay;
