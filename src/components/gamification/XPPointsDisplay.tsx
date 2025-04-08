
import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center space-x-1 px-2 py-1 bg-primary/10 rounded-md",
            className
          )}>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{xp.toLocaleString()}</span>
            
            {showTodayXP && xpToday > 0 && (
              <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3 ml-1 mr-0.5" />
                <span>+{xpToday}</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="space-y-1">
            <div className="font-medium">Experience Points (XP)</div>
            <div className="text-xs text-muted-foreground">
              XP tracks your learning progress. Earn XP by completing activities.
            </div>
            {showTodayXP && (
              <div className="text-xs pt-1">
                <span className="text-muted-foreground">Today's XP: </span>
                <span className="font-medium text-green-600 dark:text-green-400">+{xpToday}</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default XPPointsDisplay;
