
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays,
  BookOpen,
  FileText,
  Headphones,
  Mic,
  Pen,
  BookType,
  Clock,
  BarChart3,
  CheckCircle,
  Trophy
} from 'lucide-react';
import { useExam } from '@/contexts/ExamContext';
import ExamSectionCard from '@/components/exam/ExamSectionCard';

const ExamPrepDashboard = () => {
  const { exams, examProgress, activeExamId, setActiveExamId } = useExam();
  const [activeTab, setActiveTab] = useState('overview');

  // Get current exam info
  const currentExam = exams.find(exam => exam.id === activeExamId);
  
  // Mock user stats
  const userStats = {
    totalPoints: 1250,
    completedLessons: 24,
    totalLessons: 48,
    streak: 7,
    strongestSkill: 'Reading',
    weakestSkill: 'Speaking',
    lastActivity: new Date(),
    estimatedLevel: 'B1',
    readingScore: 82,
    writingScore: 68,
    listeningScore: 75,
    speakingScore: 61,
    vocabularyScore: 78,
    grammarScore: 72
  };
  
  // Mock recent activities
  const recentActivities = [
    { id: 1, type: 'mock-exam', title: 'Reading Comprehension Test', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), score: 82 },
    { id: 2, type: 'flashcards', title: 'Citizenship Vocabulary Set', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), cards: 42 },
    { id: 3, type: 'listening', title: 'Conversation Practice', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 75 },
    { id: 4, type: 'writing', title: 'Formal Letter Writing', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), score: 68 }
  ];
  
  // Example exam sections
  const examSections = [
    {
      id: 'reading',
      title: 'Reading Comprehension',
      description: 'Practice understanding written Italian text',
      type: 'reading',
      timeAllowed: 35,
      questionCount: 15,
      progress: 65,
      isCompleted: false
    },
    {
      id: 'writing',
      title: 'Writing Skills',
      description: 'Develop your written Italian expression',
      type: 'writing',
      timeAllowed: 30,
      questionCount: 2,
      progress: 50,
      isCompleted: false
    },
    {
      id: 'listening',
      title: 'Listening Comprehension',
      description: 'Improve your Italian listening skills',
      type: 'listening',
      timeAllowed: 30,
      questionCount: 12,
      progress: 75,
      isCompleted: false
    },
    {
      id: 'speaking',
      title: 'Speaking Practice',
      description: 'Enhance your conversation abilities',
      type: 'speaking',
      timeAllowed: 25,
      questionCount: 3,
      progress: 35,
      isCompleted: false
    },
    {
      id: 'vocabulary',
      title: 'Citizenship Vocabulary',
      description: 'Learn essential words and phrases',
      type: 'vocabulary',
      timeAllowed: 20,
      questionCount: 100,
      progress: 85,
      isCompleted: false
    },
    {
      id: 'grammar',
      title: 'Grammar Fundamentals',
      description: 'Master Italian grammar structures',
      type: 'grammar',
      timeAllowed: 25,
      questionCount: 20,
      progress: 60,
      isCompleted: false
    }
  ];
  
  const nextExamDate = new Date();
  nextExamDate.setMonth(nextExamDate.getMonth() + 2);
  
  const handleStartSection = (sectionId: string) => {
    console.log(`Starting section: ${sectionId}`);
    // Navigate to the specific section
  };
  
  const handleContinueSection = (sectionId: string) => {
    console.log(`Continuing section: ${sectionId}`);
    // Navigate to the specific section with progress
  };
  
  // Calculate overall progress
  const overallProgress = Math.round(
    examSections.reduce((acc, section) => acc + section.progress, 0) / examSections.length
  );

  return (
    <>
      <Helmet>
        <title>CILS B1 Exam Preparation | Italian Citizenship Test</title>
        <meta name="description" content="Prepare for your CILS B1 Citizenship Test with our comprehensive study tools and practice exams." />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">CILS B1 Exam Preparation</h1>
            <p className="text-muted-foreground">Your personalized study plan for the Italian citizenship test</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/mock-exam">
                <FileText className="mr-2 h-4 w-4" />
                Take Mock Exam
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/study-plan">
                <CalendarDays className="mr-2 h-4 w-4" />
                View Study Plan
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Countdown and Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Exam Countdown</CardTitle>
              <CardDescription>Time until next CILS B1 test date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">
                    {Math.ceil((nextExamDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Next exam: {nextExamDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
              <CardDescription>Your CILS B1 exam preparation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-sm pt-2">
                  <div>
                    <span className="text-muted-foreground">Completed: </span>
                    <span className="font-medium">{userStats.completedLessons}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-medium">{userStats.totalLessons}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Level</CardTitle>
              <CardDescription>Your estimated Italian proficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center">
                  {userStats.estimatedLevel}
                </div>
                <div>
                  <div className="font-medium">CILS B1 Readiness</div>
                  <div className="flex gap-1 mt-1">
                    <Badge 
                      variant="outline" 
                      className={userStats.readingScore >= 70 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                    >
                      Reading {userStats.readingScore}%
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={userStats.writingScore >= 70 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                    >
                      Writing {userStats.writingScore}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sections">Exam Sections</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="stats">Skills Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Learning Streak
                    </CardTitle>
                    <Badge>{userStats.streak} days</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You've been practicing Italian for {userStats.streak} consecutive days. Keep it up!
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button size="sm" variant="outline" className="w-full">
                    View Calendar
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Skill Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Strongest: {userStats.strongestSkill}</span>
                      <span className="text-green-600">{userStats.readingScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Weakest: {userStats.weakestSkill}</span>
                      <span className="text-amber-600">{userStats.speakingScore}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setActiveTab('stats')}>
                    See Detailed Analysis
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookType className="h-5 w-5 text-primary" />
                    Next Suggested Study
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Speaking Practice: Introductions</p>
                  <p className="text-sm text-muted-foreground">
                    Improve your weakest skill with focused practice.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button size="sm" className="w-full">
                    Start Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <h2 className="text-xl font-semibold mt-8">Continue Your Studies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examSections.slice(0, 3).map(section => (
                <ExamSectionCard
                  key={section.id}
                  section={section}
                  progress={section.progress}
                  isCompleted={section.isCompleted}
                  onStart={handleStartSection}
                  onContinue={handleContinueSection}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => setActiveTab('sections')}>
                View All Sections
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sections">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examSections.map(section => (
                <ExamSectionCard
                  key={section.id}
                  section={section}
                  progress={section.progress}
                  isCompleted={section.isCompleted}
                  onStart={handleStartSection}
                  onContinue={handleContinueSection}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your learning journey over the past weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {activity.type === 'mock-exam' && <FileText className="h-5 w-5 text-primary" />}
                        {activity.type === 'flashcards' && <BookOpen className="h-5 w-5 text-primary" />}
                        {activity.type === 'listening' && <Headphones className="h-5 w-5 text-primary" />}
                        {activity.type === 'writing' && <Pen className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <h3 className="font-medium">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {activity.date.toLocaleDateString()}, {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {activity.score && (
                            <Badge 
                              variant="outline" 
                              className={activity.score >= 70 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                            >
                              Score: {activity.score}%
                            </Badge>
                          )}
                          {activity.cards && (
                            <Badge variant="outline">
                              {activity.cards} cards reviewed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Language Skills Analysis</CardTitle>
                  <CardDescription>Your performance across all skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4 text-primary" />
                          Reading
                        </span>
                        <span>{userStats.readingScore}%</span>
                      </div>
                      <Progress value={userStats.readingScore} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Pen className="mr-2 h-4 w-4 text-primary" />
                          Writing
                        </span>
                        <span>{userStats.writingScore}%</span>
                      </div>
                      <Progress value={userStats.writingScore} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Headphones className="mr-2 h-4 w-4 text-primary" />
                          Listening
                        </span>
                        <span>{userStats.listeningScore}%</span>
                      </div>
                      <Progress value={userStats.listeningScore} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Mic className="mr-2 h-4 w-4 text-primary" />
                          Speaking
                        </span>
                        <span>{userStats.speakingScore}%</span>
                      </div>
                      <Progress value={userStats.speakingScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Language Components</CardTitle>
                  <CardDescription>Your mastery of Italian language elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <BookType className="mr-2 h-4 w-4 text-primary" />
                          Vocabulary
                        </span>
                        <span>{userStats.vocabularyScore}%</span>
                      </div>
                      <Progress value={userStats.vocabularyScore} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-primary" />
                          Grammar
                        </span>
                        <span>{userStats.grammarScore}%</span>
                      </div>
                      <Progress value={userStats.grammarScore} className="h-2" />
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <div>
                            <span className="font-medium">Focus on speaking practice</span>
                            <p className="text-sm text-muted-foreground">Your lowest score is in speaking. Regular conversation practice will help improve this skill.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <div>
                            <span className="font-medium">Review past tenses in grammar</span>
                            <p className="text-sm text-muted-foreground">Your grammar analytics show you need more practice with past tense forms.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          <div>
                            <span className="font-medium">Strengthen writing skills</span>
                            <p className="text-sm text-muted-foreground">Practice more formal writing exercises to improve your score.</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ExamPrepDashboard;
