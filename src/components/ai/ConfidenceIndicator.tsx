
import React from 'react';
import { ConfidenceIndicatorProps, ContentType } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  contentType = 'unknown',
  score,
  size = 'md',
  showLabel = true
}) => {
  const getColorClass = (score: number): string => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getLabel = (score: number): string => {
    if (score >= 85) return 'High';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Medium';
    return 'Low';
  };
  
  const getBadgeVariant = (score: number): 'default' | 'success' | 'warning' | 'destructive' => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'default';
    if (score >= 50) return 'warning';
    return 'destructive';
  };
  
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      case 'md':
      default:
        return 'h-2';
    }
  };

  // Validate content type
  let validContentType: ContentType = 'unknown';
  if (['flashcards', 'multiple-choice', 'writing', 'speaking', 'listening'].includes(contentType)) {
    validContentType = contentType as ContentType;
  }
  
  return (
    <div className="confidence-indicator">
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Confidence: {validContentType}</span>
            <Badge variant={getBadgeVariant(score)}>
              {getLabel(score)} ({Math.round(score)}%)
            </Badge>
          </div>
        )}
      </div>
      <Progress
        value={score}
        className={`w-full ${getSizeClasses()}`}
        fill={getColorClass(score)}
      />
    </div>
  );
};

export default ConfidenceIndicator;
