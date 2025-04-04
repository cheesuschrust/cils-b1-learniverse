
import { useState } from 'react';  
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';  
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';  
import { Button } from '@/components/ui/button';  
import { Progress } from '@/components/ui/progress';  
import { ArrowRight, Award, BookOpen, Circle, CheckCircle } from 'lucide-react';  
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/common/AuthGuard';
import QuestionAnsweringComponent from '@/components/learning/QuestionAnsweringComponent';
import { SpeakingModule } from '@/components/speaking/SpeakingModule';
import { Badge } from '@/components/ui/badge';

// Mock questions for citizenship test
const citizenshipQuestions = [
  {
    id: '1',
    text: 'Quale documento è necessario per richiedere la cittadinanza italiana?',
    options: [
      'Patente di guida',
      'Certificato di nascita',
      'Attestato di lingua italiana B1',
      'Carta di credito'
    ],
    correctAnswer: 'Attestato di lingua italiana B1',
    explanation: 'Per richiedere la cittadinanza italiana è necessario un attestato di conoscenza della lingua italiana almeno di livello B1.'
  },
  {
    id: '2',
    text: 'Qual è la capitale d\'Italia?',
    options: [
      'Milano',
      'Roma',
      'Napoli',
      'Venezia'
    ],
    correctAnswer: 'Roma',
    explanation: 'Roma è la capitale d\'Italia e sede del governo italiano.'
  },
  {
    id: '3',
    text: 'Chi è il Presidente della Repubblica Italiana?',
    options: [
      'Il capo del governo',
      'Il primo ministro',
      'Il capo dello stato',
      'Il re d\'Italia'
    ],
    correctAnswer: 'Il capo dello stato',
    explanation: 'Il Presidente della Repubblica è il capo dello stato italiano e rappresenta l\'unità nazionale.'
  },
  {
    id: '4',
    text: 'Quale documento certifica il livello di conoscenza della lingua italiana?',
    options: [
      'CILS',
      'TOEFL',
      'SAT',
      'HSK'
    ],
    correctAnswer: 'CILS',
    explanation: 'La certificazione CILS (Certificazione di Italiano come Lingua Straniera) è riconosciuta per attestare il livello di conoscenza della lingua italiana.'
  },
];

export default function ItalianCitizenshipTest() {
  const { user } = useAuth();
  const userId = user?.id || '';
  
  const [activeSection, setActiveSection] = useState('grammar');
  const [examLevel] = useState('intermediate');
  
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

  const handleSectionComplete = (section: string, score: number) => {
    if (score >= 70) {
      setCompletedSections(prev => ({ ...prev, [section]: true }));
    }
  };
  
  const completionPercentage = Object.values(completedSections).filter(Boolean).length / 
                              Object.keys(completedSections).length * 100;
  
  return (
    <AuthGuard>
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
                        onClick={() => setActiveSection(section)}
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
            </div>
            
            <div className="md:col-span-9">
              <Tabs defaultValue="practice" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="practice">Practice Exercises</TabsTrigger>
                  <TabsTrigger value="assessment">Readiness Assessment</TabsTrigger>
                  <TabsTrigger value="mock-exam">Mock Exam</TabsTrigger>
                </TabsList>
                
                <TabsContent value="practice" className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight capitalize">{activeSection} Practice</h2>
                  
                  {activeSection === 'citizenship' && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Practice answering questions about Italian culture, history, and government that may appear on the citizenship test.
                      </p>
                      <QuestionAnsweringComponent 
                        questions={citizenshipQuestions} 
                        contentType="citizenship"
                        difficultyLevel="intermediate"
                        onComplete={({score}) => handleSectionComplete('citizenship', score)}
                        userId={userId}
                      />
                    </div>
                  )}
                  
                  {activeSection === 'speaking' && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Practice your Italian speaking skills with citizenship-focused phrases and questions.
                      </p>
                      <div className="bg-muted p-1 rounded-md">
                        <Badge className="mb-2">Citizenship Focus</Badge>
                        <SpeakingModule />
                      </div>
                    </div>
                  )}
                  
                  {activeSection !== 'citizenship' && activeSection !== 'speaking' && (
                    <div className="bg-muted p-6 rounded-lg text-center space-y-4">
                      <p>Select a section from the menu to practice specific skills needed for the citizenship exam.</p>
                      <Button onClick={() => setActiveSection('citizenship')}>
                        Start with Citizenship Questions
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="assessment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Citizenship Test Readiness Assessment</CardTitle>
                      <CardDescription>
                        Take a comprehensive assessment to evaluate your preparation level
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Assessment Overview</h3>
                        <p className="mb-4">This assessment will evaluate your readiness for the Italian citizenship test by testing your knowledge in the following areas:</p>
                        
                        <ul className="space-y-2 list-disc pl-5 mb-4">
                          <li>Italian language proficiency (B1 level)</li>
                          <li>Italian history and culture</li>
                          <li>Italian government and politics</li>
                          <li>Italian geography</li>
                          <li>Rights and duties of Italian citizens</li>
                        </ul>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          The assessment takes approximately 30 minutes to complete and consists of 50 questions.
                        </p>
                        
                        <Button>Start Assessment</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mock-exam">
                  <Card>
                    <CardHeader>
                      <CardTitle>CILS B1 Citizenship Mock Exam</CardTitle>
                      <CardDescription>
                        Take a full practice exam under timed conditions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted p-6 rounded-lg text-center space-y-4">
                        <h3 className="text-lg font-semibold">Full Mock Exam</h3>
                        <p className="max-w-md mx-auto">
                          This is a complete simulation of the CILS B1 Citizenship exam, including all sections:
                          listening, reading, writing, and speaking.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                          <Button>
                            Start Full Exam (2 hours)
                          </Button>
                          <Button variant="outline">
                            Choose Specific Sections
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
