
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ReviewSchedule, ReviewPerformance } from '@/types/interface-fixes';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, Clock } from 'lucide-react';

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
  // Calculate percentage of reviews completed
  const reviewsDue = reviewSchedule.dueToday + reviewSchedule.dueThisWeek;
  const reviewsCompleted = reviewPerformance.totalReviews > 0 
    ? reviewPerformance.correctReviews 
    : 0;
  const completionRate = reviewPerformance.totalReviews > 0
    ? Math.round((reviewsCompleted / reviewPerformance.totalReviews) * 100)
    : 0;
    
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Review Progress</span>
          <Badge variant={reviewPerformance.streakDays > 0 ? "default" : "outline"} className="flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            {reviewPerformance.streakDays} day streak
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            <div className="w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center">
              <span className="text-2xl font-bold">{reviewPerformance.efficiency}%</span>
            </div>
            <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
              <CheckCircle className={`h-5 w-5 ${completionRate >= 80 ? 'text-green-500' : 'text-muted-foreground'}`} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-muted-foreground">Due today</p>
              <p className="text-sm font-medium">{reviewSchedule.dueToday}</p>
            </div>
            <Progress value={reviewSchedule.dueToday > 0 ? 0 : 100} className="h-2 mb-2" />
            
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <p className="text-xs">{reviewSchedule.dueThisWeek}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Next week</p>
              <p className="text-xs text-muted-foreground">{reviewSchedule.dueNextWeek}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span>Total Reviews</span>
            <span className="font-medium">{reviewPerformance.totalReviews}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Correct Reviews</span>
            <span className="font-medium text-green-600">{reviewPerformance.correctReviews}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewProgress;
