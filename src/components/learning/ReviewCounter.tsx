
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import questionService from '@/services/questionService';
import { ReviewSchedule } from '@/types/question';

interface ReviewCounterProps {
  onReviewModeToggle?: (isReviewMode: boolean) => void;
  className?: string;
}

const ReviewCounter: React.FC<ReviewCounterProps> = ({
  onReviewModeToggle,
  className
}) => {
  const { user } = useAuth();
  const [reviewSchedule, setReviewSchedule] = useState<ReviewSchedule | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadReviewSchedule();
    }
  }, [user]);
  
  const loadReviewSchedule = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const { schedule } = await questionService.getReviewStats(user.id);
      setReviewSchedule(schedule);
    } catch (error) {
      console.error('Error loading review schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleReviewMode = () => {
    const newMode = !isReviewMode;
    setIsReviewMode(newMode);
    if (onReviewModeToggle) {
      onReviewModeToggle(newMode);
    }
  };
  
  if (!user || isLoading) {
    return null;
  }
  
  if (!reviewSchedule || reviewSchedule.dueToday === 0) {
    return (
      <div className={className}>
        <Button variant="ghost" size="sm" onClick={handleToggleReviewMode} disabled={!onReviewModeToggle}>
          {isReviewMode ? "Learn New" : "Review"}
        </Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Button 
        variant={isReviewMode ? "default" : "outline"} 
        size="sm" 
        onClick={handleToggleReviewMode} 
        className="gap-2"
      >
        <Clock className="h-4 w-4" />
        {isReviewMode ? "Switch to Learn" : "Review"}
        <Badge variant="secondary" className="ml-1">
          {reviewSchedule.dueToday}
        </Badge>
      </Button>
    </div>
  );
};

export default ReviewCounter;
