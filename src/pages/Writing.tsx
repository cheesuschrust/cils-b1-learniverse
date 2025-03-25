
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCcw, 
  Send, 
  BookOpen, 
  Pencil, 
  Lightbulb,
  Sparkles,
  Clock,
  AlertTriangle,
  RotateCcw,
  Edit,
  Save
} from 'lucide-react';

interface WritingPrompt {
  id: string;
  title: string;
  prompt: string;
  type: 'essay' | 'creative' | 'email' | 'description';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wordLimit: number;
  timeLimit?: number; // in minutes
  sampleResponse?: string;
  keywords?: string[];
}

interface FeedbackDetail {
  type: 'grammar' | 'vocabulary' | 'structure' | 'content' | 'positive';
  text: string;
  suggestion?: string;
  range?: [number, number]; // start and end index in the text
}

interface WritingFeedback {
  score: number;
  summary: string;
  details: FeedbackDetail[];
  improvedVersion?: string;
}

// Sample writing prompts
const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'beginner-email-1',
    title: 'Introducing Yourself',
    prompt: 'Write an email to your new Italian pen pal introducing yourself. Include your name, age, where you live, and your hobbies.',
    type: 'email',
    difficulty: 'beginner',
    wordLimit: 100,
    timeLimit: 15,
    sampleResponse: 'Ciao! Mi chiamo Marco e ho 25 anni. Abito a Londra, in Inghilterra. Mi piace leggere, guardare film e giocare a calcio. Nel fine settimana, vado spesso al parco con i miei amici. E tu? Da dove vieni? Quali sono i tuoi hobby? Spero di sentirti presto! Cordiali saluti, Marco',
    keywords: ['mi chiamo', 'abito a', 'mi piace', 'hobby', 'fine settimana', 'cordiali saluti']
  },
  {
    id: 'beginner-description-1',
    title: 'My Family',
    prompt: 'Write a description of your family. Mention who they are, what they look like, and what they do.',
    type: 'description',
    difficulty: 'beginner',
    wordLimit: 100,
    timeLimit: 15,
    keywords: ['famiglia', 'madre', 'padre', 'fratello', 'sorella', 'nonni', 'lavoro']
  },
  {
    id: 'intermediate-essay-1',
    title: 'The Importance of Learning Languages',
    prompt: 'Write an essay discussing why learning foreign languages is important in today\'s world. Include at least three reasons.',
    type: 'essay',
    difficulty: 'intermediate',
    wordLimit: 200,
    timeLimit: 20,
    keywords: ['comunicazione', 'globale', 'cultura', 'opportunità', 'lavoro', 'viaggiare', 'comprensione']
  },
  {
    id: 'intermediate-creative-1',
    title: 'A Day in Rome',
    prompt: 'Write a creative story about a day you spent in Rome. Describe what you saw, what you ate, and who you met.',
    type: 'creative',
    difficulty: 'intermediate',
    wordLimit: 250,
    timeLimit: 25,
    keywords: ['Roma', 'Colosseo', 'pasta', 'gelato', 'turisti', 'monumenti', 'storia']
  },
  {
    id: 'advanced-essay-1',
    title: 'The Role of Technology in Education',
    prompt: 'Write an argumentative essay on the role of technology in modern education. Discuss both benefits and challenges, and provide your own perspective.',
    type: 'essay',
    difficulty: 'advanced',
    wordLimit: 350,
    timeLimit: 30,
    keywords: ['tecnologia', 'educazione', 'studenti', 'insegnanti', 'vantaggi', 'svantaggi', 'futuro']
  },
  {
    id: 'advanced-creative-1',
    title: 'A Cultural Misunderstanding',
    prompt: 'Write a story about a cultural misunderstanding between an Italian and a foreigner. How did it happen, and how was it resolved?',
    type: 'creative',
    difficulty: 'advanced',
    wordLimit: 400,
    timeLimit: 35,
    keywords: ['cultura', 'straniero', 'malinteso', 'comunicazione', 'differenze', 'risolvere', 'imparare']
  }
];

