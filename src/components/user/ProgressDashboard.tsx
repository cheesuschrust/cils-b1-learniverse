
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserProgress, ProgressStats } from '@/hooks/useUserProgress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Trophy, Clock, CheckCircle, BarChart, BookOpen } from 'lucide-react';

const formatDate = (date: Date | null) => {
  if (!date) return 'Never';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ProgressDashboard: React.FC = () => {
  const { stats, isLoading } = useUserProgress();
  
  const renderStatCards = (stats: ProgressStats) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Current Streak" 
        value={`${stats.currentStreak} days`}
        icon={<CalendarDays className="h-4 w-4 text-blue-500" />}
        description="Keep practicing to maintain your streak"
      />
      <StatCard 
        title="Completed" 
        value={stats.totalCompleted.toString()}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        description="Total exercises completed"
      />
      <StatCard 
        title="Avg. Score" 
        value={`${stats.averageScore}%`}
        icon={<Trophy className="h-4 w-4 text-amber-500" />}
        description="Your average score across all exercises"
      />
      <StatCard 
        title="Time Spent" 
        value={`${stats.timeSpent} min`}
        icon={<Clock className="h-4 w-4 text-purple-500" />}
        description="Total time practicing Italian"
      />
    </div>
  );
  
  const renderCategoryProgress = (stats: ProgressStats) => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Category Progress</CardTitle>
        <CardDescription>Your progress across different learning categories</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.entries(stats.categoryProgress).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(stats.categoryProgress).map(([categoryId, percentage]) => (
              <div key={categoryId} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{getCategoryName(categoryId)}</span>
                  <span className="text-sm text-muted-foreground">{percentage}%</span>
                </div>
                <Progress value={percentage} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No progress data available yet. Start learning to see your progress.</p>
        )}
      </CardContent>
    </Card>
  );
  
  // This is a placeholder - in a real app, you'd fetch category names from the database
  const getCategoryName = (categoryId: string): string => {
    const categories: Record<string, string> = {
      '1': 'Grammar',
      '2': 'Vocabulary',
      '3': 'Reading',
      '4': 'Listening',
      '5': 'Writing',
      '6': 'Speaking',
    };
    return categories[categoryId] || 'Unnamed Category';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Progress</h2>
          <p className="text-muted-foreground">
            Last active: {formatDate(stats.lastActive)}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          Learning Italian
        </Badge>
      </div>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {renderStatCards(stats)}
          
          <Tabs defaultValue="categories" className="w-full">
            <TabsList>
              <TabsTrigger value="categories" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Recent Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              {renderCategoryProgress(stats)}
            </TabsContent>
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">No recent activity data available yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}> = ({ title, value, icon, description }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

const LoadingState: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProgressDashboard;
