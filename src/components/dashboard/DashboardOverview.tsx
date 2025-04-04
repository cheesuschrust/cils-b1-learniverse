
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Book, Target, Activity, TrendingUp, BookOpen, BrainCog, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import LevelProgressBar from '@/components/gamification/LevelProgressBar';
import XPPointsDisplay from '@/components/gamification/XPPointsDisplay';
import ProgressTracker from '@/components/progress/ProgressTracker';
import Leaderboard from '@/components/gamification/Leaderboard';
import ChallengeSystem from '@/components/gamification/ChallengeSystem';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { calculateLevelProgress } from '@/lib/learning-utils';

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    currentXP: 0,
    totalXP: 0,
    level: 1,
    streak: 0,
    completedActivities: 0,
    xpToday: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    readingScore: 0,
    writingScore: 0,
    listeningScore: 0,
    speakingScore: 0,
  });
  const [nextGoal, setNextGoal] = useState({
    title: 'Loading...',
    progress: 0,
    target: 100,
    type: 'skill'
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const { todaysQuestion, hasCompletedToday, streak } = useDailyQuestion();

  // Fetch user stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch user stats
        const { data: userStatsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        
        // Fetch user's XP
        const { data: xpData, error: xpError } = await supabase
          .rpc('get_user_xp', { user_id: user.id });
          
        if (xpError) throw xpError;
        
        // Fetch today's XP
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayXpData, error: todayXpError } = await supabase
          .from('user_activity_logs')
          .select('details')
          .eq('user_id', user.id)
          .eq('activity_type', 'xp_earned')
          .gte('created_at', today.toISOString())
          .order('created_at', { ascending: false });
          
        if (todayXpError) throw todayXpError;
        
        const todayXp = todayXpData?.reduce((sum, item) => sum + (item.details?.xp_amount || 0), 0) || 0;
        
        // Fetch recent activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_progress')
          .select('*, learning_content(*)')
          .eq('user_id', user.id)
          .order('last_activity', { ascending: false })
          .limit(5);
          
        if (activitiesError) throw activitiesError;
        
        // Calculate next goal
        const nextGoal = calculateNextGoal(userStatsData);
        
        // Get level from XP
        const { level } = calculateLevelProgress(xpData || 0);
        
        setUserStats({
          currentXP: xpData || 0,
          totalXP: xpData || 0,
          level,
          streak: userStatsData?.streak_days || 0,
          completedActivities: userStatsData?.questions_answered || 0,
          xpToday: todayXp,
          correctAnswers: userStatsData?.correct_answers || 0,
          totalAnswers: userStatsData?.questions_answered || 0,
          readingScore: userStatsData?.reading_score || 0,
          writingScore: userStatsData?.writing_score || 0,
          listeningScore: userStatsData?.listening_score || 0,
          speakingScore: userStatsData?.speaking_score || 0
        });
        
        setNextGoal(nextGoal);
        setRecentActivities(activitiesData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your dashboard data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);

  // Helper to calculate the next appropriate goal for the user
  const calculateNextGoal = (stats: any) => {
    if (!stats) {
      return {
        title: 'Complete First Lesson',
        progress: 0,
        target: 1,
        type: 'activity'
      };
    }
    
    // Check if any skill scores are low
    const skillScores = {
      'reading': stats.reading_score || 0,
      'writing': stats.writing_score || 0,
      'listening': stats.listening_score || 0,
      'speaking': stats.speaking_score || 0
    };
    
    const weakestSkill = Object.entries(skillScores)
      .sort(([, scoreA], [, scoreB]) => (scoreA as number) - (scoreB as number))
      [0];
    
    if (weakestSkill && (weakestSkill[1] as number) < 70) {
      const skillName = weakestSkill[0].charAt(0).toUpperCase() + weakestSkill[0].slice(1);
      return {
        title: `${skillName} B1 Level`,
        progress: weakestSkill[1] as number,
        target: 70,
        type: 'skill'
      };
    }
    
    // If skills are decent, focus on streak or activity count
    if (stats.streak_days < 7) {
      return {
        title: '7 Day Streak',
        progress: stats.streak_days || 0,
        target: 7,
        type: 'streak'
      };
    }
    
    return {
      title: '50 Activities',
      progress: stats.questions_answered || 0,
      target: 50,
      type: 'activity'
    };
  };

  // Function to render activity type icon
  const renderActivityIcon = (type: string) => {
    switch (type?.toLowerCase() || '') {
      case 'grammar':
        return <Book className="h-4 w-4" />;
      case 'vocabulary':
        return <BookOpen className="h-4 w-4" />;
      case 'reading':
        return <BookOpen className="h-4 w-4" />;
      case 'writing':
        return <Book className="h-4 w-4" />;
      case 'listening':
        return <Activity className="h-4 w-4" />;
      case 'speaking':
        return <Activity className="h-4 w-4" />;
      case 'quiz':
        return <BrainCog className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
        <XPPointsDisplay xp={userStats.currentXP} xpToday={userStats.xpToday} showTodayXP />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.level}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {userStats.level < 5 ? 'Beginner' : 
               userStats.level < 10 ? 'Elementary' : 
               userStats.level < 15 ? 'Intermediate' : 
               userStats.level < 20 ? 'Advanced' : 'Master'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.streak} days</div>
            <div className="text-xs text-muted-foreground mt-1">
              {userStats.streak < 3 ? 'Just starting' : 
               userStats.streak < 7 ? 'Building momentum' : 
               userStats.streak < 30 ? 'Consistent practice' : 'Excellent discipline'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Book className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completedActivities}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {userStats.totalAnswers > 0 ?
                `${Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100)}% correct` :
                'No activities completed'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextGoal.title}</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, (nextGoal.progress / nextGoal.target) * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {nextGoal.progress}/{nextGoal.target}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <LevelProgressBar 
                currentXP={userStats.totalXP}
                level={userStats.level}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild variant={hasCompletedToday ? "outline" : "default"}>
                <Link to="/daily-questions">
                  {hasCompletedToday ? 'Completed' : 'Daily Question'}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/practice-test">Practice Test</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/speaking">Speaking Exercise</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/writing">Writing Task</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Leaderboard limit={5} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Question</CardTitle>
              <CardDescription>Test your Italian knowledge with today's challenge</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysQuestion ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Badge variant="outline">
                      {todaysQuestion.category}
                    </Badge>
                    {hasCompletedToday && (
                      <Badge variant="secondary">
                        Completed
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-medium">{todaysQuestion.question_text}</h3>
                  
                  {!hasCompletedToday ? (
                    <Button asChild className="w-full mt-4">
                      <Link to="/daily-questions">Answer Now</Link>
                    </Button>
                  ) : (
                    <div className="bg-muted p-3 rounded-md text-center mt-4">
                      <p className="text-sm font-medium">
                        You've completed today's question!
                      </p>
                      <div className="flex justify-center mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/daily-questions">View Result</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Loading today's question...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your progress toward CILS B1 certification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reading</span>
                    <span className="text-sm text-muted-foreground">
                      {userStats.readingScore}/100
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        userStats.readingScore >= 70 ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{ width: `${userStats.readingScore}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right text-muted-foreground">
                    {userStats.readingScore >= 70 ? "CILS B1 Ready" : `${70 - userStats.readingScore} points to B1`}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Writing</span>
                    <span className="text-sm text-muted-foreground">
                      {userStats.writingScore}/100
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        userStats.writingScore >= 70 ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{ width: `${userStats.writingScore}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right text-muted-foreground">
                    {userStats.writingScore >= 70 ? "CILS B1 Ready" : `${70 - userStats.writingScore} points to B1`}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Listening</span>
                    <span className="text-sm text-muted-foreground">
                      {userStats.listeningScore}/100
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        userStats.listeningScore >= 70 ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{ width: `${userStats.listeningScore}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right text-muted-foreground">
                    {userStats.listeningScore >= 70 ? "CILS B1 Ready" : `${70 - userStats.listeningScore} points to B1`}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Speaking</span>
                    <span className="text-sm text-muted-foreground">
                      {userStats.speakingScore}/100
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        userStats.speakingScore >= 70 ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{ width: `${userStats.speakingScore}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right text-muted-foreground">
                    {userStats.speakingScore >= 70 ? "CILS B1 Ready" : `${70 - userStats.speakingScore} points to B1`}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/progress">View Detailed Progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center 
                        ${activity.score >= 80 ? 'bg-green-100' : 
                          activity.score >= 60 ? 'bg-amber-100' : 'bg-blue-100'}`}
                      >
                        {renderActivityIcon(activity.learning_content?.content_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">
                            {activity.learning_content?.title || 'Activity'}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.last_activity).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.learning_content?.content_type || 'Exercise'} • 
                          Score: {activity.score || 0}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Complete activities to see your history
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 px-6">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/history">View All Activity</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
