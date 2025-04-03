
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ReviewSchedule, ReviewPerformance } from '@/types/interface-fixes';

interface ReviewProgressProps {
  reviewPerformance: ReviewPerformance;
  reviewSchedule: ReviewSchedule;
}

/**
 * Component for displaying review progress statistics
 */
const ReviewProgress: React.FC<ReviewProgressProps> = ({ 
  reviewPerformance, 
  reviewSchedule 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Review Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center">
            <span className="text-2xl font-bold">{reviewPerformance.efficiency}%</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due today</p>
            <p className="text-2xl font-bold">{reviewSchedule.dueToday}</p>
            <p className="text-xs text-muted-foreground">{reviewSchedule.dueThisWeek} this week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewProgress;
