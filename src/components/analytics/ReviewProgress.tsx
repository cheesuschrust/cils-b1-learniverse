
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProgressCircle } from '@/components/analytics/ProgressCircle';
import { ReviewPerformance, ReviewSchedule } from '@/types/question';

interface ReviewProgressProps {
  reviewPerformance: ReviewPerformance;
  reviewSchedule: ReviewSchedule;
  className?: string;
}

const ReviewProgress: React.FC<ReviewProgressProps> = ({
  reviewPerformance,
  reviewSchedule,
  className
}) => {
  const { efficiency, totalReviews, correctReviews, streakDays } = reviewPerformance;
  const { dueToday, dueThisWeek, dueNextWeek } = reviewSchedule;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Spaced Repetition Progress</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <ProgressCircle 
              value={efficiency} 
              maxValue={100} 
              label="Efficiency" 
              size={120}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {correctReviews} of {totalReviews} correct
            </p>
          </div>
          
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Today</span>
                <span className="text-sm text-muted-foreground">{dueToday} reviews</span>
              </div>
              <Progress value={dueToday ? 100 : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">This Week</span>
                <span className="text-sm text-muted-foreground">{dueThisWeek} reviews</span>
              </div>
              <Progress value={dueThisWeek ? 100 : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Next Week</span>
                <span className="text-sm text-muted-foreground">{dueNextWeek} reviews</span>
              </div>
              <Progress value={dueNextWeek ? 100 : 0} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Review Streak</span>
            <span className="text-sm font-medium">{streakDays} day{streakDays !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Consecutive days with completed reviews
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewProgress;
