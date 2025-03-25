
import React from 'react';
import { ContentType } from '@/utils/textAnalysis';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { AlertCircle, CheckCircle2, HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfidenceIndicatorProps {
  contentType: ContentType;
  showDetails?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  contentType,
  showDetails = false,
  className = '',
  size = 'md',
  showTooltip = true,
}) => {
  const { confidenceScores, getConfidenceLevel, isAIEnabled } = useAIUtils();
  
  const score = confidenceScores[contentType] || 0;
  const confidenceLevel = getConfidenceLevel(contentType);
  
  const getProgressColor = () => {
    switch (confidenceLevel) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getConfidenceIcon = () => {
    switch (confidenceLevel) {
      case 'high': return <CheckCircle2 className={`text-green-500 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />;
      case 'medium': return <HelpCircle className={`text-yellow-500 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />;
      case 'low': return <AlertCircle className={`text-red-500 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />;
      default: return <HelpCircle className={`text-gray-500 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />;
    }
  };
  
  const getConfidenceDescription = () => {
    switch (confidenceLevel) {
      case 'high':
        return 'The AI has high confidence in its ability to assist with this content type.';
      case 'medium':
        return 'The AI has moderate confidence and may need occasional guidance.';
      case 'low':
        return 'The AI has low confidence and may require more user verification.';
      default:
        return 'Confidence level unknown.';
    }
  };
  
  if (!isAIEnabled) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Info className={`text-gray-400 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        <span className="text-sm font-medium text-gray-400">
          AI disabled
        </span>
      </div>
    );
  }
  
  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center space-x-2 ${className} ${showTooltip ? 'cursor-help' : ''}`}>
              {getConfidenceIcon()}
              <span className={`font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {score}% confidence
              </span>
            </div>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent side="top">
              <p className="max-w-xs">{getConfidenceDescription()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>AI Confidence: {contentType}</span>
          <Badge variant={confidenceLevel === 'high' ? 'default' : confidenceLevel === 'medium' ? 'outline' : 'destructive'}>
            {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{score}%</span>
            <span className="text-xs text-muted-foreground">
              {score < 60 ? 'Needs improvement' : score < 80 ? 'Good' : 'Excellent'}
            </span>
          </div>
          <Progress value={score} className={getProgressColor()} />
          <p className="text-xs text-muted-foreground mt-2">
            {getConfidenceDescription()}
          </p>
          {confidenceLevel === 'low' && (
            <div className="flex items-center mt-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Results may be unreliable - verify manually</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceIndicator;
