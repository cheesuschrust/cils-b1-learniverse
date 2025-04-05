
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge-fixed';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LevelBadgeProps } from '@/types/achievement';

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, showInfo = false, size = 'default' }) => {
  const getBadgeColor = (lvl: number) => {
    if (lvl < 5) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (lvl < 10) return 'bg-green-100 text-green-800 border-green-300';
    if (lvl < 15) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (lvl < 20) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (lvl < 25) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getBadgeTitle = (lvl: number) => {
    if (lvl < 5) return 'Beginner';
    if (lvl < 10) return 'Intermediate';
    if (lvl < 15) return 'Advanced';
    if (lvl < 20) return 'Expert';
    if (lvl < 25) return 'Master';
    return 'Grandmaster';
  };

  const getBadgeSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1.5';
      default:
        return 'text-sm px-2.5 py-1';
    }
  };

  const badge = (
    <Badge 
      variant="outline" 
      className={cn(
        getBadgeColor(level),
        getBadgeSizeClass(),
        'font-semibold border-2'
      )}
      size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
    >
      {`Level ${level}`}
    </Badge>
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
        <TooltipContent className="p-0 overflow-hidden">
          <div className="flex flex-col w-64">
            <div className={cn(
              "px-4 py-2",
              getBadgeColor(level)
            )}>
              <div className="font-bold">{getBadgeTitle(level)}</div>
              <div className="text-xs">You've reached level {level}!</div>
            </div>
            <div className="p-4 bg-background text-xs space-y-2">
              <div>
                <p className="font-semibold">Level Benefits:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  {level >= 3 && <li>Access to daily challenges</li>}
                  {level >= 5 && <li>Unlock advanced grammar features</li>}
                  {level >= 10 && <li>AI pronunciation feedback</li>}
                  {level >= 15 && <li>Custom study plans</li>}
                  {level >= 20 && <li>Community features unlocked</li>}
                </ul>
              </div>
              <div>
                <p className="mt-2 text-muted-foreground">Keep learning to unlock more benefits!</p>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LevelBadge;
