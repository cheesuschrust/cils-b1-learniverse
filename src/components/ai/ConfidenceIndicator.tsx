
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ConfidenceIndicatorProps {
  score: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  showText = true,
  size = 'md',
  showInfo = true
}) => {
  // Determine color based on confidence score
  const getColorClass = () => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Determine progress bar color
  const getProgressColor = () => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Determine size classes
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-base';
      default: return 'text-sm';
    }
  };

  // Get descriptive text for confidence level
  const getConfidenceText = () => {
    if (score >= 85) return 'High confidence';
    if (score >= 70) return 'Medium confidence';
    return 'Low confidence';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          {showText && (
            <div className={`${getSizeClass()} ${getColorClass()} font-medium flex items-center`}>
              <span>{getConfidenceText()}</span>
              {showInfo && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="ml-1 inline-flex">
                      <InfoCircledIcon className="h-3.5 w-3.5 opacity-70" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3 text-sm">
                    <p>AI confidence score represents how certain the model is about this content.</p>
                    <ul className="mt-2 space-y-1">
                      <li><span className="text-green-500 font-medium">High (85-100%)</span>: Very likely to be correct</li>
                      <li><span className="text-yellow-500 font-medium">Medium (70-84%)</span>: Moderately reliable</li>
                      <li><span className="text-red-500 font-medium">Low (0-69%)</span>: Less reliable, verify information</li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          )}
          <span className={`${getSizeClass()} ${getColorClass()} font-medium`}>{score}%</span>
        </div>
        <Progress value={score} className={`h-1.5 ${getProgressColor()}`} />
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
