
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyChallengeCardProps {
  className?: string;
}

const WeeklyChallengeCard: React.FC<WeeklyChallengeCardProps> = ({ className }) => {
  const { weeklyChallenge, isLoading } = useGamification();
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!weeklyChallenge) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Weekly Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No active challenge this week.
            <br />
            Check back soon!
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate progress percentage
  const progressPercent = Math.min(
    Math.round((weeklyChallenge.currentProgress / weeklyChallenge.goal) * 100), 
    100
  );
  
  // Format date to readable format
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate days remaining
  const daysRemaining = Math.max(
    Math.ceil((weeklyChallenge.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
    0
  );

  return (
    <Card className={className}>
      <CardHeader className={cn(
        "pb-2",
        weeklyChallenge.completed ? "bg-green-100 dark:bg-green-900" : ""
      )}>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Weekly Challenge
          {weeklyChallenge.completed && (
            <Badge variant="secondary" className="ml-auto text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200">
              Completed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div>
          <h3 className="font-medium text-lg">{weeklyChallenge.title}</h3>
          <p className="text-sm text-muted-foreground">{weeklyChallenge.description}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {weeklyChallenge.currentProgress}/{weeklyChallenge.goal} ({progressPercent}%)
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="flex justify-between pt-2">
          <div className="text-sm">
            <div className="text-muted-foreground">Reward</div>
            <div className="font-medium text-green-600 dark:text-green-400">
              +{weeklyChallenge.xpReward} XP
            </div>
          </div>
          
          <div className="text-sm text-right">
            <div className="text-muted-foreground">Time Left</div>
            <div className="font-medium">
              {weeklyChallenge.completed 
                ? 'Challenge completed!' 
                : daysRemaining > 0 
                  ? `${daysRemaining} days` 
                  : 'Ends today'
              }
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-1">
          {formatDate(weeklyChallenge.startDate)} - {formatDate(weeklyChallenge.endDate)}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChallengeCard;
