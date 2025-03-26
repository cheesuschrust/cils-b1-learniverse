
import React, { useState } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Trophy, Star, Flame, CheckCircle } from 'lucide-react';
import XpProgressBar from '@/components/gamification/XpProgressBar';
import LevelBadge from '@/components/gamification/LevelBadge';
import StreakCounter from '@/components/gamification/StreakCounter';
import AchievementsGrid from '@/components/gamification/AchievementsGrid';
import AchievementsSummary from '@/components/gamification/AchievementsSummary';
import Leaderboard from '@/components/gamification/Leaderboard';
import WeeklyChallengeCard from '@/components/gamification/WeeklyChallengeCard';
import { useAuth } from '@/contexts/AuthContext';

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const { gamification, achievements, isLoading, levelDetails } = useGamification();
  const [activeTab, setActiveTab] = useState("achievements");
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-4">
            Please sign in to view your achievements and progress.
          </p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalAchievements = achievements.length;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements & Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and earn rewards
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Level & Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">Level {gamification?.level || 1}</div>
                <div className="text-sm text-muted-foreground">
                  {levelDetails?.title}
                </div>
              </div>
              <LevelBadge size="lg" showInfo={false} />
            </div>
            
            <XpProgressBar />
            
            <div className="flex justify-between text-sm pt-1">
              <div>
                <div className="text-muted-foreground">Weekly XP</div>
                <div className="font-medium">{gamification?.weeklyXp} XP</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">Total XP</div>
                <div className="font-medium">{gamification?.lifetimeXp} XP</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{unlockedCount}</div>
                <div className="text-sm text-muted-foreground">
                  of {totalAchievements} unlocked
                </div>
              </div>
              <div className="flex">
                {achievements
                  .filter(a => a.unlockedAt)
                  .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                  .slice(0, 3)
                  .map(achievement => (
                    <div 
                      key={achievement.id} 
                      className="-ml-3 first:ml-0 border-2 border-background rounded-full bg-amber-100 w-10 h-10 flex items-center justify-center"
                    >
                      {achievement.icon === 'trophy' && <Trophy className="h-5 w-5 text-amber-800" />}
                      {achievement.icon === 'star' && <Star className="h-5 w-5 text-amber-800" />}
                      {achievement.icon === 'award' && <Award className="h-5 w-5 text-amber-800" />}
                      {achievement.icon === 'check-circle' && <CheckCircle className="h-5 w-5 text-amber-800" />}
                      {achievement.icon === 'flame' && <Flame className="h-5 w-5 text-amber-800" />}
                    </div>
                  ))
                }
                {unlockedCount > 3 && (
                  <div className="-ml-3 border-2 border-background rounded-full bg-muted w-10 h-10 flex items-center justify-center text-sm font-medium">
                    +{unlockedCount - 3}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {['learning', 'streak', 'mastery', 'social', 'challenge', 'special'].map(category => {
                const count = achievements
                  .filter(a => a.category === category && a.unlockedAt)
                  .length;
                const total = achievements.filter(a => a.category === category).length;
                
                if (total === 0) return null;
                
                return (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="flex items-center gap-1 py-1"
                  >
                    {category === 'learning' && <CheckCircle className="h-3 w-3" />}
                    {category === 'streak' && <Flame className="h-3 w-3" />}
                    {category === 'mastery' && <Star className="h-3 w-3" />}
                    {category === 'challenge' && <Award className="h-3 w-3" />}
                    {category === 'social' && <Trophy className="h-3 w-3" />}
                    {category === 'special' && <Trophy className="h-3 w-3" />}
                    <span>{count}/{total}</span>
                  </Badge>
                );
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setActiveTab("achievements")}
            >
              View All Achievements
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{gamification?.streakDays || 0}</div>
                <div className="text-sm text-muted-foreground">
                  Current Streak
                </div>
              </div>
              <StreakCounter className="text-3xl" showLabel={false} />
            </div>
            
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Longest Streak</span>
                <span className="font-medium">{gamification?.longestStreak || 0} days</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Correct Answers</span>
                <span className="font-medium">{gamification?.totalCorrectAnswers || 0}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Reviews Completed</span>
                <span className="font-medium">{gamification?.totalCompletedReviews || 0}</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setActiveTab("leaderboard")}
            >
              View Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for detailed content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <AchievementsSummary />
            </div>
            <div className="md:col-span-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">All Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <AchievementsGrid achievements={achievements} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Leaderboard limit={20} />
            </div>
            <div className="md:col-span-1">
              <WeeklyChallengeCard />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="challenges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeeklyChallengeCard />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Past Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  No past challenges to display yet.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsPage;
