
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LevelBadgeProps } from '@/types';

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  showInfo = false,
  size = 'default'
}) => {
  // Define badge colors and titles based on level
  const getLevelData = (level: number) => {
    if (level <= 3) {
      return { color: 'default', title: 'Beginner', variant: 'default' };
    } else if (level <= 6) {
      return { color: 'info', title: 'Intermediate', variant: 'info' };
    } else if (level <= 9) {
      return { color: 'success', title: 'Advanced', variant: 'success' };
    } else if (level <= 12) {
      return { color: 'warning', title: 'Expert', variant: 'warning' };
    } else {
      return { color: 'citizenship', title: 'Master', variant: 'citizenship' };
    }
  };

  const { title, variant } = getLevelData(level);
  
  // Convert numeric level to string with proper formatting
  const formattedLevel = level.toString();
  
  const renderBadge = () => (
    <Badge 
      variant={variant as any} 
      className="font-bold"
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
    >
      {showInfo ? `${title} (Lvl ${formattedLevel})` : `Lvl ${formattedLevel}`}
    </Badge>
  );
  
  // If showInfo is false and we're not in compact mode, wrap in tooltip
  if (!showInfo) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderBadge()}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">{title} Level</p>
            <p className="text-xs text-muted-foreground">Level {formattedLevel}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return renderBadge();
};

export default LevelBadge;
