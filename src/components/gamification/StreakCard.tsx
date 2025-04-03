
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Flame, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, differenceInHours } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActivity?: Date | null;
  progressToday?: boolean;
  className?: string;
}

const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  lastActivity,
  progressToday = false,
  className
}) => {
  const navigate = useNavigate();
  
  // Check if streak might break today
  const streakAtRisk = () => {
    if (!lastActivity) return false;
    
    const now = new Date();
    const lastActivityDate = new Date(lastActivity);
    const hoursSinceLastActivity = differenceInHours(now, lastActivityDate);
    
    // If last activity was yesterday and it's past 6 PM, streak is at risk
    return hoursSinceLastActivity > 24 && currentStreak > 0 && !progressToday && now.getHours() >= 18;
  };
  
  return (
    <Card className={className}>
      <CardContent className="pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Flame className={cn(
                "h-8 w-8",
                streakAtRisk() ? "text-orange-300" : "text-orange-500"
              )} />
              <div className="absolute -top-1 -right-3 bg-primary text-primary-foreground text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {currentStreak}
              </div>
            </div>
            <p className="text-sm font-medium mt-1">Current Streak</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <Flame className="h-8 w-8 text-orange-500" />
              <div className="absolute -top-1 -right-3 bg-muted-foreground text-muted text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {longestStreak}
              </div>
            </div>
            <p className="text-sm font-medium mt-1">Longest Streak</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center",
              progressToday ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
            )}>
              {progressToday ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-medium mt-1">Today</p>
          </div>
        </div>
        
        {lastActivity && (
          <div className="text-center mt-3 text-xs text-muted-foreground">
            Last activity: {format(new Date(lastActivity), 'MMM d, h:mm a')}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        {streakAtRisk() ? (
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate('/daily-question')}
          >
            <Flame className="h-4 w-4 mr-2" />
            Keep Your Streak Going!
          </Button>
        ) : !progressToday ? (
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/daily-question')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Complete Today's Activity
          </Button>
        ) : (
          <Button 
            variant="outline"
            className="w-full bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800"
            disabled
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Today's Progress Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StreakCard;
