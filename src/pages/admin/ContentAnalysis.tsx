
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import AIContentProcessor from '@/components/ai/AIContentProcessor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useSystemLog } from '@/hooks/use-system-log';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Question types for the generated content
interface GeneratedQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation?: string;
  category: string;
}

const ContentAnalysis = () => {
  const { logSystemAction } = useSystemLog();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [processingStatus, setProcessingStatus] = useState({
    inProgress: false,
    stage: '',
    progress: 0,
    errorMessage: '',
    success: false,
    questionsGenerated: 0
  });
  
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [contentExtracted, setContentExtracted] = useState<{
    words: Array<{word: string, translation: string}>;
    phrases: Array<{phrase: string, translation: string}>;
    grammarPoints: string[];
  }>({
    words: [],
    phrases: [],
    grammarPoints: []
  });
  
  useEffect(() => {
    logSystemAction('Viewed AI Content Analysis page');
  }, [logSystemAction]);
  
  const handleFileProcessed = useCallback((data: any) => {
    // Simulate successful processing with actual questions
    const questions: GeneratedQuestion[] = [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'Quale è il significato di "la portata"?',
        options: ['Range, reach, scope', 'The door', 'The importance', 'The course'],
        correctAnswer: 0,
        difficulty: 'intermediate',
        explanation: 'La parola "portata" si riferisce all\'estensione o all\'ambito di qualcosa.',
        category: 'vocabulary'
      },
      {
        id: '2',
        type: 'multiple-choice',
        question: 'Cosa significa "diventare"?',
        options: ['To become', 'To go', 'To prevent', 'To have'],
        correctAnswer: 0,
        difficulty: 'beginner',
        explanation: 'Il verbo "diventare" significa trasformarsi in qualcosa o assumere una nuova condizione.',
        category: 'vocabulary'
      },
      {
        id: '3',
        type: 'speaking',
        question: 'Come ti presenteresti in italiano ad un nuovo amico?',
        difficulty: 'intermediate',
        category: 'speaking'
      }
    ];
    
    setGeneratedQuestions(questions);
    
    // Extract content from the processed file
    setContentExtracted({
      words: [
        {word: 'persino', translation: 'even'},
        {word: 'tizio', translation: 'guy'},
        {word: 'diventare', translation: 'to become'},
        {word: 'la portata', translation: 'Range, reach, scope'},
        {word: 'Oltre', translation: 'Beyond, further'},
        {word: 'capace', translation: 'capable, able'}
      ],
      phrases: [
        {phrase: 'buono a sapersi', translation: 'That\'s good to know.'},
        {phrase: 'il scopo, i scopi', translation: 'purpose, aim, goal'},
        {phrase: 'il catalogo', translation: 'catalog, list'},
        {phrase: 'Lasciare il pacco all\'interno del cancello', translation: 'Leave the package inside the gate'}
      ],
      grammarPoints: [
        'Use of prepositions with places',
        'Present tense of irregular verbs'
      ]
    });
    
    setProcessingStatus({
      inProgress: false,
      stage: 'Complete',
      progress: 100,
      errorMessage: '',
      success: true,
      questionsGenerated: 3
    });
    
    toast({
      title: "Processing complete",
      description: "Your content has been analyzed and questions generated successfully.",
    });
    
    setActiveTab('process');
  }, [toast]);
  
  const handleProcessingProgress = useCallback((stage: string, progress: number) => {
    setProcessingStatus(prev => ({
      ...prev,
      inProgress: true,
      stage,
      progress
    }));
  }, []);
  
  const handleProcessingError = useCallback((message: string) => {
    setProcessingStatus(prev => ({
      ...prev,
      inProgress: false,
      errorMessage: message,
      success: false
    }));
    
    toast({
      title: "Processing error",
      description: message,
      variant: "destructive"
    });
  }, [toast]);
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>AI Content Analysis | Admin</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Content Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload and analyze content to automatically generate learning materials
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Content
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Process Results
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Generated Questions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Content for Analysis</CardTitle>
              <CardDescription>
                Upload text, PDF, or audio files to be analyzed by our AI system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIContentProcessor 
                onProcessingStart={() => {
                  setProcessingStatus({
                    ...processingStatus,
                    inProgress: true,
                    errorMessage: '',
                    success: false
                  });
                  
                  // Simulate processing stages with timeouts
                  setTimeout(() => handleProcessingProgress('Extracting text from document', 10), 1000);
                  setTimeout(() => handleProcessingProgress('Analyzing language content', 30), 3000);
                  setTimeout(() => handleProcessingProgress('Identifying vocabulary and phrases', 50), 5000);
                  setTimeout(() => handleProcessingProgress('Generating questions', 70), 7000);
                  setTimeout(() => handleProcessingProgress('Finalizing content', 90), 9000);
                  setTimeout(() => handleFileProcessed(null), 10000);
                }}
                onProcessingComplete={handleFileProcessed}
                onProcessingError={handleProcessingError}
                onProgress={handleProcessingProgress}
              />
              
              {processingStatus.inProgress && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{processingStatus.stage || 'Processing'}</p>
                    <span className="text-sm text-muted-foreground">{processingStatus.progress}%</span>
                  </div>
                  <Progress value={processingStatus.progress} className="h-2" />
                </div>
              )}
              
              {processingStatus.errorMessage && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {processingStatus.errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
              <CardDescription>
                View the analysis results and categorized content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processingStatus.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-medium">Processing complete!</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Content Type</h3>
                      <p>Italian vocabulary and examples</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Confidence Score</h3>
                      <p>92% confidence</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Questions Generated</h3>
                      <p>{processingStatus.questionsGenerated} questions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="font-medium">Extracted Content</h3>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted/30 p-3 border-b">
                        <h4 className="font-medium">Vocabulary</h4>
                      </div>
                      <div className="p-3 max-h-60 overflow-y-auto space-y-2">
                        {contentExtracted.words.map((item, index) => (
                          <div key={index} className="flex justify-between py-1 border-b border-border/20 last:border-0">
                            <span className="font-medium">{item.word}</span>
                            <span className="text-muted-foreground">{item.translation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted/30 p-3 border-b">
                        <h4 className="font-medium">Phrases</h4>
                      </div>
                      <div className="p-3 max-h-60 overflow-y-auto space-y-2">
                        {contentExtracted.phrases.map((item, index) => (
                          <div key={index} className="flex justify-between py-1 border-b border-border/20 last:border-0">
                            <span className="font-medium">{item.phrase}</span>
                            <span className="text-muted-foreground">{item.translation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="flex items-center gap-1"
                      onClick={() => setActiveTab('questions')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      View Generated Questions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No processing results available yet. Please upload and process content first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>
                Review and edit the automatically generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processingStatus.success ? (
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Multiple Choice Questions</h3>
                    <div className="space-y-4">
                      {generatedQuestions
                        .filter(q => q.type === 'multiple-choice')
                        .map(question => (
                          <div key={question.id} className="border p-4 rounded-lg bg-background">
                            <p className="font-medium">{question.question}</p>
                            <div className="mt-2 space-y-2">
                              {question.options?.map((option, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full ${idx === question.correctAnswer ? 'bg-green-500 flex items-center justify-center text-white text-xs' : 'border'}`}>
                                    {idx === question.correctAnswer && '✓'}
                                  </div>
                                  <p>{option}</p>
                                </div>
                              ))}
                            </div>
                            
                            {question.explanation && (
                              <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                                <p><span className="font-medium">Explanation:</span> {question.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Speaking Practice</h3>
                    <div className="space-y-4">
                      {generatedQuestions
                        .filter(q => q.type === 'speaking')
                        .map(question => (
                          <div key={question.id} className="border p-4 rounded-lg bg-background">
                            <p className="font-medium">{question.question}</p>
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">Expected elements in response:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                <li>Saluto (Ciao, Buongiorno)</li>
                                <li>Nome e cognome</li>
                                <li>Età o provenienza</li>
                                <li>Hobby o professione</li>
                              </ul>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      Save to Question Bank
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No questions have been generated yet. Please upload and process content first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentAnalysis;
