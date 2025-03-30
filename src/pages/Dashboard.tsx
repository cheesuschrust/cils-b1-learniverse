
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useExam } from '@/contexts/ExamContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ExamSectionCard from '@/components/exam/ExamSectionCard';
import { CalendarDays, ChevronRight, LineChart, Book, Trophy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { exams, examProgress, activeExamId, setActiveExamId } = useExam();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  // Calculate overall progress
  const overallProgress = examProgress ? 
    Object.values(examProgress.sectionProgress).reduce((acc, section) => 
      section.completed ? acc + 1 : acc + (section.correctAnswers / section.totalQuestions || 0), 0) / 
      Object.keys(examProgress.sectionProgress).length * 100 : 0;
  
  const activeExam = exams.find(exam => exam.id === activeExamId);
  
  const handleStartSection = (sectionId: string) => {
    const section = activeExam?.sections.find(s => s.id === sectionId);
    if (section) {
      switch(section.type) {
        case 'reading':
          navigate('/app/reading');
          break;
        case 'writing':
          navigate('/app/writing');
          break;
        case 'listening':
          navigate('/app/listening');
          break;
        case 'speaking':
          navigate('/app/speaking');
          break;
        case 'grammar':
        case 'vocabulary':
          navigate('/app/multiple-choice');
          break;
        default:
          navigate('/app/dashboard');
      }
    }
  };
  
  const handleContinueSection = handleStartSection;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <>
      <Helmet>
        <title>Dashboard | CILS B1 Learniverse</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.firstName || 'Student'}</h1>
              <p className="text-muted-foreground">
                Track your progress and continue your CILS B1 preparation
              </p>
            </div>
            
            <Button onClick={() => navigate('/app/flashcards')}>
              Practice Flashcards
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Overview Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your CILS B1 Journey</CardTitle>
              <CardDescription>
                Overall progress for {activeExam?.title || 'CILS B1 Exam'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Clock className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-lg font-medium">42 days</p>
                      <p className="text-sm text-muted-foreground">until your target exam date</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Book className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-lg font-medium">428</p>
                      <p className="text-sm text-muted-foreground">vocabulary items studied</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <LineChart className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-lg font-medium">76%</p>
                      <p className="text-sm text-muted-foreground">average quiz score</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Trophy className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-lg font-medium">12</p>
                      <p className="text-sm text-muted-foreground">study streak days</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Exam Sections */}
          <div>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="schedule">Study Schedule</TabsTrigger>
                  <TabsTrigger value="exams">CILS Exams</TabsTrigger>
                </TabsList>
                
                {exams.length > 1 && activeTab === 'overview' && (
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">Exam:</span>
                    <select 
                      value={activeExamId || ''} 
                      onChange={(e) => setActiveExamId(e.target.value)}
                      className="text-sm p-2 rounded border bg-background"
                    >
                      {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>{exam.title}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <TabsContent value="overview" className="space-y-4">
                <h3 className="text-lg font-medium">Exam Sections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {activeExam?.sections.map((section) => {
                    const sectionProgress = examProgress?.sectionProgress[section.id];
                    const progress = sectionProgress
                      ? (sectionProgress.correctAnswers / sectionProgress.totalQuestions) * 100
                      : 0;
                    
                    return (
                      <ExamSectionCard
                        key={section.id}
                        section={section}
                        progress={progress}
                        isCompleted={sectionProgress?.completed || false}
                        onStart={handleStartSection}
                        onContinue={handleContinueSection}
                      />
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Study Schedule</h3>
                  <Button variant="outline" size="sm">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Set Exam Date
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground mb-4">
                      Set up your exam date to get a personalized study plan
                    </p>
                    
                    <div className="flex flex-col items-center justify-center p-8">
                      <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
                      <h4 className="text-xl font-medium mb-2">No Study Plan Yet</h4>
                      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                        Set your target CILS B1 exam date to generate a personalized study plan that will help you prepare effectively.
                      </p>
                      <Button>
                        Create Study Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="exams" className="space-y-4">
                <h3 className="text-lg font-medium">Available CILS B1 Exams</h3>
                
                <div className="grid gap-4">
                  {exams.map((exam) => (
                    <Card key={exam.id} className={exam.id === activeExamId ? 'border-primary' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle>{exam.title}</CardTitle>
                          {exam.id === activeExamId && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <CardDescription>{exam.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex justify-between text-sm py-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{exam.totalTime} minutes</span>
                          </div>
                          <div>
                            {exam.sections.length} sections
                          </div>
                        </div>
                      </CardContent>
                      
                      <div className="px-6 pb-6">
                        <Button
                          variant={exam.id === activeExamId ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setActiveExamId(exam.id)}
                        >
                          {exam.id === activeExamId ? "Currently Selected" : "Select Exam"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
