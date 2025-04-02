
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import UserProgressDashboard from '@/components/dashboard/UserProgressDashboard';
import ContentUploader from '@/components/upload/ContentUploader';
import DailyQuestionComponent from '@/components/daily/DailyQuestionComponent';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, CheckCircle, History, PlusCircle, Clock, BarChart, Award } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock data for recent activities
  const recentActivities = [
    { 
      id: '1', 
      type: 'question', 
      category: 'grammar',
      title: 'Past Tense Practice',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      score: 80
    },
    { 
      id: '2', 
      type: 'flashcard', 
      category: 'vocabulary',
      title: 'Common Phrases',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      count: 15
    },
    { 
      id: '3', 
      type: 'reading', 
      category: 'culture',
      title: 'Italian Regions',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      score: 75
    },
    { 
      id: '4', 
      type: 'writing', 
      category: 'writing',
      title: 'Describing Your City',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      score: 60
    }
  ];
  
  // Mock upcoming test data
  const upcomingTests = [
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
  ];
  
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
  
  return (
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
          <UserProgressDashboard 
            userName={user?.displayName || user?.firstName || "User"} 
            streak={5}
            lastActive={new Date()}
          />
          
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
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-start space-x-3">
                          {activity.type === 'question' && (
                            <div className="bg-blue-100 p-2 rounded-full">
                              <CheckCircle className="h-5 w-5 text-blue-500" />
                            </div>
                          )}
                          {activity.type === 'flashcard' && (
                            <div className="bg-green-100 p-2 rounded-full">
                              <BookOpen className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                          {activity.type === 'reading' && (
                            <div className="bg-amber-100 p-2 rounded-full">
                              <BookOpen className="h-5 w-5 text-amber-500" />
                            </div>
                          )}
                          {activity.type === 'writing' && (
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Award className="h-5 w-5 text-purple-500" />
                            </div>
                          )}
                          
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {activity.category} • {activity.type}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {activity.score !== undefined && (
                            <p className="font-medium">{activity.score}%</p>
                          )}
                          {activity.count !== undefined && (
                            <p className="font-medium">{activity.count} cards</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {timeAgo(activity.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <span>Use spaced repetition flashcards to improve vocabulary retention</span>
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
  );
};

export default Dashboard;
