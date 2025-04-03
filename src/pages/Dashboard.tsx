
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useGamification } from '@/hooks/useGamification';
import { useMultipleChoice } from '@/hooks/useMultipleChoice';
import { 
  Calendar, 
  Flame, 
  Trophy, 
  ChevronRight, 
  Clock, 
  BarChart3, 
  CheckCircle2,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Edit
} from 'lucide-react';
import Headphones from '@/components/icons/Headphones';
import { Link } from 'react-router-dom';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    gamification, 
    levelDetails, 
    achievements, 
    weeklyChallenge, 
    isLoading: isGamificationLoading 
  } = useGamification();
  const { questionSets, loading: questionsLoading } = useMultipleChoice();
  const { streak, todaysQuestion, hasCompletedToday } = useDailyQuestion();
  
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    completionRate: 0,
    timeSpent: 0,
    averageScore: 0,
    streak: 0
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch user progress from database
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (progressError) throw progressError;
      
      // Fetch user stats
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (statsError && statsError.code !== 'PGSQL_EMPTY_RESULT') throw statsError;
      
      // Process recent activities
      const activities = processRecentActivities(progressData || []);
      setRecentActivities(activities);
      
      // Calculate stats
      const totalCompleted = progressData?.filter(p => p.completed).length || 0;
      const completionRate = progressData && progressData.length > 0 
        ? (totalCompleted / progressData.length) * 100 
        : 0;
      
      const totalTimeSpent = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
      
      const scores = progressData?.filter(p => p.score !== null).map(p => p.score) || [];
      const averageScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + (score || 0), 0) / scores.length 
        : 0;
      
      setStats({
        completionRate,
        timeSpent: totalTimeSpent,
        averageScore,
        streak: userStats?.streak_days || 0
      });
      
      // Generate personalized recommendations
      const personalizedRecommendations = generateRecommendations(
        progressData || [], 
        userStats,
        hasCompletedToday,
        questionSets
      );
      
      setRecommendations(personalizedRecommendations);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error loading dashboard data',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processRecentActivities = (progressData: any[]) => {
    return progressData.map(entry => {
      // Map content_type to readable activity name and icon
      const activityTypes: Record<string, { name: string, icon: JSX.Element }> = {
        'daily_question': { 
          name: 'Daily Question', 
          icon: <Calendar className="h-4 w-4 text-blue-500" /> 
        },
        'flashcards': { 
          name: 'Flashcards', 
          icon: <BookOpen className="h-4 w-4 text-purple-500" /> 
        },
        'multiple_choice': { 
          name: 'Quiz', 
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> 
        },
        'reading': { 
          name: 'Reading Exercise', 
          icon: <BookOpen className="h-4 w-4 text-blue-500" /> 
        },
        'listening': { 
          name: 'Listening Exercise', 
          icon: <Headphones className="h-4 w-4 text-amber-500" /> 
        },
        'writing': { 
          name: 'Writing Exercise', 
          icon: <Edit className="h-4 w-4 text-purple-500" /> 
        },
        'speaking': { 
          name: 'Speaking Exercise', 
          icon: <MessageSquare className="h-4 w-4 text-green-500" /> 
        },
        'grammar': { 
          name: 'Grammar Practice', 
          icon: <MessageSquare className="h-4 w-4 text-red-500" /> 
        },
        'vocabulary': { 
          name: 'Vocabulary Practice', 
          icon: <BookOpen className="h-4 w-4 text-indigo-500" /> 
        }
      };
      
      const activityInfo = activityTypes[entry.content_type] || {
        name: 'Learning Activity',
        icon: <CheckCircle2 className="h-4 w-4" />
      };
      
      return {
        id: entry.id,
        date: new Date(entry.created_at).toLocaleDateString(),
        timestamp: new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: entry.content_type,
        name: activityInfo.name,
        icon: activityInfo.icon,
        score: entry.score,
        completed: entry.completed,
        timeSpent: entry.time_spent || 0
      };
    });
  };

  const generateRecommendations = (
    progressData: any[], 
    userStats: any,
    hasCompletedDailyQuestion: boolean,
    questionSets: any[]
  ) => {
    const recommendations = [];
    
    // Daily question recommendation
    if (!hasCompletedDailyQuestion) {
      recommendations.push({
        id: 'daily-question',
        title: 'Complete Today\'s Question',
        description: 'Take today\'s challenge to maintain your streak',
        icon: <Calendar className="h-12 w-12 text-blue-500" />,
        priority: 1,
        route: '/daily-question',
        bgColor: 'bg-blue-50'
      });
    }
    
    // Check streak status
    if (streak > 0) {
      recommendations.push({
        id: 'maintain-streak',
        title: 'Keep Your Streak Going!',
        description: `You're on a ${streak}-day streak. Practice today to maintain it!`,
        icon: <Flame className="h-12 w-12 text-orange-500" />,
        priority: hasCompletedDailyQuestion ? 3 : 2,
        route: hasCompletedDailyQuestion ? '/flashcards' : '/daily-question',
        bgColor: 'bg-orange-50'
      });
    }
    
    // Check activity types to identify gaps
    const activityCounts: Record<string, number> = {};
    progressData.forEach(entry => {
      if (!activityCounts[entry.content_type]) {
        activityCounts[entry.content_type] = 0;
      }
      activityCounts[entry.content_type]++;
    });
    
    // Identify least practiced skill
    const commonSkills = [
      'reading', 'writing', 'listening', 'speaking', 
      'grammar', 'vocabulary', 'multiple_choice', 'flashcards'
    ];
    
    const leastPracticedSkill = commonSkills.reduce((lowest, skill) => {
      if (!activityCounts[skill] && lowest.count !== 0) {
        return { skill, count: 0 };
      }
      if (!activityCounts[lowest.skill] || 
          (activityCounts[skill] < activityCounts[lowest.skill])) {
        return { skill, count: activityCounts[skill] || 0 };
      }
      return lowest;
    }, { skill: commonSkills[0], count: activityCounts[commonSkills[0]] || 0 });
    
    const skillRecommendations: Record<string, any> = {
      'reading': {
        title: 'Practice Reading Skills',
        description: 'Improve your Italian reading comprehension',
        icon: <BookOpen className="h-12 w-12 text-blue-500" />,
        route: '/reading',
        bgColor: 'bg-blue-50'
      },
      'writing': {
        title: 'Practice Writing Skills',
        description: 'Improve your Italian writing abilities',
        icon: <Edit className="h-12 w-12 text-purple-500" />,
        route: '/writing',
        bgColor: 'bg-purple-50'
      },
      'listening': {
        title: 'Practice Listening Skills',
        description: 'Improve your Italian listening comprehension',
        icon: <Headphones className="h-12 w-12 text-amber-500" />,
        route: '/listening',
        bgColor: 'bg-amber-50'
      },
      'speaking': {
        title: 'Practice Speaking Skills',
        description: 'Improve your Italian speaking abilities',
        icon: <MessageSquare className="h-12 w-12 text-green-500" />,
        route: '/speaking',
        bgColor: 'bg-green-50'
      },
      'grammar': {
        title: 'Practice Grammar Rules',
        description: 'Master Italian grammar patterns',
        icon: <CheckCircle2 className="h-12 w-12 text-red-500" />,
        route: '/grammar',
        bgColor: 'bg-red-50'
      },
      'vocabulary': {
        title: 'Expand Your Vocabulary',
        description: 'Learn new Italian words and phrases',
        icon: <BookOpen className="h-12 w-12 text-indigo-500" />,
        route: '/vocabulary',
        bgColor: 'bg-indigo-50'
      },
      'multiple_choice': {
        title: 'Take a Practice Quiz',
        description: 'Test your knowledge with multiple choice questions',
        icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
        route: '/multiple-choice',
        bgColor: 'bg-green-50'
      },
      'flashcards': {
        title: 'Study Flashcards',
        description: 'Review key vocabulary and concepts',
        icon: <BookOpen className="h-12 w-12 text-purple-500" />,
        route: '/flashcards',
        bgColor: 'bg-purple-50'
      }
    };
    
    if (skillRecommendations[leastPracticedSkill.skill]) {
      const rec = skillRecommendations[leastPracticedSkill.skill];
      recommendations.push({
        id: `practice-${leastPracticedSkill.skill}`,
        title: rec.title,
        description: rec.description,
        icon: rec.icon,
        priority: 2,
        route: rec.route,
        bgColor: rec.bgColor
      });
    }
    
    // Add weekly challenge if available
    if (weeklyChallenge && !weeklyChallenge.completed) {
      const progress = weeklyChallenge.currentProgress || 0;
      const goal = weeklyChallenge.goal || 100;
      const percentage = Math.round((progress / goal) * 100);
      
      recommendations.push({
        id: 'weekly-challenge',
        title: 'Complete Weekly Challenge',
        description: `${weeklyChallenge.title}: ${progress}/${goal} (${percentage}%)`,
        icon: <Trophy className="h-12 w-12 text-yellow-500" />,
        priority: 3,
        route: '/progress',
        bgColor: 'bg-yellow-50',
        progress: percentage
      });
    }
    
    // Sort by priority
    return recommendations.sort((a, b) => a.priority - b.priority);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.email}</h1>
      <p className="text-muted-foreground mb-8">Track your progress and continue learning Italian</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</p>
                </div>
              </div>
              
              <Button asChild size="sm" variant="outline">
                <Link to="/daily-question">
                  {hasCompletedToday ? 'Completed' : 'Today\'s Question'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {!isGamificationLoading && gamification && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">XP Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-2xl font-bold">
                      {gamification.level}
                      {levelDetails?.title && <span className="text-sm font-normal ml-2 text-muted-foreground">{levelDetails.title}</span>}
                    </p>
                  </div>
                </div>
              </div>
              
              {levelDetails && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{gamification.xp} XP</span>
                    <span>{levelDetails.maxXp} XP</span>
                  </div>
                  <Progress 
                    value={gamification.xp - levelDetails.minXp} 
                    max={levelDetails.maxXp - levelDetails.minXp}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {levelDetails.maxXp - gamification.xp} XP until level {gamification.level + 1}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Study Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-xl font-bold">{stats.averageScore.toFixed(1)}%</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-xl font-bold">{Math.round(stats.timeSpent / 60)} mins</p>
              </div>
            </div>
            
            <Button asChild className="w-full mt-4" variant="outline">
              <Link to="/progress">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Detailed Progress
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recommended Activities */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recommended Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(recommendation => (
            <Card key={recommendation.id} className={`relative overflow-hidden ${recommendation.bgColor} border-none`}>
              <CardHeader className="relative z-10">
                <div className="absolute top-4 right-4 opacity-10">
                  {recommendation.icon}
                </div>
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                <CardDescription>{recommendation.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                {recommendation.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Progress</span>
                      <span>{recommendation.progress}%</span>
                    </div>
                    <Progress value={recommendation.progress} max={100} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="relative z-10 pt-0">
                <Button asChild className="w-full">
                  <Link to={recommendation.route}>
                    Start Activity
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {recommendations.length === 0 && (
            <Card className="col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground text-center">
                  You've completed all your recommended activities for now.
                  Check back later for more recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            {recentActivities.length > 0 ? (
              <div className="divide-y">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.date} at {activity.timestamp}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {activity.score !== null && (
                        <Badge variant={activity.score >= 70 ? "outline" : "secondary"}>
                          {activity.score}%
                        </Badge>
                      )}
                      {activity.completed && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No recent activity found.</p>
                <p className="text-sm text-muted-foreground">
                  Start practicing to see your activity history here.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/progress">
                View All Activity
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/flashcards">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium text-center">Flashcards</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/listening">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Headphones className="h-8 w-8 text-amber-500 mb-2" />
                <p className="font-medium text-center">Listening</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/speaking">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
                <p className="font-medium text-center">Speaking</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/progress">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
                <p className="font-medium text-center">Progress</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
