
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItalianPracticeComponent } from '@/components/ItalianPracticeComponent';
import { CitizenshipContentProcessor } from '@/components/CitizenshipContentProcessor';
import CitizenshipReadinessComponent from '@/components/CitizenshipReadinessComponent';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Award, BookOpen, CheckCircle, Circle, Dices } from 'lucide-react';
import { ItalianTestSection, ItalianLevel } from '@/types/italian-types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ItalianCitizenshipTest() {
  const { user } = useAuth();
  const userId = user?.id || '';
  
  const [activeSection, setActiveSection] = useState<ItalianTestSection>('grammar');
  const [examLevel] = useState<ItalianLevel>('intermediate');
  
  // Simulated section completion data
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
    grammar: false,
    vocabulary: false,
    culture: false,
    listening: false,
    reading: false,
    writing: false,
    speaking: false,
    citizenship: false
  });

  const handleSectionComplete = (section: ItalianTestSection, score: number) => {
    if (score >= 70) {
      setCompletedSections(prev => ({ ...prev, [section]: true }));
    }
  };
  
  const completionPercentage = Object.values(completedSections).filter(Boolean).length / 
                              Object.keys(completedSections).length * 100;
  
  // Testing sections content
  const testSections: Record<ItalianTestSection, React.ReactNode> = {
    grammar: <ItalianPracticeComponent initialSection="grammar" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('grammar', score)} userId={userId} />,
    vocabulary: <ItalianPracticeComponent initialSection="vocabulary" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('vocabulary', score)} userId={userId} />,
    culture: <ItalianPracticeComponent initialSection="culture" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('culture', score)} userId={userId} />,
    listening: <ItalianPracticeComponent initialSection="listening" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('listening', score)} userId={userId} />,
    reading: <ItalianPracticeComponent initialSection="reading" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('reading', score)} userId={userId} />,
    writing: <ItalianPracticeComponent initialSection="writing" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('writing', score)} userId={userId} />,
    speaking: <ItalianPracticeComponent initialSection="speaking" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('speaking', score)} userId={userId} />,
    citizenship: <ItalianPracticeComponent initialSection="culture" level="intermediate" isCitizenshipMode={true} onComplete={({score}) => handleSectionComplete('citizenship', score)} userId={userId} />
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Italian Citizenship Test Preparation</h1>
            <p className="text-muted-foreground">
              Prepare for your Italian citizenship test with our comprehensive resources and practice exams
            </p>
          </div>
          
          <Card className="w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Readiness Level</p>
                    <p className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</p>
                  </div>
                </div>
                <Progress value={completionPercentage} className="w-[100px]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Areas</CardTitle>
                <CardDescription>Track your progress in each test section</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  {Object.entries(completedSections).map(([section, isCompleted]) => (
                    <Button
                      key={section}
                      variant={activeSection === section ? "default" : "ghost"}
                      className="justify-start rounded-none h-12"
                      onClick={() => setActiveSection(section as ItalianTestSection)}
                    >
                      <div className="flex items-center">
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 mr-2" />
                        )}
                        <span className="capitalize">{section}</span>
                      </div>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Study Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Official Practice Tests</p>
                  <p className="text-xs text-muted-foreground">Access government-approved practice exams</p>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                    Access <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Italian History & Civics</p>
                  <p className="text-xs text-muted-foreground">Study guides for the cultural portion</p>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                    View guides <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Language Requirements</p>
                  <p className="text-xs text-muted-foreground">B1 level competency guides</p>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                    Review <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Dices className="h-4 w-4" /> Practice Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a full simulated citizenship test to assess your readiness
                </p>
                <Button className="w-full">
                  Start Practice Exam
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-9">
            <Tabs defaultValue="practice" className="space-y-4">
              <TabsList>
                <TabsTrigger value="practice">Practice Exercises</TabsTrigger>
                <TabsTrigger value="content-generator">Content Generator</TabsTrigger>
                <TabsTrigger value="readiness">Readiness Assessment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="practice" className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight capitalize">{activeSection} Practice</h2>
                {testSections[activeSection as ItalianTestSection]}
              </TabsContent>
              
              <TabsContent value="content-generator">
                <Card>
                  <CardHeader>
                    <CardTitle>Italian Citizenship Content Generator</CardTitle>
                    <CardDescription>
                      Paste Italian content to generate customized citizenship test questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CitizenshipContentProcessor />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="readiness">
                <Card>
                  <CardHeader>
                    <CardTitle>Citizenship Test Readiness</CardTitle>
                    <CardDescription>
                      Evaluate your preparation level for the official Italian citizenship test
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CitizenshipReadinessComponent 
                      level={examLevel}
                      readinessScore={completionPercentage}
                      assessmentAvailable={completionPercentage >= 50}
                      onStartAssessment={() => console.log('Starting assessment')}
                      lastAssessmentDate={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
