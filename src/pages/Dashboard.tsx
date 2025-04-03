
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Clock, Flame, MessageSquare, LineChart, CheckCircle, ChevronRight, ListTodo } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones } from '@/components/icons';

const Dashboard = () => {
  const { user } = useAuth();
  const { streak, hasCompletedToday, isLoading: isDailyLoading } = useDailyQuestion();
  
  // Calculate the overall progress based on user data (mock for now)
  const overallProgress = 65;
  
  // Mock data for the learning path
  const learningPath = [
    { id: 1, name: 'Italian Basics', completed: true, progress: 100 },
    { id: 2, name: 'Grammar Foundations', completed: true, progress: 100 },
    { id: 3, name: 'Everyday Conversations', completed: false, progress: 75 },
    { id: 4, name: 'Citizenship Knowledge', completed: false, progress: 40 },
    { id: 5, name: 'Advanced Grammar', completed: false, progress: 15 },
    { id: 6, name: 'Cultural Integration', completed: false, progress: 0 }
  ];
  
  // Mock data for recent activities
  const recentActivities = [
    { 
      id: 1, 
      type: 'daily-question', 
      name: 'Daily Question', 
      date: new Date(Date.now() - 1000 * 60 * 60), 
      result: 'Correct',
      score: 100
    },
    { 
      id: 2, 
      type: 'flashcards', 
      name: 'Citizenship Flashcards', 
      date: new Date(Date.now() - 1000 * 60 * 60 * 3), 
      result: '24 cards studied',
      score: 85 
    },
    { 
      id: 3, 
      type: 'grammar', 
      name: 'Verb Conjugations', 
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), 
      result: '8/10 correct',
      score: 80
    },
    { 
      id: 4, 
      type: 'listening', 
      name: 'Listening Exercise', 
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), 
      result: '6/8 correct',
      score: 75
    }
  ];
  
  // Calculate suggested activities based on weak areas
  const suggestedActivities = [
    {
      id: 1,
      name: 'Listening Practice',
      description: 'Improve your listening comprehension skills',
      icon: <Headphones className="h-5 w-5 text-primary" />,
      link: '/exercises/listening',
      duration: '15 min'
    },
    {
      id: 2,
      name: 'Grammar Review',
      description: 'Practice verb conjugations and tenses',
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      link: '/exercises/grammar',
      duration: '20 min'
    },
    {
      id: 3,
      name: 'Conversation Practice',
      description: 'Practice common citizenship interview questions',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      link: '/exercises/speaking',
      duration: '10 min'
    }
  ];

  // Format date as relative time
  const getRelativeTimeString = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };
  
  // Get the activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'daily-question':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'flashcards':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'grammar':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'listening':
        return <Headphones className="h-5 w-5 text-orange-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | CILS Italian Citizenship</title>
      </Helmet>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.firstName || 'Student'}!</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and continue your Italian citizenship journey
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/daily-question">
                {hasCompletedToday ? 'Completed Today' : 'Today\'s Question'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Overall Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Overall Progress</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <Progress className="h-2 mt-2" value={overallProgress} />
              <p className="text-xs text-muted-foreground mt-2">
                Target for CILS B1: 60%
              </p>
            </CardContent>
          </Card>
          
          {/* Daily Streak */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Daily Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak} days</div>
              <Progress className="h-2 mt-2" value={(streak / 30) * 100} max={100} />
              <p className="text-xs text-muted-foreground mt-2">
                {hasCompletedToday ? 'Completed today\'s question' : 'Complete today\'s question to maintain streak'}
              </p>
            </CardContent>
          </Card>
          
          {/* Study Time */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5 hrs</div>
              <Progress className="h-2 mt-2" value={75} />
              <p className="text-xs text-muted-foreground mt-2">
                This week (target: 6 hrs)
              </p>
            </CardContent>
          </Card>
          
          {/* Achievements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Achievements</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9 / 24</div>
              <Progress className="h-2 mt-2" value={(9 / 24) * 100} />
              <p className="text-xs text-muted-foreground mt-2">
                Keep going to unlock more badges
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {/* Learning Path */}
          <Card className="md:col-span-1 h-[460px] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle>Learning Path</CardTitle>
              <CardDescription>Your Italian citizenship journey</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto flex-grow">
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-muted"></div>
                <div className="space-y-6">
                  {learningPath.map((module, i) => (
                    <div key={module.id} className="relative pl-10">
                      <div className={`absolute left-2.5 -translate-x-1/2 h-5 w-5 rounded-full ${
                        module.completed ? 'bg-primary' : 'bg-muted border-2 border-primary/30'
                      }`}>
                        {module.completed && (
                          <CheckCircle className="h-full w-full text-white p-1" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{module.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <Progress value={module.progress} className="w-36 h-1.5" />
                          <span className="text-xs text-muted-foreground ml-2">
                            {module.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/learning-path">
                  View Complete Path
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent Activity and Recommendations */}
          <Card className="md:col-span-2 h-[460px] flex flex-col">
            <Tabs defaultValue="recent" className="h-full flex flex-col">
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle>Activity Overview</CardTitle>
                  <TabsList>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="suggested">Suggested</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>Your learning activities and recommendations</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-auto">
                <TabsContent value="recent" className="h-full">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="p-2 rounded-full bg-muted">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{activity.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {activity.score}%
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-muted-foreground">{activity.result}</p>
                            <span className="text-xs text-muted-foreground">
                              {getRelativeTimeString(activity.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="suggested" className="h-full">
                  <div className="space-y-4">
                    {suggestedActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="p-2 rounded-full bg-muted">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{activity.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {activity.duration}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="goals" className="h-full">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Daily Question Streak</h4>
                        <Badge variant={streak >= 7 ? "default" : "outline"}>
                          {streak}/7 days
                        </Badge>
                      </div>
                      <Progress value={(streak / 7) * 100} max={100} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Complete 7 days in a row to earn the Weekly Warrior badge
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Grammar Mastery</h4>
                        <Badge variant="outline">60%</Badge>
                      </div>
                      <Progress value={60} max={100} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Complete 10 more grammar exercises to reach 70% mastery
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Citizenship Knowledge</h4>
                        <Badge variant="outline">40%</Badge>
                      </div>
                      <Progress value={40} max={100} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Complete 5 more citizenship quizzes to reach 50% mastery
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/progress">
                    View Detailed Progress
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Tabs>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {/* Daily Task List */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Daily Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-full ${hasCompletedToday ? 'bg-green-100' : 'bg-muted'}`}>
                    {hasCompletedToday ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className={hasCompletedToday ? 'line-through text-muted-foreground' : ''}>
                    Complete daily question
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-full bg-muted">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>Review 10 flashcards</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-full bg-muted">
                    <Headphones className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>Complete listening exercise</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-full bg-muted">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>Practice speaking for 5 minutes</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Tasks
              </Button>
            </CardContent>
          </Card>
          
          {/* Study Time Tracker */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Today</span>
                    <span className="text-sm font-medium">30 mins</span>
                  </div>
                  <Progress value={30} max={60} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">This Week</span>
                    <span className="text-sm font-medium">4.5 hrs</span>
                  </div>
                  <Progress value={4.5} max={6} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">This Month</span>
                    <span className="text-sm font-medium">15 hrs</span>
                  </div>
                  <Progress value={15} max={24} className="h-2" />
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Study Schedule
              </Button>
            </CardContent>
          </Card>
          
          {/* Upcoming Exams/Events */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Practice Test</h4>
                    <Badge variant="outline" className="text-xs">In 3 days</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Full B1 Citizenship practice exam
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Speaking Workshop</h4>
                    <Badge variant="outline" className="text-xs">Next week</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Virtual group speaking practice
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Grammar Review</h4>
                    <Badge variant="outline" className="text-xs">In 10 days</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced verb conjugations
                  </p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
