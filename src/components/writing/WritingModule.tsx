
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import useOfflineCapability from '@/hooks/useOfflineCapability';
import { Loader2, RefreshCw, Save, Check, AlertTriangle, Info, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock writing prompts
const mockPrompts = [
  {
    id: '1',
    title: 'Introduce Yourself',
    description: 'Write a short paragraph introducing yourself in Italian',
    level: 'beginner',
    prompt: 'Write a paragraph of 50-100 words introducing yourself. Include your name, age, where you are from, what you do, and some of your interests.',
    wordCount: { min: 50, max: 100 },
    example: `Mi chiamo Marco e ho 32 anni. Sono americano, di New York, ma ora vivo a Milano. Sono insegnante d'inglese. Mi piace molto l'Italia: il cibo, la cultura e la gente. Nel mio tempo libero, mi piace leggere libri, guardare film italiani e viaggiare. Sto imparando l'italiano da due anni e voglio parlare bene per comunicare con i miei amici italiani. Ho anche un gatto che si chiama Leo.`
  },
  {
    id: '2',
    title: 'My Daily Routine',
    description: 'Describe your typical day in Italian',
    level: 'beginner',
    prompt: 'Write a paragraph of 70-120 words describing your daily routine. Include what time you wake up, what you do during the day, and what time you go to bed.',
    wordCount: { min: 70, max: 120 },
    example: `Mi sveglio alle 7 di mattina. Faccio colazione con un caffè e un cornetto. Poi mi preparo per andare al lavoro. Lavoro dalle 9 alle 17. Durante la pausa pranzo, mangio un panino o un'insalata con i miei colleghi. Dopo il lavoro, vado in palestra tre volte a settimana. Torno a casa alle 19 e preparo la cena. Di solito guardo un po' di televisione o leggo un libro. A volte, esco con i miei amici per una pizza o un aperitivo. Vado a letto alle 23 circa.`
  },
  {
    id: '3',
    title: 'My Last Vacation',
    description: 'Write about a recent vacation or trip',
    level: 'intermediate',
    prompt: 'Write a paragraph of 100-150 words about your last vacation or a memorable trip. Include where you went, who you were with, what you did, and what you enjoyed most.',
    wordCount: { min: 100, max: 150 },
    example: `L'estate scorsa sono andato in Sicilia con la mia famiglia. Abbiamo soggiornato in un bellissimo hotel vicino al mare a Taormina. La vista dall'hotel era incredibile: potevamo vedere l'Etna e il Mar Mediterraneo dalla nostra camera. Durante la vacanza, abbiamo visitato molti luoghi interessanti come Siracusa, Noto e Palermo. Abbiamo anche fatto un'escursione sull'Etna, che è stata un'esperienza indimenticabile. La cosa che mi è piaciuta di più è stata la cucina siciliana. Abbiamo mangiato piatti deliziosi come arancini, pasta alla Norma e cannoli. I siciliani sono molto ospitali e la loro cultura è affascinante. È stata una vacanza perfetta e spero di tornare presto.`
  },
  {
    id: '4',
    title: 'Italian Citizenship Application Letter',
    description: 'Practice writing a formal letter for citizenship',
    level: 'advanced',
    prompt: 'Write a formal letter (150-200 words) to the Italian consulate explaining why you are applying for Italian citizenship. Include your connection to Italy, your qualifications, and why you want to become an Italian citizen.',
    wordCount: { min: 150, max: 200 },
    example: `Egregio Console,

Mi chiamo John Smith e scrivo questa lettera per presentare la mia domanda di cittadinanza italiana. Sono di origine italiana attraverso il mio bisnonno, Luigi Rossi, nato a Milano nel 1910 ed emigrato negli Stati Uniti nel 1930.

Ho raccolto tutti i documenti necessari che dimostrano la mia discendenza italiana, tra cui i certificati di nascita, matrimonio e morte dei miei antenati. Inoltre, ho completato il livello B1 di italiano presso l'Istituto Italiano di Cultura di New York.

Desidero diventare cittadino italiano per diversi motivi. In primo luogo, sento un forte legame con la cultura e le tradizioni italiane che sono sempre state parte della mia vita familiare. In secondo luogo, vorrei onorare la memoria dei miei antenati e mantenere viva la connessione con le mie radici. Infine, ho intenzione di trasferirmi in Italia nei prossimi anni e contribuire alla società italiana con le mie competenze professionali nel campo dell'ingegneria.

Resto a disposizione per qualsiasi ulteriore informazione o documento necessario per completare la mia domanda.

Distinti saluti,
John Smith`
  }
];

// Mock feedback function (this would be replaced with a real AI analysis in production)
const analyzeMockText = (text: string, prompt: any) => {
  // Simulate API processing time
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      
      // Generate mock feedback
      const errors = [];
      const suggestions = [];
      
      // Word count feedback
      if (wordCount < prompt.wordCount.min) {
        suggestions.push({
          type: 'length',
          message: `Your text is too short. You wrote ${wordCount} words, but the minimum is ${prompt.wordCount.min}.`
        });
      } else if (wordCount > prompt.wordCount.max) {
        suggestions.push({
          type: 'length',
          message: `Your text is too long. You wrote ${wordCount} words, but the maximum is ${prompt.wordCount.max}.`
        });
      }
      
      // Grammar error simulation (random)
      if (text.length > 20 && Math.random() > 0.3) {
        const randomErrors = [
          { type: 'grammar', position: [15, 20], message: 'Check verb conjugation here' },
          { type: 'spelling', position: [40, 45], message: 'This word may be misspelled' },
          { type: 'gender', position: [60, 70], message: 'Check gender agreement' }
        ];
        
        // Add 1-3 random errors if text is long enough
        const errorCount = Math.ceil(Math.random() * 3);
        for (let i = 0; i < errorCount && i < randomErrors.length; i++) {
          if (text.length > randomErrors[i].position[1]) {
            errors.push(randomErrors[i]);
          }
        }
      }
      
      // Calculate overall score (70-100 for meaningful text)
      let score = 85;
      
      // Adjust score based on word count
      if (wordCount < prompt.wordCount.min) {
        score = Math.max(70, score - (prompt.wordCount.min - wordCount) / 2);
      } else if (wordCount > prompt.wordCount.max) {
        score = Math.max(70, score - (wordCount - prompt.wordCount.max) / 4);
      }
      
      // Adjust score based on error count
      score = Math.max(70, score - (errors.length * 5));
      
      resolve({
        wordCount,
        errors,
        suggestions,
        score: Math.round(score),
        strengths: [
          'Good use of vocabulary',
          'Clear structure',
          'Appropriate tone for the task'
        ],
        improvements: [
          'Consider using more complex tenses',
          'Expand your vocabulary',
          'Add more connecting words for smoother transitions'
        ]
      });
    }, 1500);
  });
};

