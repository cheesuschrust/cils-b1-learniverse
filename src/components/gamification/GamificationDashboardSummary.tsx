
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGamification } from '@/hooks/useGamification';
import { Award, Star, CheckCircle, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import LevelBadge from './LevelBadge';
import XpProgressBar from './XpProgressBar';
import { cn } from '@/lib/utils';

interface GamificationDashboardSummaryProps {
  className?: string;
}

const GamificationDashboardSummary: React.FC<GamificationDashboardSummaryProps> = ({ 
  className 
}) => {
  const { gamification, achievements, isLoading } = useGamification();
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progress & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get recently unlocked achievements (max 3)
  const recentAchievements = achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3);
  
  // Get achievements close to completion (not unlocked, but > 50% progress)
  const closeToCompletion = achievements
    .filter(a => !a.unlockedAt && a.currentValue && a.requiredValue && (a.currentValue / a.requiredValue > 0.5))
    .sort((a, b) => {
      const progressA = (a.currentValue || 0) / a.requiredValue;
      const progressB = (b.currentValue || 0) / b.requiredValue;
      return progressB - progressA;
    })
    .slice(0, 3);
  
  // Get icon component based on string name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      case 'award': return <Award className="h-5 w-5" />;
      case 'check-circle': return <CheckCircle className="h-5 w-5" />;
      case 'flame': return <Flame className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };
  
  // Calculate progress percentage
  const getProgressPercent = (current?: number, required?: number) => {
    if (!current || !required) return 0;
    return Math.min(Math.round((current / required) * 100), 100);
  };
  
  // Get category color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'learning': return 'text-green-500';
      case 'streak': return 'text-orange-500';
      case 'mastery': return 'text-purple-500';
      case 'social': return 'text-blue-500';
      case 'challenge': return 'text-yellow-500';
      case 'special': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Progress & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between items-center">
            <div className="font-medium">Current Level</div>
            <LevelBadge showInfo />
          </div>
          <XpProgressBar />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Recent achievements */}
          <div className="space-y-3">
            <div className="font-medium">Recently Earned</div>
            {recentAchievements.length > 0 ? (
              <div className="space-y-2">
                {recentAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-2">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    )}>
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div className="text-sm truncate">{achievement.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-2">
                No achievements unlocked yet.
              </div>
            )}
          </div>
          
          {/* Nearly completed achievements */}
          <div className="space-y-3">
            <div className="font-medium">Almost There</div>
            {closeToCompletion.length > 0 ? (
              <div className="space-y-2">
                {closeToCompletion.map(achievement => (
                  <div key={achievement.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      )}>
                        {getIconComponent(achievement.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.currentValue}/{achievement.requiredValue} 
                          ({getProgressPercent(achievement.currentValue, achievement.requiredValue)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-2">
                No achievements in progress.
              </div>
            )}
          </div>
        </div>
        
        <Button asChild size="sm" className="w-full">
          <Link to="/achievements">View All Achievements</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GamificationDashboardSummary;
