
import React from 'react';
import { ContentType } from '@/utils/textAnalysis';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  contentType: ContentType;
  showDetails?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  contentType,
  showDetails = false,
  className,
}) => {
  const { confidenceScores, getConfidenceLevel } = useAIUtils();
  
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
      case 'high': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'medium': return <HelpCircle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getConfidenceIcon()}
        <span className="text-sm font-medium">
          {score}% confidence
        </span>
      </div>
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
            {confidenceLevel === 'high' 
              ? 'The AI has high confidence in its ability to assist with this content type.'
              : confidenceLevel === 'medium'
                ? 'The AI has moderate confidence and may need occasional guidance.'
                : 'The AI has low confidence and may require more user verification.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceIndicator;
