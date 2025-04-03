
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, CalendarDays, CheckCircle, History, PlusCircle, 
  Clock, BarChart, Award, Flame, Target, AlertCircle, Trophy,
  FileText, HelpCircle, User, Zap, Settings, Search
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { Progress } from '@/components/ui/progress';
import ContentUploader from '@/components/upload/ContentUploader';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    streak: 0,
    level: 1,
    xp: 0,
    achievements: 0,
    completedActivities: 0,
    weeklyGoal: 0,
    weeklyCompleted: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [skillScores, setSkillScores] = useState({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    grammar: 0,
    vocabulary: 0
  });
  
  // Fetch user stats
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchUserStats = async () => {
      try {
        // Fetch streak and other stats
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (statsError) throw statsError;
        
        // Fetch recent activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (activitiesError) throw activitiesError;
        
        // Fetch skill scores
        const listeningScore = statsData.listening_score || 0;
        const readingScore = statsData.reading_score || 0;
        const writingScore = statsData.writing_score || 0;
        const speakingScore = statsData.speaking_score || 0;
        
        // Set user stats
        setUserStats({
          streak: statsData.streak_days || 0,
          level: 1, // This would come from a gamification system
          xp: 0, // This would come from a gamification system
          achievements: 0, // This would come from a gamification system
          completedActivities: activitiesData?.length || 0,
          weeklyGoal: 5, // This would come from user preferences
          weeklyCompleted: activitiesData?.filter(a => {
            const activityDate = new Date(a.created_at);
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return activityDate >= weekStart;
          }).length || 0
        });
        
        setSkillScores({
          listening: listeningScore,
          reading: readingScore,
          writing: writingScore,
          speaking: speakingScore,
          grammar: calculateAverageScore(activitiesData, 'grammar'),
          vocabulary: calculateAverageScore(activitiesData, 'vocabulary')
        });
        
        setRecentActivities(activitiesData || []);
        
        // Mock data for upcoming tests
        setUpcomingTests([
          {
            id: '1',
            title: 'CILS B1 Practice Test',
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
            duration: 90,
            type: 'practice'
          },
          {
            id: '2',
            title: 'Vocabulary Assessment',
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
            duration: 30,
            type: 'assessment'
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching user stats:', error);
        toast({
          title: 'Error loading dashboard',
          description: 'Failed to load your stats. Please try again.',
          variant: 'destructive'
        });
      }
    };
    
    fetchUserStats();
  }, [user]);
  
  // Calculate average score for a specific content type
  const calculateAverageScore = (activities: any[], contentType: string) => {
    if (!activities || activities.length === 0) return 0;
    
    const relevantActivities = activities.filter(
      activity => activity.content_type === contentType
    );
    
    if (relevantActivities.length === 0) return 0;
    
    const sum = relevantActivities.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(sum / relevantActivities.length);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format time ago
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };
  
  // Get skill level text
  const getSkillLevel = (score: number) => {
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    if (score >= 40) return 'Basic';
    return 'Beginner';
  };
  
  // Get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16 text-center">
        <div className="space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Login Required</h1>
          <p className="text-muted-foreground">Please log in to access your dashboard</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Helmet>
          <title>Dashboard - CILS Italian Citizenship</title>
        </Helmet>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and prepare for the CILS B1 citizenship exam
          </p>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Main content - 8 columns on large screens, full width on small screens */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* User Progress Summary */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Welcome back, {user?.displayName || user?.firstName || "Learner"}!</CardTitle>
                    <CardDescription>
                      Here's an overview of your learning progress
                    </CardDescription>
                  </div>
                  {userStats.streak > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{userStats.streak} Day Streak</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Level</div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-xl font-bold">{userStats.level}</span>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">XP</div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-xl font-bold">{userStats.xp}</span>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Activities</div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-xl font-bold">{userStats.completedActivities}</span>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Achievements</div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-xl font-bold">{userStats.achievements}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Weekly Goal Progress</div>
                      <div className="text-sm font-medium">{userStats.weeklyCompleted}/{userStats.weeklyGoal} Activities</div>
                    </div>
                    <Progress 
                      value={(userStats.weeklyCompleted / userStats.weeklyGoal) * 100}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Reading</span>
                        </div>
                        <div className="text-xs font-medium">{getSkillLevel(skillScores.reading)}</div>
                      </div>
                      <Progress 
                        value={skillScores.reading} 
                        className={`h-1.5 ${getProgressColor(skillScores.reading)}`}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="h-3.5 w-3.5" />
                          <span>Writing</span>
                        </div>
                        <div className="text-xs font-medium">{getSkillLevel(skillScores.writing)}</div>
                      </div>
                      <Progress 
                        value={skillScores.writing} 
                        className={`h-1.5 ${getProgressColor(skillScores.writing)}`}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <HelpCircle className="h-3.5 w-3.5" />
                          <span>Speaking</span>
                        </div>
                        <div className="text-xs font-medium">{getSkillLevel(skillScores.speaking)}</div>
                      </div>
                      <Progress 
                        value={skillScores.speaking} 
                        className={`h-1.5 ${getProgressColor(skillScores.speaking)}`}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Search className="h-3.5 w-3.5" />
                          <span>Listening</span>
                        </div>
                        <div className="text-xs font-medium">{getSkillLevel(skillScores.listening)}</div>
                      </div>
                      <Progress 
                        value={skillScores.listening} 
                        className={`h-1.5 ${getProgressColor(skillScores.listening)}`}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Settings className="h-3.5 w-3.5" />
                          <span>Grammar</span>
                        </div>
                        <div className="text-xs font-medium">{getSkillLevel(skillScores.grammar)}</div>
                      </div>
                      <Progress 
                        value={skillScores.grammar} 
                        className={`h-1.5 ${getProgressColor(skillScores.grammar)}`}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Vocabulary</span>
                        </div>
                        <div className="text-xs font-medium">{getSkillLevel(skillScores.vocabulary)}</div>
                      </div>
                      <Progress 
                        value={skillScores.vocabulary} 
                        className={`h-1.5 ${getProgressColor(skillScores.vocabulary)}`}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/progress">View Detailed Progress</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Tabs defaultValue="activities" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="activities" className="flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Recent Activities
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Upcoming Tests
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="activities" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Learning Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivities.slice(0, 5).map((activity: any) => (
                          <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium capitalize">{activity.content_type?.replace('_', ' ')}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(activity.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {activity.score !== undefined && (
                                <p className="font-medium">{activity.score}%</p>
                              )}
                              {activity.time_spent !== undefined && (
                                <p className="text-xs text-muted-foreground">
                                  {activity.time_spent} min
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No activities recorded yet.</p>
                        <p className="text-sm mt-1">Start practicing to see your recent activities here!</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/history">View All Activity</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Upcoming Tests & Assessments</CardTitle>
                    <CardDescription>
                      Scheduled practice tests and assessments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingTests.map((test) => (
                        <div key={test.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-start space-x-3">
                            {test.type === 'practice' ? (
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Award className="h-5 w-5 text-blue-500" />
                              </div>
                            ) : (
                              <div className="bg-amber-100 p-2 rounded-full">
                                <BarChart className="h-5 w-5 text-amber-500" />
                              </div>
                            )}
                            
                            <div>
                              <p className="font-medium">{test.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(test.date)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{test.duration} min</span>
                            </div>
                            <Button size="sm" className="mt-1">
                              Prepare
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {upcomingTests.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No upcoming tests scheduled.</p>
                          <p className="text-sm mt-1">Schedule a practice test to prepare for your exam.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/schedule">View Schedule</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Recommended Learning Path */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Learning Path</CardTitle>
                <CardDescription>
                  Recommended next steps based on your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Daily Question</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete today's question to maintain your streak
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="shrink-0" asChild>
                      <Link to="/daily-question">Start Now</Link>
                    </Button>
                  </div>
                  
                  {skillScores.grammar < 60 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Grammar Practice Needed</h3>
                          <p className="text-sm text-muted-foreground">
                            Your grammar score needs improvement for the CILS B1 exam
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0" asChild>
                        <Link to="/grammar">Practice Grammar</Link>
                      </Button>
                    </div>
                  )}
                  
                  {skillScores.listening < 60 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Listening Practice Needed</h3>
                          <p className="text-sm text-muted-foreground">
                            Your listening score needs improvement for the CILS B1 exam
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0" asChild>
                        <Link to="/listening">Practice Listening</Link>
                      </Button>
                    </div>
                  )}
                  
                  {userStats.completedActivities >= 5 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Award className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Take a Practice Test</h3>
                          <p className="text-sm text-muted-foreground">
                            You're ready for a full practice test to assess your readiness
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0" asChild>
                        <Link to="/practice-tests">Start Test</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/study-plan">View Full Study Plan</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar - 4 columns on large screens, full width on small screens */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Question of the Day</CardTitle>
                <CardDescription>
                  Practice with a new question each day
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Test your knowledge with a daily question aligned with CILS B1 requirements.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/daily-question">
                    Go to Today's Question
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contribute Content</CardTitle>
                <CardDescription>
                  Help improve our AI question generation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Upload Italian content to train our AI and improve question quality for all users.
                </p>
                <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Upload Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <ContentUploader onClose={() => setIsUploaderOpen(false)} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Study Tips</CardTitle>
                <CardDescription>
                  Maximize your learning efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Practice daily with Question of the Day to build a consistent study habit</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Focus on your weakest areas first to make the biggest improvements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Take practice tests under timed conditions to simulate the real exam</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Use flashcards for vocabulary and grammar to improve retention</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-xs w-full" asChild>
                  <Link to="/resources">View All Study Resources</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
