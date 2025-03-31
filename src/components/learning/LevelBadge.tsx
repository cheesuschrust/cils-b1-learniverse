
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { LevelBadgeProps } from '@/types';

/**
 * A badge component that displays Italian language level with optional info tooltip
 */
const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  showInfo = true,
  size = 'md'
}) => {
  // Get variant based on level
  const getVariant = (level: string) => {
    const normalizedLevel = level.toLowerCase();
    
    if (normalizedLevel.includes('a1') || normalizedLevel.includes('beginner')) {
      return 'default';
    } else if (normalizedLevel.includes('a2') || normalizedLevel.includes('elementary')) {
      return 'secondary';
    } else if (normalizedLevel.includes('b1') || normalizedLevel.includes('intermediate')) {
      return 'outline'; 
    } else if (normalizedLevel.includes('b2') || normalizedLevel.includes('upper')) {
      return 'destructive';
    } else if (normalizedLevel.includes('c1') || normalizedLevel.includes('advanced')) {
      return 'success';
    } else if (normalizedLevel.includes('c2') || normalizedLevel.includes('proficient')) {
      return 'warning';
    } else if (normalizedLevel.includes('native') || normalizedLevel.includes('fluent')) {
      return 'default';
    }
    
    return 'secondary';
  };
  
  // Get tooltip description based on level
  const getDescription = (level: string) => {
    const normalizedLevel = level.toLowerCase();
    
    if (normalizedLevel.includes('a1') || normalizedLevel.includes('beginner')) {
      return 'Beginner level - Can understand basic phrases and expressions';
    } else if (normalizedLevel.includes('a2') || normalizedLevel.includes('elementary')) {
      return 'Elementary level - Can communicate in simple routine tasks';
    } else if (normalizedLevel.includes('b1') || normalizedLevel.includes('intermediate')) {
      return 'Intermediate level - Can deal with most situations while traveling';
    } else if (normalizedLevel.includes('b2') || normalizedLevel.includes('upper')) {
      return 'Upper Intermediate level - Can interact with fluency and spontaneity';
    } else if (normalizedLevel.includes('c1') || normalizedLevel.includes('advanced')) {
      return 'Advanced level - Can express ideas fluently and precisely';
    } else if (normalizedLevel.includes('c2') || normalizedLevel.includes('proficient')) {
      return 'Proficient level - Can understand with ease virtually everything heard or read';
    } else if (normalizedLevel.includes('native') || normalizedLevel.includes('fluent')) {
      return 'Native or Fluent level - Full mastery of the language';
    }
    
    return 'Level description not available';
  };
  
  // Get CEFR score based on level
  const getCefrScore = (level: string): number => {
    const normalizedLevel = level.toLowerCase();
    
    if (normalizedLevel.includes('a1') || normalizedLevel.includes('beginner')) return 1;
    if (normalizedLevel.includes('a2') || normalizedLevel.includes('elementary')) return 2;
    if (normalizedLevel.includes('b1') || normalizedLevel.includes('intermediate')) return 3;
    if (normalizedLevel.includes('b2') || normalizedLevel.includes('upper')) return 4;
    if (normalizedLevel.includes('c1') || normalizedLevel.includes('advanced')) return 5;
    if (normalizedLevel.includes('c2') || normalizedLevel.includes('proficient')) return 6;
    if (normalizedLevel.includes('native') || normalizedLevel.includes('fluent')) return 7;
    
    // Try to parse a number if the level is just a numeric value
    const numberMatch = level.match(/\d+/);
    if (numberMatch) {
      return parseInt(numberMatch[0], 10);
    }
    
    return 0;
  };
  
  // Get size class based on the size prop
  const getSizeClass = (size: string): string => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-0.5';
      case 'lg': return 'text-base px-4 py-1.5';
      case 'md':
      default:
        return 'text-sm px-3 py-1';
    }
  };
  
  const badge = (
    <Badge 
      variant={getVariant(level)}
      className={getSizeClass(size)}
    >
      {level}
    </Badge>
  );
  
  if (showInfo) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm">
            <p>{getDescription(level)}</p>
            <p className="mt-1 text-xs opacity-80">CEFR Score: {getCefrScore(level)}/7</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return badge;
};

export default LevelBadge;
