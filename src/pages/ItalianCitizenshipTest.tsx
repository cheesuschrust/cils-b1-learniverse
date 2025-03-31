
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ItalianAIProvider } from '@/contexts/ItalianAIContext';
import { EnhancedErrorBoundary } from '@/components/EnhancedErrorBoundary';
import { CitizenshipContentProcessor } from '@/components/CitizenshipContentProcessor';
import { ItalianPracticeComponent } from '@/components/ItalianPracticeComponent';
import { CitizenshipReadinessComponent } from '@/components/CitizenshipReadinessComponent';
import { useAuth } from '@/contexts/AuthContext';
import { ItalianLevel, ItalianTestSection, AIGeneratedQuestion } from '@/types/italian-types';
import { Flag, BookOpen, PenTool, Ear, MessageSquare, Layers, CheckCircle } from 'lucide-react';

const ItalianCitizenshipTest = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('practice');
  
  // Practice settings
  const [level, setLevel] = useState<ItalianLevel>('B1');
  const [testSection, setTestSection] = useState<ItalianTestSection>('grammar');
  const [isCitizenshipMode, setIsCitizenshipMode] = useState(true);
  
  // Generator settings
  const [generatorSettings, setGeneratorSettings] = useState({
    italianLevel: 'B1' as ItalianLevel,
    testSection: 'culture' as ItalianTestSection,
    isCitizenshipFocused: true,
    topics: ['storia', 'cultura', 'costituzione']
  });
  
  // Questions state
  const [generatedQuestions, setGeneratedQuestions] = useState<AIGeneratedQuestion[]>([]);
  
  // Handle practice completion
  const handlePracticeComplete = (results: {score: number; time: number}) => {
    console.log('Practice completed:', results);
    // Here you would normally update user progress, show a celebration, etc.
  };
  
  // Handle content generation
  const handleQuestionsGenerated = (questions: AIGeneratedQuestion[]) => {
    setGeneratedQuestions(questions);
    setActiveTab('generatedContent');
  };
  
  // Sections map for icons
  const sectionIcons: Record<ItalianTestSection, React.ReactNode> = {
    grammar: <Layers className="h-4 w-4" />,
    vocabulary: <BookOpen className="h-4 w-4" />,
    culture: <Flag className="h-4 w-4" />,
    listening: <Ear className="h-4 w-4" />,
    reading: <BookOpen className="h-4 w-4" />,
    writing: <PenTool className="h-4 w-4" />,
    speaking: <MessageSquare className="h-4 w-4" />
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>Italian Citizenship Test Preparation</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Flag className="mr-2 h-6 w-6" />
          Italian Citizenship Test Preparation
        </h1>
        <p className="text-muted-foreground mt-1">
          Practice and prepare for the B1 Italian language test required for Italian citizenship
        </p>
      </div>
      
      <ItalianAIProvider>
        <EnhancedErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="practice" className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Question Generator
              </TabsTrigger>
              <TabsTrigger value="readiness" className="flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Readiness Check
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="practice" className="mt-0">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Practice Settings</CardTitle>
                  <CardDescription>
                    Configure your Italian practice session
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Italian Level</Label>
                      <Select value={level} onValueChange={(value) => setLevel(value as ItalianLevel)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1 (Beginner)</SelectItem>
                          <SelectItem value="A2">A2 (Elementary)</SelectItem>
                          <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                          <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                          <SelectItem value="C1">C1 (Advanced)</SelectItem>
                          <SelectItem value="C2">C2 (Proficiency)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="section">Test Section</Label>
                      <Select value={testSection} onValueChange={(value) => setTestSection(value as ItalianTestSection)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grammar">Grammar</SelectItem>
                          <SelectItem value="vocabulary">Vocabulary</SelectItem>
                          <SelectItem value="culture">Culture & Civics</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="speaking">Speaking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 flex items-end">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="citizenship-mode"
                          checked={isCitizenshipMode}
                          onCheckedChange={setIsCitizenshipMode}
                        />
                        <Label htmlFor="citizenship-mode">Citizenship Test Focus</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <ItalianPracticeComponent
                level={level}
                testSection={testSection}
                isCitizenshipMode={isCitizenshipMode}
                onComplete={handlePracticeComplete}
              />
            </TabsContent>
            
            <TabsContent value="generate" className="mt-0">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Question Generator</CardTitle>
                  <CardDescription>
                    Create custom Italian citizenship test questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gen-level">Italian Level</Label>
                      <Select 
                        value={generatorSettings.italianLevel} 
                        onValueChange={(value) => setGeneratorSettings({
                          ...generatorSettings,
                          italianLevel: value as ItalianLevel
                        })}
                      >
                        <SelectTrigger id="gen-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1 (Beginner)</SelectItem>
                          <SelectItem value="A2">A2 (Elementary)</SelectItem>
                          <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                          <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                          <SelectItem value="C1">C1 (Advanced)</SelectItem>
                          <SelectItem value="C2">C2 (Proficiency)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gen-section">Content Focus</Label>
                      <Select 
                        value={generatorSettings.testSection} 
                        onValueChange={(value) => setGeneratorSettings({
                          ...generatorSettings,
                          testSection: value as ItalianTestSection
                        })}
                      >
                        <SelectTrigger id="gen-section">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grammar">Grammar</SelectItem>
                          <SelectItem value="vocabulary">Vocabulary</SelectItem>
                          <SelectItem value="culture">Culture & Civics</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="speaking">Speaking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="citizenship-focus" 
                      checked={generatorSettings.isCitizenshipFocused}
                      onCheckedChange={(checked) => setGeneratorSettings({
                        ...generatorSettings,
                        isCitizenshipFocused: checked
                      })}
                    />
                    <Label htmlFor="citizenship-focus">Focus on citizenship test content</Label>
                  </div>
                </CardContent>
              </Card>
              
              <CitizenshipContentProcessor
                settings={generatorSettings}
                onContentGenerated={handleQuestionsGenerated}
              />
            </TabsContent>
            
            <TabsContent value="readiness" className="mt-0">
              {user ? (
                <CitizenshipReadinessComponent userId={user.id} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        Please log in to view your citizenship test readiness.
                      </p>
                      <Button className="mt-4">Login</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="generatedContent" className="mt-0">
              {generatedQuestions.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Questions</CardTitle>
                    <CardDescription>
                      Use these questions for your citizenship test preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {generatedQuestions.map((question, index) => (
                        <div key={question.id} className="p-4 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                              {index + 1}
                            </span>
                            <span>{question.text}</span>
                          </div>
                          {question.options && (
                            <div className="ml-8 mt-2 space-y-1">
                              {question.options.map((option, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{String.fromCharCode(65 + idx)}.</span>
                                  <span>{option}</span>
                                </div>
                              ))}
                              <div className="mt-2 text-primary font-medium">
                                Correct Answer: {question.correctAnswer}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No questions have been generated yet. Go to the Question Generator tab to create questions.
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => setActiveTab('generate')}
                      >
                        Go to Generator
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </EnhancedErrorBoundary>
      </ItalianAIProvider>
    </div>
  );
};

export default ItalianCitizenshipTest;
