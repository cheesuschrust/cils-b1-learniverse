
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LevelBadgeProps } from '@/types';

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  showInfo = false,
  size = "default"
}) => {
  // Determine badge color based on level
  const getBadgeVariant = (level: number) => {
    if (level <= 3) return "default";
    if (level <= 6) return "secondary";
    if (level <= 9) return "info";
    if (level <= 12) return "success";
    return "citizenship";
  };

  // Get level title
  const getLevelTitle = (level: number) => {
    if (level <= 3) return "Beginner";
    if (level <= 6) return "Intermediate";
    if (level <= 9) return "Advanced";
    if (level <= 12) return "Expert";
    return "Master";
  };

  const levelInfo = {
    title: getLevelTitle(level),
    description: `Level ${level} - ${getLevelTitle(level)}`,
    benefits: [
      "Access to level-specific content",
      `${level * 10}% bonus points on exercises`,
      `${level > 5 ? 'Advanced' : 'Basic'} practice options`
    ]
  };

  const badge = (
    <Badge 
      variant={getBadgeVariant(level)} 
      className={`font-bold ${size === "sm" ? "text-xs px-2" : size === "lg" ? "text-sm px-3 py-1" : ""}`}
    >
      {`L${level}`}
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
        <TooltipContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-bold">{levelInfo.title}</h4>
            <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
            <div className="pt-1">
              <h5 className="text-xs font-semibold mb-1">Benefits:</h5>
              <ul className="text-xs list-disc pl-4 space-y-1">
                {levelInfo.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { LevelBadge };
