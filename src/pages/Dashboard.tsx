
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ItalianPracticeComponent } from '@/components/ItalianPracticeComponent';
import { CitizenshipContentProcessor } from '@/components/CitizenshipContentProcessor';
import CitizenshipReadinessComponent from '@/components/CitizenshipReadinessComponent';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Mic, 
  FileText, 
  PenTool, 
  BookmarkCheck, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  BookMarked
} from 'lucide-react';
import { ItalianTestSection } from '@/types/core-types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'daily' | 'progress' | 'citizenship'>('daily');
  
  // Sample data for today's questions
  const [dailyQuestions, setDailyQuestions] = useState<{
    grammar: boolean;
    vocabulary: boolean;
    listening: boolean;
    reading: boolean;
    writing: boolean;
    speaking: boolean;
    citizenship: boolean;
  }>({
    grammar: false,
    vocabulary: false,
    listening: false,
    reading: false,
    writing: false,
    speaking: false,
    citizenship: false
  });
  
  // Sample data for progress
  const [progress, setProgress] = useState({
    overall: 48,
    grammar: 65,
    vocabulary: 72,
    listening: 43,
    reading: 52,
    writing: 35,
    speaking: 28,
    citizenship: 40,
    streak: 7
  });
  
  // Sample readiness score for citizenship test
  const [readinessScore, setReadinessScore] = useState(65);
  
  // Check if the user is authenticated, if not redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Mock function to handle daily question completion
  const handleCompleteDailyQuestion = (section: ItalianTestSection) => {
    setDailyQuestions(prev => ({
      ...prev,
      [section]: true
    }));
    
    // Update progress as well
    setProgress(prev => ({
      ...prev,
      [section]: Math.min(prev[section as keyof typeof prev] + 5, 100)
    }));
  };
  
  // Mock function to start readiness assessment
  const handleStartAssessment = () => {
    navigate('/citizenship-test');
  };
  
  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || user?.displayName || 'Learner'}! Continue your Italian citizenship journey.
          </p>
        </div>
        
        <Button onClick={() => navigate('/citizenship-test')}>
          Take Today's Citizenship Question
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-8">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Daily Practice</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="citizenship" className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            <span>Citizenship</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Grammar Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Grammar</CardTitle>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Italian grammar practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Test your understanding of Italian grammar rules and structures.
                </p>
              </CardContent>
              <CardFooter>
                {dailyQuestions.grammar ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleCompleteDailyQuestion('grammar')}>
                    Start Practice
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Vocabulary Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Vocabulary</CardTitle>
                  <BookmarkCheck className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Italian vocabulary practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Expand your Italian vocabulary with citizenship-focused terms.
                </p>
              </CardContent>
              <CardFooter>
                {dailyQuestions.vocabulary ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleCompleteDailyQuestion('vocabulary')}>
                    Start Practice
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Listening Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Listening</CardTitle>
                  <Mic className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Italian listening practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Improve your Italian listening comprehension skills.
                </p>
              </CardContent>
              <CardFooter>
                {dailyQuestions.listening ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleCompleteDailyQuestion('listening')}>
                    Start Practice
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Reading Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Reading</CardTitle>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Italian reading practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Practice reading and understanding Italian texts.
                </p>
              </CardContent>
              <CardFooter>
                {dailyQuestions.reading ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleCompleteDailyQuestion('reading')}>
                    Start Practice
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Writing Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Writing</CardTitle>
                  <PenTool className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Italian writing practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Enhance your written Italian skills with guided exercises.
                </p>
              </CardContent>
              <CardFooter>
                {dailyQuestions.writing ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleCompleteDailyQuestion('writing')}>
                    Start Practice
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Speaking Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Speaking</CardTitle>
                  <Mic className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Italian speaking practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Practice speaking Italian with interactive exercises.
                </p>
              </CardContent>
              <CardFooter>
                {dailyQuestions.speaking ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleCompleteDailyQuestion('speaking')}>
                    Start Practice
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {/* Today's Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Progress</CardTitle>
              <CardDescription>
                Your daily learning statistics and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Daily Completion</div>
                    <div className="text-sm text-muted-foreground">
                      {Object.values(dailyQuestions).filter(Boolean).length}/{Object.values(dailyQuestions).length}
                    </div>
                  </div>
                  <Progress value={(Object.values(dailyQuestions).filter(Boolean).length / Object.values(dailyQuestions).length) * 100} />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                      {progress.streak} Day Streak
                    </Badge>
                    <span className="text-sm text-muted-foreground">Keep it up!</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs text-muted-foreground">Exercises Completed</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-2xl font-bold">78%</div>
                      <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-2xl font-bold">15</div>
                      <div className="text-xs text-muted-foreground">New Words Learned</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-2xl font-bold">24m</div>
                      <div className="text-xs text-muted-foreground">Time Spent</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Track your Italian language journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Overall Progress</div>
                    <div className="text-sm text-muted-foreground">{progress.overall}%</div>
                  </div>
                  <Progress value={progress.overall} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Grammar & Vocabulary</h4>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Grammar</div>
                        <div className="text-sm text-muted-foreground">{progress.grammar}%</div>
                      </div>
                      <Progress value={progress.grammar} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Vocabulary</div>
                        <div className="text-sm text-muted-foreground">{progress.vocabulary}%</div>
                      </div>
                      <Progress value={progress.vocabulary} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Citizenship Knowledge</div>
                        <div className="text-sm text-muted-foreground">{progress.citizenship}%</div>
                      </div>
                      <Progress value={progress.citizenship} className="h-1.5" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Communication Skills</h4>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Reading</div>
                        <div className="text-sm text-muted-foreground">{progress.reading}%</div>
                      </div>
                      <Progress value={progress.reading} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Writing</div>
                        <div className="text-sm text-muted-foreground">{progress.writing}%</div>
                      </div>
                      <Progress value={progress.writing} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Listening</div>
                        <div className="text-sm text-muted-foreground">{progress.listening}%</div>
                      </div>
                      <Progress value={progress.listening} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Speaking</div>
                        <div className="text-sm text-muted-foreground">{progress.speaking}%</div>
                      </div>
                      <Progress value={progress.speaking} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest learning sessions and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Vocabulary Practice</div>
                      <div className="text-sm text-muted-foreground">Completed citizenship-related vocabulary exercise</div>
                    </div>
                    <Badge>85% Score</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">Today, 10:23 AM</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Reading Comprehension</div>
                      <div className="text-sm text-muted-foreground">Read and answered questions about Italian civic duties</div>
                    </div>
                    <Badge>70% Score</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">Yesterday, 3:45 PM</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Grammar Challenge</div>
                      <div className="text-sm text-muted-foreground">Completed verb conjugation exercises</div>
                    </div>
                    <Badge>92% Score</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">2 days ago, 5:12 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Focus Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Focus Areas</CardTitle>
              <CardDescription>
                Based on your performance, here's what to focus on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Speaking Practice</h4>
                    <p className="text-sm text-muted-foreground">
                      Your speaking skills need more practice. Focus on pronunciation and fluency exercises.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Writing Skills</h4>
                    <p className="text-sm text-muted-foreground">
                      Work on improving your written Italian with more practice in sentence construction and grammar application.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/plan')}>
                View Personalized Study Plan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="citizenship" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Citizenship Test Readiness</CardTitle>
                <CardDescription>
                  Track your preparedness for the CILS B1 Citizenship Test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CitizenshipReadinessComponent 
                  readinessScore={readinessScore} 
                  level="intermediate"
                  assessmentAvailable={true}
                  lastAssessmentDate={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)} // 7 days ago
                  onStartAssessment={handleStartAssessment}
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Practice Citizenship Content</CardTitle>
                <CardDescription>
                  Upload Italian citizenship materials for AI-generated practice questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CitizenshipContentProcessor />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Italian Practice Sections</CardTitle>
                <CardDescription>
                  Practice specific sections of the citizenship language test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItalianPracticeComponent 
                  initialSection="grammar"
                  level="intermediate"
                  isCitizenshipMode={true}
                  userId={user?.id}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
