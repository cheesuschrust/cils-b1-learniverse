
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';
import { Link } from 'react-router-dom';
import { Book, Calendar, Award, Flame } from 'lucide-react';

interface UserStats {
  streak_days: number;
  questions_answered: number;
  correct_answers: number;
  reading_score: number;
  writing_score: number;
  listening_score: number;
  speaking_score: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dailyQuestion, setDailyQuestion] = useState<any>(null);
  const [completedToday, setCompletedToday] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        
        // Fetch user statistics
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') {
          console.error('Error fetching user stats:', statsError);
        } else {
          setStats(statsData);
        }
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch daily question
        const { data: questionData, error: questionError } = await supabase
          .from('daily_questions')
          .select('*')
          .eq('question_date', today)
          .single();
          
        if (questionError && questionError.code !== 'PGRST116') {
          console.error('Error fetching daily question:', questionError);
        } else {
          setDailyQuestion(questionData);
        }
        
        // Check if user completed today's question
        const { data: attemptData, error: attemptError } = await supabase
          .from('question_attempts')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', today)
          .limit(1);
          
        if (attemptError) {
          console.error('Error checking completion status:', attemptError);
        } else {
          setCompletedToday(attemptData && attemptData.length > 0);
        }
        
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.streak_days || 0} days</div>
              <p className="text-xs text-muted-foreground">
                {stats?.streak_days ? 'Keep going!' : 'Start your streak today!'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
              <Book className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.questions_answered || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.correct_answers ? `${Math.round((stats.correct_answers / stats.questions_answered) * 100)}% correct` : 'No questions answered yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Question</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedToday ? 'Completed' : 'Pending'}</div>
              <p className="text-xs text-muted-foreground">
                {completedToday ? 'Good job! Come back tomorrow.' : 'Take your daily question'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? 
                  Math.round(((stats.reading_score + stats.writing_score + stats.listening_score + stats.speaking_score) / 400) * 100) 
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Towards CILS B1 readiness
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Daily Question Card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Today's Question</CardTitle>
              <CardDescription>
                Practice your Italian with the daily challenge
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailyQuestion ? (
                <div className="space-y-4">
                  <p className="font-medium">{dailyQuestion.question_text}</p>
                  {completedToday ? (
                    <div className="bg-muted p-4 rounded-md text-center">
                      <p className="font-medium text-sm">You've completed today's question!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Come back tomorrow for a new challenge.
                      </p>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/daily-question">Answer Now</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm">No daily question available today.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try some practice questions instead.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Skills Progress Card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Language Skills</CardTitle>
              <CardDescription>
                Track your CILS B1 readiness in key areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reading</span>
                  <span>{stats?.reading_score || 0}/100</span>
                </div>
                <Progress value={stats?.reading_score || 0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Writing</span>
                  <span>{stats?.writing_score || 0}/100</span>
                </div>
                <Progress value={stats?.writing_score || 0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Listening</span>
                  <span>{stats?.listening_score || 0}/100</span>
                </div>
                <Progress value={stats?.listening_score || 0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Speaking</span>
                  <span>{stats?.speaking_score || 0}/100</span>
                </div>
                <Progress value={stats?.speaking_score || 0} className="h-2" />
              </div>
              
              <Button variant="outline" asChild className="w-full mt-4">
                <Link to="/practice">Practice Skills</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump to common activities
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild>
                <Link to="/flashcards">Flashcards</Link>
              </Button>
              <Button asChild>
                <Link to="/citizenship-test">Citizenship Test</Link>
              </Button>
              <Button asChild>
                <Link to="/speaking">Speaking Practice</Link>
              </Button>
              <Button asChild>
                <Link to="/writing">Writing Practice</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Study Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Study Tips</CardTitle>
              <CardDescription>
                Maximize your learning effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 ml-6 list-disc text-sm">
                <li>Practice a little bit every day to build your streak</li>
                <li>Focus on your weakest areas first</li>
                <li>Use flashcards for vocabulary retention</li>
                <li>Read Italian news articles to improve comprehension</li>
                <li>Practice speaking Italian with native speakers</li>
              </ul>
              
              <Button variant="outline" asChild className="w-full mt-4">
                <Link to="/resources">View All Resources</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
