
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertTriangle, AlertCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number;
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted';
}

/**
 * A component that visually indicates the confidence level of an AI prediction or task.
 * It shows a colored badge and/or progress bar with optional tooltip explanation.
 */
const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  showLabel = false,
  showTooltip = true,
  size = 'md',
  variant = 'default'
}) => {
  // Helper function to determine confidence level
  const getConfidenceLevel = () => {
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };
  
  // Helper function to get badge styling based on confidence level
  const getBadgeVariant = () => {
    const level = getConfidenceLevel();
    
    if (variant === 'muted') {
      if (level === 'high') return 'outline';
      if (level === 'medium') return 'outline';
      return 'outline';
    }
    
    if (level === 'high') return 'default';
    if (level === 'medium') return 'secondary';
    return 'destructive';
  };
  
  // Helper function to get the appropriate icon
  const getIcon = () => {
    const level = getConfidenceLevel();
    
    if (level === 'high') return <Zap className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />;
    if (level === 'medium') return <AlertCircle className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />;
    return <AlertTriangle className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />;
  };
  
  // Get tooltip content based on confidence level
  const getTooltipContent = () => {
    const level = getConfidenceLevel();
    
    if (level === 'high') {
      return "High confidence: The AI system is very confident in this result.";
    } else if (level === 'medium') {
      return "Medium confidence: The AI system is moderately confident in this result.";
    } else {
      return "Low confidence: The AI system has low confidence in this result. Consider reviewing manually.";
    }
  };
  
  // Render badge or progress bar based on size
  const renderIndicator = () => {
    if (size === 'lg') {
      return (
        <div className="space-y-1">
          {showLabel && (
            <div className="flex justify-between items-center text-sm">
              <span>AI Confidence</span>
              <span className="font-medium">{Math.round(score)}%</span>
            </div>
          )}
          <Progress value={score} className="h-2" />
        </div>
      );
    }
    
    return (
      <Badge
        variant={getBadgeVariant()}
        className={`${size === 'sm' ? 'text-xs py-0 px-1' : ''} flex items-center`}
      >
        {getIcon()}
        {Math.round(score)}%
      </Badge>
    );
  };
  
  // Wrap in tooltip if needed
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">{renderIndicator()}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return renderIndicator();
};

export default ConfidenceIndicator;