const WritingModule: React.FC = () => {
  const [prompts, setPrompts] = useState<any[]>(mockPrompts);
  const [activeTab, setActiveTab] = useState('prompts');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [userText, setUserText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [savedWritings, setSavedWritings] = useState<any[]>([]);
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { isOnline, isOfflineReady, enableOfflineAccess } = useOfflineCapability('/writing');
  
  const isLimitReached = hasReachedLimit('writingExercises');
  const maxExercises = getLimit('writingExercises');
  const currentUsage = getUsage('writingExercises');

  useEffect(() => {
    // In a real app, fetch prompts and saved writings from the database
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Load saved writings from localStorage for the demo
      const savedItems = localStorage.getItem('savedWritings');
      if (savedItems) {
        setSavedWritings(JSON.parse(savedItems));
      }
    }, 1000);
  }, []);

  const handleSelectPrompt = async (promptId: string) => {
    if (isLimitReached && !user?.isPremium) {
      toast({
        title: "Daily Limit Reached",
        description: `You've reached your daily limit of ${maxExercises} writing exercises. Upgrade to Premium for unlimited access.`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPromptId(promptId);
    setUserText('');
    setFeedback(null);
    setActiveTab('writing');
    
    try {
      await incrementUsage('writingExercises');
    } catch (err) {
      console.error("Failed to increment usage:", err);
    }
  };

  const handleBackToPrompts = () => {
    if (userText.trim() && !feedback) {
      if (confirm("You have unsaved work. Are you sure you want to leave?")) {
        setSelectedPromptId(null);
        setUserText('');
        setFeedback(null);
        setActiveTab('prompts');
      }
    } else {
      setSelectedPromptId(null);
      setUserText('');
      setFeedback(null);
      setActiveTab('prompts');
    }
  };

  const handleAnalyzeText = async () => {
    if (!selectedPromptId || !userText.trim()) return;
    
    setIsAnalyzing(true);
    const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
    
    try {
      // In a real app, this would call an AI service via API
      const result = await analyzeMockText(userText, selectedPrompt);
      setFeedback(result);
      
      toast({
        title: "Analysis Complete",
        description: `Your writing has been analyzed. Overall score: ${result.score}/100.`
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveWriting = () => {
    if (!selectedPromptId || !userText.trim()) return;
    
    const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
    const newSavedWriting = {
      id: Date.now().toString(),
      promptId: selectedPromptId,
      promptTitle: selectedPrompt?.title,
      text: userText,
      date: new Date().toISOString(),
      feedback: feedback || null
    };
    
    const updatedSavedWritings = [...savedWritings, newSavedWriting];
    setSavedWritings(updatedSavedWritings);
    
    // Save to localStorage for demo purposes
    localStorage.setItem('savedWritings', JSON.stringify(updatedSavedWritings));
    
    toast({
      title: "Writing Saved",
      description: "Your writing has been saved successfully."
    });
  };

  const renderSelectedPrompt = () => {
    if (!selectedPromptId) return null;
    
    const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
    if (!selectedPrompt) return null;
    
    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedPrompt.title}</CardTitle>
                <CardDescription>{selectedPrompt.description}</CardDescription>
              </div>
              <Badge variant={selectedPrompt.level === 'beginner' ? 'outline' : (selectedPrompt.level === 'intermediate' ? 'secondary' : 'destructive')}>
                {selectedPrompt.level.charAt(0).toUpperCase() + selectedPrompt.level.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Instructions</h3>
                <p className="text-muted-foreground">{selectedPrompt.prompt}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Word count: {selectedPrompt.wordCount.min}-{selectedPrompt.wordCount.max}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aim to write between {selectedPrompt.wordCount.min} and {selectedPrompt.wordCount.max} words</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <Label htmlFor="user-text">Your Response</Label>
            <span className="text-sm text-muted-foreground">
              {userText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          
          <Textarea 
            id="user-text"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Write your response here in Italian..."
            className="min-h-[200px]"
          />
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setUserText('')}>
              Clear
            </Button>
            <div className="space-x-2">
              <Button 
                variant="outline"
                onClick={handleSaveWriting}
                disabled={!userText.trim() || isAnalyzing}
              >
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button 
                onClick={handleAnalyzeText}
                disabled={!userText.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {feedback && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Writing Feedback</CardTitle>
              <CardDescription>
                Analysis of your writing based on grammar, vocabulary, and structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Overall Score</h3>
                  <span className="font-bold text-lg">{feedback.score}/100</span>
                </div>
                <Progress value={feedback.score} className="h-2" />
              </div>
              
              {feedback.errors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Errors Found
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {feedback.errors.map((error: any, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded text-amber-800 dark:text-amber-300 mr-2">
                          {error.type}
                        </span>
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm list-disc pl-5">
                    {feedback.strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-1 text-sm list-disc pl-5">
                    {feedback.improvements.map((improvement: string, index: number) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {feedback.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Suggestions</h3>
                  <ul className="space-y-1 text-sm">
                    {feedback.suggestions.map((suggestion: any, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        • {suggestion.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="outline" onClick={() => setFeedback(null)} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Revise and Resubmit
              </Button>
            </CardFooter>
          </Card>
        )}
      </>
    );
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Italian Writing Practice</CardTitle>
          <CardDescription>
            Please log in to access writing exercises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to use the writing exercises.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading exercises...</p>
      </div>
    );
  }

  const renderWritingTab = () => {
    if (selectedPromptId) {
      return renderSelectedPrompt();
    }
    
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground mb-4">
          Please select a writing prompt to begin
        </p>
        <Button onClick={() => setActiveTab('prompts')}>
          Browse Prompts
        </Button>
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Italian Writing Practice</h1>
          <p className="text-muted-foreground">
            Improve your writing skills with guided exercises
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedPromptId ? (
            <Button variant="outline" onClick={handleBackToPrompts}>
              ← Back to Prompts
            </Button>
          ) : (
            <>
              <Badge variant="outline" className="px-3 py-1">
                {currentUsage} / {maxExercises} Exercises
              </Badge>
              {!isOnline && !isOfflineReady && (
                <Button onClick={enableOfflineAccess} disabled={!isOnline} variant="outline" size="sm">
                  Enable Offline
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      {!selectedPromptId && isLimitReached && !user?.isPremium && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Daily Limit Reached</AlertTitle>
          <AlertDescription>
            You've reached your daily limit of {maxExercises} writing exercises. 
            <Button variant="link" className="p-0 h-auto font-normal">
              Upgrade to Premium
            </Button> for unlimited access.
          </AlertDescription>
        </Alert>
      )}
      
      {selectedPromptId ? (
        renderWritingTab()
      ) : (
        <Tabs defaultValue="prompts" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="prompts">Writing Prompts</TabsTrigger>
            <TabsTrigger value="saved">Saved Writings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{prompt.title}</CardTitle>
                      <Badge variant={prompt.level === 'beginner' ? 'outline' : (prompt.level === 'intermediate' ? 'secondary' : 'destructive')}>
                        {prompt.level.charAt(0).toUpperCase() + prompt.level.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{prompt.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {prompt.prompt}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className="w-full" 
                      onClick={() => handleSelectPrompt(prompt.id)}
                      disabled={isLimitReached && !user?.isPremium}
                    >
                      Start Writing
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            {savedWritings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    You haven't saved any writings yet.
                  </p>
                  <Button onClick={() => setActiveTab('prompts')} className="mt-4">
                    Browse Writing Prompts
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {savedWritings.map((writing) => (
                  <Card key={writing.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{writing.promptTitle}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {new Date(writing.date).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="line-clamp-3">{writing.text}</p>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {writing.text.split(/\s+/).filter(Boolean).length} words
                        </span>
                        {writing.feedback && (
                          <Badge>Score: {writing.feedback.score}/100</Badge>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WritingModule;
