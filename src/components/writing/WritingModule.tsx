
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  Save,
  Send,
  HelpCircle,
  Book
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface WritingPrompt {
  id: string;
  title: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  exampleResponse?: string;
  tips?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'general' | 'formal' | 'creative' | 'academic';
}

interface FeedbackItem {
  type: 'grammar' | 'vocabulary' | 'structure' | 'content';
  severity: 'low' | 'medium' | 'high';
  text: string;
  suggestion?: string;
  explanation?: string;
}

interface AIFeedback {
  score: {
    grammar: number;
    vocabulary: number;
    structure: number;
    content: number;
    overall: number;
  };
  feedback: FeedbackItem[];
  summary: string;
  strengths: string[];
  improvements: string[];
}

const WritingModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isPremium = user?.isPremiumUser || false;
  
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [showExampleResponse, setShowExampleResponse] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [availablePrompts, setAvailablePrompts] = useState<WritingPrompt[]>([]);
  
  // Mock prompts
  React.useEffect(() => {
    const mockPrompts: WritingPrompt[] = [
      {
        id: '1',
        title: 'La Mia Città Preferita',
        prompt: 'Descrivi la tua città preferita in Italia. Parla dei luoghi da visitare, del cibo locale, e perché ti piace questa città.',
        minWords: 80,
        maxWords: 150,
        tips: [
          'Usa aggettivi descrittivi',
          'Includi punti di riferimento famosi',
          'Menziona la cucina locale',
          'Spiega perché ti piace questa città'
        ],
        exampleResponse: 'La mia città preferita in Italia è Firenze. È una città bellissima nel cuore della Toscana, famosa per la sua storia, arte e architettura. Quando visiti Firenze, devi assolutamente vedere il Duomo con la sua cupola imponente disegnata da Brunelleschi. La Galleria degli Uffizi ospita capolavori di artisti come Botticelli e Leonardo da Vinci. Mi piace passeggiare sul Ponte Vecchio, un ponte medievale con tanti negozi di gioielli. La cucina fiorentina è deliziosa: la bistecca alla fiorentina è un piatto tipico che tutti dovrebbero provare. Mi piace Firenze perché combina storia, cultura e un'atmosfera rilassante. Le persone sono amichevoli e la città ha un ritmo di vita piacevole.',
        difficulty: 'beginner',
        category: 'general'
      }
    ];
    
    setAvailablePrompts(mockPrompts);
    // Auto-select first prompt
    setSelectedPrompt(mockPrompts[0]);
  }, []);
  
  // Update word count when user types
  React.useEffect(() => {
    const words = userResponse.trim() ? userResponse.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [userResponse]);
  
  const handleSubmit = () => {
    if (!selectedPrompt) return;
    
    // For free users, check if they've already used their daily exercise
    if (!isPremium) {
      const hasUsedDaily = localStorage.getItem('writingExerciseUsed') === 'true';
      if (hasUsedDaily) {
        setShowPremiumDialog(true);
        return;
      }
    }
    
    setIsSubmitting(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      // Mock feedback
      const mockFeedback: AIFeedback = {
        score: {
          grammar: 75,
          vocabulary: 80,
          structure: 70,
          content: 85,
          overall: 78
        },
        feedback: [
          {
            type: 'grammar',
            severity: 'medium',
            text: 'Attenzione all\'uso degli articoli',
            suggestion: 'Verifica gli articoli "il", "la", "i", "le" prima dei sostantivi',
            explanation: 'In italiano, gli articoli devono concordare in genere e numero con il sostantivo.'
          },
          {
            type: 'vocabulary',
            severity: 'low',
            text: 'Usa sinonimi per evitare ripetizioni',
            suggestion: 'Invece di ripetere "bello" prova con "meraviglioso", "stupendo", "affascinante"',
            explanation: 'Un vocabolario più ricco rende il testo più interessante e dimostra una maggiore padronanza della lingua.'
          }
        ],
        summary: 'Hai scritto un buon testo descrittivo con un vocabolario appropriato. La struttura è chiara e il contenuto è rilevante al tema. Ci sono alcuni errori grammaticali da correggere.',
        strengths: [
          'Buon uso di aggettivi descrittivi',
          'Contenuto rilevante al tema',
          'Struttura logica'
        ],
        improvements: [
          'Attenzione alla concordanza degli articoli',
          'Espandi il vocabolario con sinonimi',
          'Usa una maggiore varietà di connettivi'
        ]
      };
      
      setFeedback(mockFeedback);
      setIsSubmitting(false);
      
      // For free users, mark as used
      if (!isPremium) {
        localStorage.setItem('writingExerciseUsed', 'true');
      }
      
      toast({
        title: "Analysis complete",
        description: "Your writing has been analyzed.",
      });
    }, 2000);
  };
  
  const handleNewPrompt = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    
    // For premium users, rotate through prompts
    const currentIndex = availablePrompts.findIndex(p => p.id === selectedPrompt?.id);
    const nextIndex = (currentIndex + 1) % availablePrompts.length;
    setSelectedPrompt(availablePrompts[nextIndex]);
    setUserResponse('');
    setFeedback(null);
  };
  
  const handleReset = () => {
    setUserResponse('');
    setFeedback(null);
  };
  
  const handleSaveToNotes = () => {
    toast({
      title: "Saved to notes",
      description: "Your writing exercise has been saved to your notes.",
    });
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar':
        return <Book className="h-4 w-4" />;
      case 'vocabulary':
        return <Book className="h-4 w-4" />;
      case 'structure':
        return <AlertTriangle className="h-4 w-4" />;
      case 'content':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };
  
  if (!selectedPrompt) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Writing Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedPrompt.title}</CardTitle>
              <CardDescription>
                <span className="capitalize">{selectedPrompt.difficulty}</span> level · <span className="capitalize">{selectedPrompt.category}</span> · {selectedPrompt.minWords}-{selectedPrompt.maxWords} words
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-base">{selectedPrompt.prompt}</p>
              
              {selectedPrompt.tips && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Writing Tips:</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {selectedPrompt.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedPrompt.exampleResponse && (
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowExampleResponse(!showExampleResponse)}
                  >
                    {showExampleResponse ? 'Hide Example' : 'Show Example'}
                  </Button>
                </div>
              )}
              
              {showExampleResponse && selectedPrompt.exampleResponse && (
                <div className="border rounded-md p-4 bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">Example Response:</h3>
                  <p className="text-sm italic">{selectedPrompt.exampleResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Response</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {wordCount} words
                  {selectedPrompt.minWords > 0 && wordCount < selectedPrompt.minWords && (
                    <span className="text-amber-500 ml-1">
                      (need {selectedPrompt.minWords - wordCount} more)
                    </span>
                  )}
                  {selectedPrompt.maxWords > 0 && wordCount > selectedPrompt.maxWords && (
                    <span className="text-red-500 ml-1">
                      ({wordCount - selectedPrompt.maxWords} words over limit)
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write your response here..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                rows={10}
                className="resize-none"
                disabled={isSubmitting}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={isSubmitting || !userResponse}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || 
                    !userResponse || 
                    (selectedPrompt.minWords > 0 && wordCount < selectedPrompt.minWords)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit for Feedback
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle>AI Feedback</CardTitle>
                <CardDescription>
                  Analysis of your writing
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Overall Score</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">{feedback.score.overall}%</div>
                    <Progress 
                      value={feedback.score.overall} 
                      className="h-2 flex-1" 
                      indicatorClassName={
                        feedback.score.overall >= 80 ? "bg-green-600" :
                        feedback.score.overall >= 60 ? "bg-amber-500" :
                        "bg-red-500"
                      }
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Grammar</h3>
                    <Progress value={feedback.score.grammar} className="h-1.5" />
                    <p className="text-xs text-right">{feedback.score.grammar}%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Vocabulary</h3>
                    <Progress value={feedback.score.vocabulary} className="h-1.5" />
                    <p className="text-xs text-right">{feedback.score.vocabulary}%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Structure</h3>
                    <Progress value={feedback.score.structure} className="h-1.5" />
                    <p className="text-xs text-right">{feedback.score.structure}%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Content</h3>
                    <Progress value={feedback.score.content} className="h-1.5" />
                    <p className="text-xs text-right">{feedback.score.content}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Summary</h3>
                  <p className="text-sm text-muted-foreground">{feedback.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Strengths</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Areas for Improvement</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {feedback.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Detailed Feedback</h3>
                  
                  {feedback.feedback.map((item, index) => (
                    <div key={index} className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <span className="font-medium capitalize">{item.type}</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className={getSeverityColor(item.severity)}>
                                {item.severity}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {item.severity === 'low' && 'Minor issue, easy to fix'}
                                {item.severity === 'medium' && 'Important issue to address'}
                                {item.severity === 'high' && 'Critical issue, needs attention'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <p className="text-sm">{item.text}</p>
                      
                      {item.suggestion && (
                        <div className="bg-muted p-2 rounded text-sm">
                          <span className="font-medium">Suggestion: </span>
                          {item.suggestion}
                        </div>
                      )}
                      
                      {item.explanation && (
                        <p className="text-xs text-muted-foreground">{item.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={handleSaveToNotes}>
                    <Save className="h-4 w-4 mr-2" />
                    Save to Notes
                  </Button>
                  <Button onClick={handleNewPrompt}>
                    Try Another Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Writing Tools</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Practice your Italian writing skills with guided prompts and receive AI feedback.
              </p>
              
              <h3 className="font-medium text-sm">Writing Tips:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Plan your response before writing</li>
                <li>Use connective words to create flow</li>
                <li>Vary your sentence structures</li>
                <li>Incorporate vocabulary from recent lessons</li>
                <li>Proofread for grammar and spelling before submitting</li>
              </ul>
              
              <h3 className="font-medium text-sm mt-4">Grammar Resources:</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-auto py-1 text-xs justify-start">
                  Verb Conjugations
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-1 text-xs justify-start">
                  Prepositions Guide
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-1 text-xs justify-start">
                  Conjunctions List
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-1 text-xs justify-start">
                  Common Phrases
                </Button>
              </div>
              
              {!isPremium && (
                <div className="p-4 mt-4 border rounded-md bg-primary/5">
                  <h4 className="text-sm font-medium">Free User Limit</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free users can submit one writing exercise per day.
                    Upgrade to Premium for unlimited writing practice with AI feedback.
                  </p>
                  <Button className="w-full mt-2" size="sm">
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Premium Feature</DialogTitle>
            <DialogDescription>
              Free users can submit one writing exercise per day.
              Upgrade to Premium for unlimited writing practice with AI feedback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <h4 className="font-medium">Premium Benefits:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Unlimited writing exercises</li>
              <li>Full AI grammar analysis</li>
              <li>Advanced vocabulary suggestions</li>
              <li>Access to all difficulty levels</li>
              <li>Detailed feedback and improvement tracking</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Not Now
            </Button>
            <Button>Upgrade to Premium</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WritingModule;
