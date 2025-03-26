
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { daysUntilReview, isDueForReview } from '@/utils/spacedRepetition';
import { Question } from '@/types/question';

interface ReviewIndicatorProps {
  question: Question;
  showDays?: boolean;
  className?: string;
}

const ReviewIndicator: React.FC<ReviewIndicatorProps> = ({
  question,
  showDays = false,
  className
}) => {
  if (!question.nextReviewDate) {
    return null;
  }
  
  const isDue = isDueForReview(question.nextReviewDate);
  const days = daysUntilReview(question.nextReviewDate);
  
  if (isDue) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-300",
          className
        )}
      >
        <Clock className="h-3 w-3 mr-1" /> 
        Due For Review
      </Badge>
    );
  }
  
  if (showDays && days !== null && days <= 7) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300",
          className
        )}
      >
        <Clock className="h-3 w-3 mr-1" /> 
        Review in {days} {days === 1 ? 'day' : 'days'}
      </Badge>
    );
  }
  
  return null;
};

export default ReviewIndicator;
