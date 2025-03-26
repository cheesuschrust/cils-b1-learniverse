
import React from 'react';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Award, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AchievementsSummaryProps {
  className?: string;
}

const AchievementsSummary: React.FC<AchievementsSummaryProps> = ({ className }) => {
  const { achievements, isLoading } = useGamification();
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate overall achievements progress
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;
  const percentComplete = totalAchievements > 0 
    ? Math.round((unlockedAchievements / totalAchievements) * 100) 
    : 0;
  
  // Group achievements by category
  const categories = [...new Set(achievements.map(a => a.category))];
  const categoryStats = categories.map(category => {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlocked = categoryAchievements.filter(a => a.unlockedAt).length;
    const total = categoryAchievements.length;
    const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    
    return { category, unlocked, total, percent };
  });
  
  // Get category display name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'learning': return 'Learning';
      case 'streak': return 'Streaks';
      case 'mastery': return 'Mastery';
      case 'social': return 'Social';
      case 'challenge': return 'Challenges';
      case 'special': return 'Special';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  // Get category color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'learning': return 'bg-green-500';
      case 'streak': return 'bg-orange-500';
      case 'mastery': return 'bg-purple-500';
      case 'social': return 'bg-blue-500';
      case 'challenge': return 'bg-yellow-500';
      case 'special': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{unlockedAchievements}/{totalAchievements}</span>
          </div>
          
          <Progress value={percentComplete} className="h-2" />
          
          <div className="text-xs text-muted-foreground">
            You've unlocked {percentComplete}% of all achievements
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {categoryStats.map(stat => (
              <div key={stat.category} className="flex items-center gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  getCategoryColor(stat.category)
                )}>
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{getCategoryName(stat.category)}</span>
                    <span className="text-xs text-muted-foreground">{stat.unlocked}/{stat.total}</span>
                  </div>
                  <Progress value={stat.percent} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsSummary;
