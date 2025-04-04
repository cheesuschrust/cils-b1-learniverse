
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';

interface UsageTrackerProps {
  feature: keyof ReturnType<typeof useFeatureLimits>['DEFAULT_LIMITS'];
  showLabel?: boolean;
  showTooltip?: boolean;
  labelPosition?: 'top' | 'side';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UsageTracker: React.FC<UsageTrackerProps> = ({
  feature,
  showLabel = true,
  showTooltip = true,
  labelPosition = 'top',
  size = 'md',
  className = '',
}) => {
  const { isPremium } = useAuth();
  const { getLimit, getUsage, DEFAULT_LIMITS, isLoading } = useFeatureLimits();
  
  if (isLoading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>;
  }
  
  const limit = getLimit(feature);
  const currentUsage = getUsage(feature);
  const usagePercentage = limit ? Math.min(100, (currentUsage / limit) * 100) : 0;
  const isUnlimited = limit === Infinity || isPremium;
  const isNearLimit = usagePercentage >= 80 && !isUnlimited;
  const isAtLimit = usagePercentage >= 100 && !isUnlimited;
  
  // Get a user-friendly feature name
  const getFeatureName = (feature: string): string => {
    switch (feature) {
      case 'flashcards':
        return 'Flashcards';
      case 'writingExercises':
        return 'Writing Exercises';
      case 'aiSuggestions':
        return 'AI Suggestions';
      case 'downloads':
        return 'Downloads';
      case 'listeningExercises':
        return 'Listening Exercises';
      case 'readingExercises':
        return 'Reading Exercises';
      case 'speakingExercises':
        return 'Speaking Exercises';
      default:
        return feature;
    }
  };

  const featureName = getFeatureName(feature);
  
  // Get size-specific styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          progressHeight: 'h-1.5',
          textSize: 'text-xs',
          containerClass: 'space-y-1',
        };
      case 'lg':
        return {
          progressHeight: 'h-3',
          textSize: 'text-sm',
          containerClass: 'space-y-3',
        };
      default: // md
        return {
          progressHeight: 'h-2',
          textSize: 'text-xs',
          containerClass: 'space-y-2',
        };
    }
  };
  
  const { progressHeight, textSize, containerClass } = getSizeStyles();

  const tooltipContent = isUnlimited
    ? `Unlimited ${featureName} with Premium`
    : `${currentUsage} of ${limit} ${featureName} used today`;

  return (
    <div className={`${containerClass} ${className}`}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between items-center">
          <div className={`font-medium ${textSize}`}>
            {featureName}
            {showTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 inline ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {!isUnlimited && (
            <div className={`${textSize} text-muted-foreground`}>
              {currentUsage}/{limit}
            </div>
          )}
          {isUnlimited && (
            <div className={`${textSize} text-primary flex items-center`}>
              <Sparkles className="h-3 w-3 mr-1" />
              Unlimited
            </div>
          )}
        </div>
      )}
      
      <div className={`flex items-center gap-2 ${labelPosition === 'side' ? 'flex-row' : 'flex-col'}`}>
        {showLabel && labelPosition === 'side' && (
          <div className={`font-medium ${textSize} min-w-24`}>
            {featureName}
          </div>
        )}
        
        <div className="flex-grow w-full">
          <Progress 
            value={isUnlimited ? 100 : usagePercentage} 
            className={`${progressHeight} ${isUnlimited ? 'bg-primary/20' : ''}`}
            indicatorClassName={
              isUnlimited 
                ? 'bg-primary/40' 
                : isAtLimit 
                  ? 'bg-destructive' 
                  : isNearLimit 
                    ? 'bg-amber-500' 
                    : 'bg-primary'
            }
          />
          
          {labelPosition === 'side' && (
            <div className="flex justify-between mt-1">
              {!isUnlimited && (
                <div className={`${textSize} text-muted-foreground`}>
                  {currentUsage}/{limit}
                </div>
              )}
              {isUnlimited && (
                <div className={`${textSize} text-primary flex items-center`}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Unlimited
                </div>
              )}
              
              {isAtLimit && !isPremium && (
                <Button variant="ghost" size="xs" className={`p-0 h-auto ${textSize} text-primary`} asChild>
                  <Link to="/pricing">Upgrade</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsageTracker;
