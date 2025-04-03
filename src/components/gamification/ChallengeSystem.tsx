
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Trophy, CheckCircle } from 'lucide-react';
import { Challenge } from '@/types/gamification';
import { useQuery } from '@tanstack/react-query';
import { getChallenges } from '@/services/challengeService';
import { cn } from '@/lib/utils';

interface ChallengeSystemProps {
  className?: string;
}

const ChallengeSystem: React.FC<ChallengeSystemProps> = ({ className }) => {
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: getChallenges
  });

  const formatRemainingDays = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? "Ending today" : `${diffDays} days left`;
  };

  const calculateProgress = (challenge: Challenge) => {
    const completedTasks = challenge.tasks.filter(task => task.completed).length;
    return (completedTasks / challenge.tasks.length) * 100;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Weekly Challenges
        </CardTitle>
        <CardDescription>
          Complete challenges to earn bonus XP and rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-muted rounded w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {challenges?.map(challenge => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{challenge.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatRemainingDays(challenge.endDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <div>Progress</div>
                      <div className="text-muted-foreground">
                        {challenge.tasks.filter(t => t.completed).length}/{challenge.tasks.length} tasks
                      </div>
                    </div>
                    <Progress value={calculateProgress(challenge)} className="h-2" />
                  </div>
                  <div className="mt-4 space-y-2">
                    {challenge.tasks.map(task => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "flex items-center text-sm p-2 rounded-md",
                          task.completed && "bg-primary/10"
                        )}
                      >
                        <div className={cn(
                          "h-5 w-5 rounded-full border mr-2 flex items-center justify-center",
                          task.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                        )}>
                          {task.completed && <CheckCircle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">{task.title}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="text-sm text-primary font-medium">
                    Reward: +{challenge.xpReward} XP
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeSystem;