const WritingPage: React.FC = () => {
  const { toast } = useToast();
  const { isAIEnabled, translateText, speakText } = useAIUtils();
  
  // Filters and selection state
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [promptType, setPromptType] = useState<'all' | 'essay' | 'creative' | 'email' | 'description'>('all');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  
  // Writing state
  const [userText, setUserText] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [wordCount, setWordCount] = useState(0);
  
  // Feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [showSampleResponse, setShowSampleResponse] = useState(false);
  const [showToolbox, setShowToolbox] = useState(false);
  
  // Timer control
  const [timerActive, setTimerActive] = useState(false);
  
  // Editing mode for improved version
  const [editingImproved, setEditingImproved] = useState(false);
  const [improvedVersion, setImprovedVersion] = useState('');
  
  // Get the currently selected prompt
  const selectedPrompt = WRITING_PROMPTS.find(p => p.id === selectedPromptId) || null;
  
  // Filter prompts based on difficulty and type
  const filteredPrompts = WRITING_PROMPTS.filter(p => 
    p.difficulty === difficulty && (promptType === 'all' || p.type === promptType)
  );
  
  // Update word count when text changes
  useEffect(() => {
    const words = userText.trim() ? userText.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [userText]);
  
  // Handle timer
  useEffect(() => {
    if (timerActive && timeRemaining !== null && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            
            // Notify when time is up
            toast({
              title: "Time's Up!",
              description: "Your allotted time for this writing task has ended.",
              variant: "default",
            });
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [timerActive, timeRemaining, toast]);
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Start writing session
  const handleStartWriting = useCallback(() => {
    if (!selectedPrompt) return;
    
    setUserText('');
    setFeedback(null);
    setIsWriting(true);
    setShowSampleResponse(false);
    
    // Set up timer if a time limit is specified
    if (selectedPrompt.timeLimit) {
      setTimeRemaining(selectedPrompt.timeLimit * 60);
      setTimerActive(true);
    } else {
      setTimeRemaining(null);
    }
  }, [selectedPrompt]);
  
  // Submit writing for feedback
  const handleSubmit = async () => {
    if (!selectedPrompt || !userText.trim()) {
      toast({
        title: "No Content",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would call an AI service for feedback
      // For demo purposes, we'll generate mock feedback
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API delay
      
      const mockFeedback = generateMockFeedback(userText, selectedPrompt);
      setFeedback(mockFeedback);
      setImprovedVersion(mockFeedback.improvedVersion || userText);
      
      // Stop the timer when submission is complete
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerActive(false);
      }
      
      toast({
        title: "Feedback Ready",
        description: "Your writing has been evaluated.",
      });
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate mock feedback (in a real app, this would be AI-generated)
  const generateMockFeedback = (text: string, prompt: WritingPrompt): WritingFeedback => {
    const wordCount = text.trim().split(/\s+/).length;
    const meetsWordLimit = wordCount >= prompt.wordLimit * 0.7 && wordCount <= prompt.wordLimit * 1.3;
    
    // Check for keywords
    const keywordMatches = prompt.keywords ? prompt.keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length : 0;
    
    const keywordScore = prompt.keywords 
      ? (keywordMatches / prompt.keywords.length) * 100 
      : 100;
    
    // Base score calculation
    let score = Math.min(Math.floor(Math.random() * 30) + 60, 100); // Random score between 60-90
    
    // Adjust score based on meeting word limit and keyword usage
    if (!meetsWordLimit) score -= 15;
    if (keywordScore < 50) score -= 10;
    
    const details: FeedbackDetail[] = [
      {
        type: 'positive',
        text: 'Good attempt at addressing the prompt. Your writing shows effort in using Italian vocabulary.'
      }
    ];
    
    // Add some mock grammar feedback
    if (Math.random() > 0.3) {
      details.push({
        type: 'grammar',
        text: 'Pay attention to verb conjugations in the text.',
        suggestion: 'Review present tense conjugations for -are, -ere, and -ire verbs.'
      });
    }
    
    // Add vocabulary feedback
    if (keywordScore < 100) {
      details.push({
        type: 'vocabulary',
        text: `You've used ${keywordMatches} of the ${prompt.keywords?.length || 0} suggested keywords.`,
        suggestion: 'Try to incorporate more topic-specific vocabulary.'
      });
    }
    
    // Add word count feedback
    if (!meetsWordLimit) {
      details.push({
        type: 'structure',
        text: `Your text is ${wordCount} words. The recommended length is around ${prompt.wordLimit} words.`,
        suggestion: wordCount < prompt.wordLimit 
          ? 'Consider expanding your response with more details.' 
          : 'Try to be more concise and focused in your writing.'
      });
    }
    
    // Improved version (light editing of the original)
    const improvedVersion = text.replace(/\b(e|è|sono|ha|hanno)\b/g, match => {
      // Randomly choose whether to "correct" this instance
      return Math.random() > 0.7 ? `*${match}*` : match;
    });
    
    return {
      score,
      summary: score >= 80 
        ? 'Excellent work! Your writing shows a good command of Italian.' 
        : score >= 60 
          ? 'Good effort. There are some areas for improvement, but you\'re on the right track.' 
          : 'You need more practice. Focus on improving grammar and vocabulary.',
      details,
      improvedVersion
    };
  };
  
  // Reset the writing session
  const handleReset = () => {
    setUserText('');
    setFeedback(null);
    setShowSampleResponse(false);
    setIsWriting(false);
    setEditingImproved(false);
    setImprovedVersion('');
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerActive(false);
    }
  };
  
  // Toggle showing sample response
  const handleToggleSample = () => {
    setShowSampleResponse(!showSampleResponse);
  };
  
  // Handle saving the improved version
  const handleSaveImproved = () => {
    setUserText(improvedVersion);
    setEditingImproved(false);
    
    toast({
      title: "Changes Saved",
      description: "The improved version has been saved as your current text.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Writing Practice</h1>
          <p className="text-muted-foreground">Improve your written Italian with guided exercises</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConfidenceIndicator contentType="writing" />
          
          {timeRemaining !== null && isWriting && (
            <div className="flex items-center px-3 py-1 rounded-full bg-muted">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Writing Prompts</CardTitle>
              <CardDescription>
                Select a prompt to begin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value) => {
                    setDifficulty(value as any);
                    setSelectedPromptId(null);
                  }}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prompt-type">Prompt Type</Label>
                <Select 
                  value={promptType} 
                  onValueChange={(value) => {
                    setPromptType(value as any);
                    setSelectedPromptId(null);
                  }}
                >
                  <SelectTrigger id="prompt-type">
                    <SelectValue placeholder="Select prompt type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                    <SelectItem value="creative">Creative Writing</SelectItem>
                    <SelectItem value="email">Email Writing</SelectItem>
                    <SelectItem value="description">Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Available Prompts</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {filteredPrompts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No prompts available for the selected criteria. Try changing your selection.
                    </p>
                  ) : (
                    filteredPrompts.map(prompt => (
                      <Card 
                        key={prompt.id} 
                        className={`p-3 cursor-pointer hover:bg-muted/50 transition ${
                          selectedPromptId === prompt.id ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedPromptId(prompt.id)}
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{prompt.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center justify-between">
                            <Badge variant="outline" className="capitalize">
                              {prompt.type}
                            </Badge>
                            <span>{prompt.wordLimit} words</span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {showToolbox && (
            <Card>
              <CardHeader>
                <CardTitle>Writer's Toolbox</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="grammar">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="grammar">Grammar</TabsTrigger>
                    <TabsTrigger value="vocab">Vocabulary</TabsTrigger>
                    <TabsTrigger value="phrases">Phrases</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grammar" className="pt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Present Tense</h3>
                      <ul className="text-sm space-y-1">
                        <li><span className="font-bold">-are:</span> parlo, parli, parla, parliamo, parlate, parlano</li>
                        <li><span className="font-bold">-ere:</span> prendo, prendi, prende, prendiamo, prendete, prendono</li>
                        <li><span className="font-bold">-ire:</span> finisco, finisci, finisce, finiamo, finite, finiscono</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h3 className="font-medium">Common Connectors</h3>
                      <ul className="text-sm space-y-1">
                        <li><span className="font-bold">e</span> (and), <span className="font-bold">ma</span> (but), <span className="font-bold">perché</span> (because)</li>
                        <li><span className="font-bold">quindi</span> (therefore), <span className="font-bold">anche</span> (also)</li>
                        <li><span className="font-bold">invece</span> (instead), <span className="font-bold">però</span> (however)</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="vocab" className="pt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Useful Adjectives</h3>
                      <ul className="text-sm space-y-1">
                        <li><span className="font-bold">importante</span> (important), <span className="font-bold">difficile</span> (difficult)</li>
                        <li><span className="font-bold">interessante</span> (interesting), <span className="font-bold">utile</span> (useful)</li>
                        <li><span className="font-bold">bello/bella</span> (beautiful), <span className="font-bold">grande</span> (big)</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h3 className="font-medium">Time Expressions</h3>
                      <ul className="text-sm space-y-1">
                        <li><span className="font-bold">oggi</span> (today), <span className="font-bold">domani</span> (tomorrow)</li>
                        <li><span className="font-bold">sempre</span> (always), <span className="font-bold">mai</span> (never)</li>
                        <li><span className="font-bold">spesso</span> (often), <span className="font-bold">raramente</span> (rarely)</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="phrases" className="pt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Starting Sentences</h3>
                      <ul className="text-sm space-y-1">
                        <li><span className="font-bold">Secondo me,</span> (In my opinion,)</li>
                        <li><span className="font-bold">Penso che</span> (I think that)</li>
                        <li><span className="font-bold">Vorrei sottolineare che</span> (I would like to highlight that)</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h3 className="font-medium">Closing Phrases</h3>
                      <ul className="text-sm space-y-1">
                        <li><span className="font-bold">In conclusione,</span> (In conclusion,)</li>
                        <li><span className="font-bold">Cordiali saluti,</span> (Kind regards,)</li>
                        <li><span className="font-bold">Grazie per l'attenzione.</span> (Thank you for your attention.)</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowToolbox(false)}
                  >
                    Close Toolbox
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          {selectedPrompt ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Pencil className="mr-2 h-5 w-5 text-primary" />
                    {selectedPrompt.title}
                  </CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {selectedPrompt.difficulty}
                  </Badge>
                </div>
                <CardDescription>
                  {selectedPrompt.prompt}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isWriting ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Word Count: {wordCount} / {selectedPrompt.wordLimit}</span>
                        <Progress
                          value={(wordCount / selectedPrompt.wordLimit) * 100}
                          className="w-24 h-2"
                        />
                      </div>
                      
                      {!showToolbox && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowToolbox(true)}
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Writer's Toolbox
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="user-writing">Your Response:</Label>
                      <Textarea
                        id="user-writing"
                        placeholder="Start writing your response here..."
                        className="min-h-[300px] font-mono text-base"
                        value={userText}
                        onChange={(e) => setUserText(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    {feedback && (
                      <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Feedback</h3>
                          <Badge className={`px-3 py-1 ${
                            feedback.score >= 80 
                              ? 'bg-green-500 text-white' 
                              : feedback.score >= 60 
                                ? 'bg-yellow-500 text-white' 
                                : 'bg-red-500 text-white'
                          }`}>
                            Score: {feedback.score}/100
                          </Badge>
                        </div>
                        
                        <p>{feedback.summary}</p>
                        
                        <div className="space-y-3">
                          {feedback.details.map((detail, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded-md ${
                                detail.type === 'positive' 
                                  ? 'bg-green-50 border border-green-100' 
                                  : detail.type === 'grammar' 
                                    ? 'bg-red-50 border border-red-100' 
                                    : detail.type === 'vocabulary' 
                                      ? 'bg-blue-50 border border-blue-100' 
                                      : 'bg-yellow-50 border border-yellow-100'
                              }`}
                            >
                              <div className="flex items-start">
                                {detail.type === 'positive' ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                ) : detail.type === 'grammar' ? (
                                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                ) : (
                                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                                )}
                                <div>
                                  <p>{detail.text}</p>
                                  {detail.suggestion && (
                                    <p className="text-sm mt-1 text-muted-foreground">
                                      <span className="font-medium">Suggestion:</span> {detail.suggestion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {feedback.improvedVersion && (
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium flex items-center">
                                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                                Improved Version:
                              </h3>
                              {editingImproved ? (
                                <div className="space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingImproved(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={handleSaveImproved}
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingImproved(true)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              )}
                            </div>
                            
                            {editingImproved ? (
                              <Textarea
                                value={improvedVersion}
                                onChange={(e) => setImprovedVersion(e.target.value)}
                                className="min-h-[200px] font-mono text-base"
                              />
                            ) : (
                              <div className="p-3 rounded-md bg-muted font-mono text-sm whitespace-pre-wrap">
                                {feedback.improvedVersion}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedPrompt.sampleResponse && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          onClick={handleToggleSample}
                          className="w-full"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          {showSampleResponse ? "Hide Sample Response" : "Show Sample Response"}
                        </Button>
                        
                        {showSampleResponse && (
                          <div className="mt-2 p-4 rounded-md border bg-muted/10">
                            <h3 className="font-medium mb-2">Sample Response:</h3>
                            <p className="text-sm">{selectedPrompt.sampleResponse}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Button onClick={handleStartWriting}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Start Writing
                    </Button>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      <div className="flex justify-center space-x-4">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{selectedPrompt.wordLimit} words</span>
                        </div>
                        {selectedPrompt.timeLimit && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{selectedPrompt.timeLimit} minutes</span>
                          </div>
                        )}
                      </div>
                      
                      {selectedPrompt.keywords && (
                        <div className="mt-2">
                          <p className="font-medium">Suggested Keywords:</p>
                          <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {selectedPrompt.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              
              {isWriting && (
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !userText.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Feedback
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ) : (
            <Card className="flex items-center justify-center p-12">
              <div className="text-center">
                <Pencil className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">Select a Writing Prompt</h2>
                <p className="text-muted-foreground max-w-md">
                  Choose a writing prompt from the sidebar to begin practicing your Italian writing skills.
                  Prompts are available in different difficulty levels and types.
                </p>
              </div>
            </Card>
          )}
          
          {/* Writing Tips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="structure">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="grammar">Grammar</TabsTrigger>
                  <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="structure" className="pt-4">
                  <ul className="space-y-2 list-disc ml-5">
                    <li>Begin with an introduction that clearly states your main point</li>
                    <li>Develop your ideas in separate paragraphs with examples</li>
                    <li>Use connecting words to link your ideas (però, inoltre, quindi)</li>
                    <li>Conclude by summarizing your main points or offering a final thought</li>
                    <li>Revise your work for clarity and coherence before submitting</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="grammar" className="pt-4">
                  <ul className="space-y-2 list-disc ml-5">
                    <li>Pay attention to verb conjugations and tenses</li>
                    <li>Check agreement between nouns and adjectives (gender and number)</li>
                    <li>Use appropriate prepositions (a, di, da, in, con, per, su)</li>
                    <li>Remember that adjectives usually follow nouns in Italian</li>
                    <li>Be careful with similar words that have different meanings</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="vocabulary" className="pt-4">
                  <ul className="space-y-2 list-disc ml-5">
                    <li>Use a variety of vocabulary to demonstrate your knowledge</li>
                    <li>Incorporate transitions to connect your ideas smoothly</li>
                    <li>Use specific nouns instead of general ones</li>
                    <li>Include topic-related vocabulary from the suggested keywords</li>
                    <li>Avoid repetition by using synonyms where appropriate</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WritingPage;
