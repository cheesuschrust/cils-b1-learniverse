
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, List, User, Settings, LogOut, BarChart, Volume2, Edit, Sparkles, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase-client';
import { UserStats } from '@/types';

const DashboardOverview: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAchievement, setLatestAchievement] = useState<any>(null);
  const [dueFlashcards, setDueFlashcards] = useState(0);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch user stats
        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') {
          console.error('Error fetching user stats:', statsError);
        } else if (stats) {
          setUserStats({
            userId: stats.user_id,
            questionsAnswered: stats.questions_answered,
            correctAnswers: stats.correct_answers,
            streakDays: stats.streak_days,
            lastActivityDate: stats.last_activity_date ? new Date(stats.last_activity_date) : undefined,
            readingScore: stats.reading_score,
            writingScore: stats.writing_score,
            listeningScore: stats.listening_score,
            speakingScore: stats.speaking_score
          });
        }
        
        // Fetch latest achievement
        const { data: achievements, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('achieved_at', { ascending: false })
          .limit(1);
          
        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError);
        } else if (achievements && achievements.length > 0) {
          setLatestAchievement(achievements[0]);
        }
        
        // Fetch due flashcards count
        const today = new Date().toISOString();
        const { data: dueCards, error: dueCardsError } = await supabase
          .from('user_flashcard_progress')
          .select('id')
          .eq('user_id', user.id)
          .lte('next_review', today);
          
        if (dueCardsError) {
          console.error('Error fetching due flashcards:', dueCardsError);
        } else {
          setDueFlashcards(dueCards ? dueCards.length : 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out'
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Calculate overall proficiency
  const calculateOverallScore = () => {
    if (!userStats) return 0;
    
    let totalScores = 0;
    let scoreCount = 0;
    
    if (userStats.readingScore) {
      totalScores += userStats.readingScore;
      scoreCount++;
    }
    
    if (userStats.writingScore) {
      totalScores += userStats.writingScore;
      scoreCount++;
    }
    
    if (userStats.listeningScore) {
      totalScores += userStats.listeningScore;
      scoreCount++;
    }
    
    if (userStats.speakingScore) {
      totalScores += userStats.speakingScore;
      scoreCount++;
    }
    
    return scoreCount ? Math.round(totalScores / scoreCount) : 0;
  };
  
  const overallScore = calculateOverallScore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName || user?.email?.split('@')[0] || 'User'}!</h1>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {userStats?.streakDays ? (
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
              🔥
            </div>
            <div>
              <p className="font-bold text-lg">{userStats.streakDays} Day Streak!</p>
              <p className="text-sm text-muted-foreground">Keep up the good work</p>
            </div>
          </div>
          {latestAchievement && (
            <div className="hidden md:flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm">Latest: {latestAchievement.achievement_name}</span>
            </div>
          )}
        </div>
      ) : null}
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Overall CILS B1 Proficiency</h2>
        <div className="bg-background rounded-lg border p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Your Progress</span>
            <span className="text-sm font-medium">{overallScore}%</span>
          </div>
          <Progress value={overallScore} className="h-2 mb-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <BookOpen className="h-8 w-8 mb-2 text-blue-500" />
              <span className="text-sm font-medium">Reading</span>
              <Progress value={userStats?.readingScore || 0} className="w-full mt-1" />
              <span className="text-xs text-muted-foreground mt-1">{userStats?.readingScore || 0}%</span>
            </div>
            <div className="flex flex-col items-center">
              <Edit className="h-8 w-8 mb-2 text-green-500" />
              <span className="text-sm font-medium">Writing</span>
              <Progress value={userStats?.writingScore || 0} className="w-full mt-1" />
              <span className="text-xs text-muted-foreground mt-1">{userStats?.writingScore || 0}%</span>
            </div>
            <div className="flex flex-col items-center">
              <Volume2 className="h-8 w-8 mb-2 text-yellow-500" />
              <span className="text-sm font-medium">Listening</span>
              <Progress value={userStats?.listeningScore || 0} className="w-full mt-1" />
              <span className="text-xs text-muted-foreground mt-1">{userStats?.listeningScore || 0}%</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="h-8 w-8 mb-2 text-purple-500" />
              <span className="text-sm font-medium">Speaking</span>
              <Progress value={userStats?.speakingScore || 0} className="w-full mt-1" />
              <span className="text-xs text-muted-foreground mt-1">{userStats?.speakingScore || 0}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              Language Study
            </CardTitle>
            <CardDescription>Practice your Italian language skills</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Build vocabulary and grammar skills required for the CILS B1 exam.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigateTo('/dashboard/learning')}
            >
              Start Learning
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="h-5 w-5 mr-2 text-red-500" />
              Flashcards
            </CardTitle>
            <CardDescription>Review your Italian vocabulary</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {dueFlashcards > 0 
                ? `You have ${dueFlashcards} flashcards to review today.` 
                : 'Create and study flashcards to improve your vocabulary.'}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigateTo('/dashboard/flashcards')}
            >
              Study Flashcards
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-purple-500" />
              My Progress
            </CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View your progress, achievements, and areas for improvement.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigateTo('/dashboard/progress')}
            >
              View Progress
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        {userStats?.questionsAnswered ? (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-full mr-4">
                    <BarChart className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userStats.questionsAnswered}</p>
                    <p className="text-sm text-muted-foreground">Questions Answered</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-950 p-3 rounded-full mr-4">
                    <Sparkles className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userStats.correctAnswers}</p>
                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-full mr-4">
                    <Crown className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userStats.correctAnswers ? 
                        Math.round((userStats.correctAnswers / userStats.questionsAnswered) * 100) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No recent activity found. Start learning to see your progress!</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => navigateTo('/dashboard/settings')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardOverview;
