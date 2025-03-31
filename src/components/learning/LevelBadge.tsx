
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LevelBadgeProps } from '@/types';

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  showInfo = true,
  size = 'md',
}) => {
  const getLevelName = (level: number): string => {
    switch (level) {
      case 0: return 'Beginner';
      case 1: return 'Elementary';
      case 2: return 'Pre-Intermediate';
      case 3: return 'Intermediate';
      case 4: return 'Upper-Intermediate';
      case 5: return 'Advanced';
      default: return `Level ${level}`;
    }
  };
  
  const getLevelVariant = (level: number): 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' => {
    switch (level) {
      case 0: return 'outline';
      case 1: return 'secondary';
      case 2: return 'default';
      case 3: return 'info';
      case 4: return 'warning';
      case 5: return 'success';
      default: return 'outline';
    }
  };
  
  const getLevelDescription = (level: number): string => {
    switch (level) {
      case 0: return 'Basic vocabulary and simple phrases. A1 level.';
      case 1: return 'Elementary grammar and everyday expressions. A2 level.';
      case 2: return 'Basic conversation on familiar topics. B1 level.';
      case 3: return 'Clear expression on a wide range of subjects. B2 level.';
      case 4: return 'Effective language use for social and professional purposes. C1 level.';
      case 5: return 'Near-native proficiency. C2 level.';
      default: return 'Custom difficulty level';
    }
  };
  
  const getSizeClass = (): string => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-0.5';
      case 'lg': return 'text-sm px-3 py-1';
      case 'md':
      default: return 'text-xs px-2.5 py-0.5';
    }
  };
  
  const badge = (
    <Badge
      variant={getLevelVariant(level)}
      className={`${getSizeClass()} font-medium`}
    >
      {getLevelName(level)}
    </Badge>
  );
  
  if (showInfo) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{getLevelDescription(level)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return badge;
};

export default LevelBadge;
