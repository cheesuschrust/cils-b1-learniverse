
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import { 
  BookOpen, Flag, MessageSquare, VolumeUp, Timer, ChevronUp, ChevronDown,
  CheckCircle, XCircle, HelpCircle, Lightbulb, ArrowRight
} from 'lucide-react';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { useAuth } from '@/contexts/AuthContext';

interface ReadingQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: ReadingQuestion[];
  topic: string;
  source?: string;
  vocabulary?: { word: string, definition: string }[];
  confidenceScore: number;
}

const Reading = () => {
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [activePassageList, setActivePassageList] = useState<ReadingPassage[]>([]);
  const [selectedTab, setSelectedTab] = useState('passages');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTextHighlighted, setIsTextHighlighted] = useState(false);
  const [isReadAloudActive, setIsReadAloudActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    generateContent, 
    speakText, 
    isSpeaking, 
    stopSpeaking,
    isProcessing,
    generateQuestions 
  } = useAI();
  
  // Sample passages (in a real app these would come from a database or API)
  const samplePassages: ReadingPassage[] = [
    {
      id: '1',
      title: 'La Storia di Roma',
      content: `Roma è la capitale d'Italia e una delle città più antiche e importanti del mondo. Fu fondata, secondo la leggenda, il 21 aprile del 753 a.C. da Romolo e Remo. Da piccolo villaggio sulle rive del Tevere, Roma diventò il centro di un vasto impero che dominò il Mediterraneo per molti secoli.

Durante il periodo repubblicano (509 a.C. - 27 a.C.), Roma si espanse in Italia e nel Mediterraneo. Con Giulio Cesare e poi con Augusto, il primo imperatore, iniziò l'epoca imperiale che durò fino al 476 d.C., anno della caduta dell'Impero Romano d'Occidente.

Dopo la caduta dell'impero, Roma rimase il centro del Cristianesimo con la presenza del Papa e dello Stato della Chiesa. Nel 1870, Roma divenne la capitale del Regno d'Italia e dal 1946 è la capitale della Repubblica Italiana.

Oggi Roma è una metropoli che conserva un incredibile patrimonio artistico e archeologico, con monumenti come il Colosseo, il Foro Romano, la Fontana di Trevi e molti altri luoghi di interesse storico e culturale. È anche la sede del Vaticano, lo stato più piccolo del mondo e centro della Chiesa Cattolica.`,
      difficulty: 'intermediate',
      questions: [
        {
          id: '1-1',
          text: 'Secondo la leggenda, chi fondò Roma?',
          options: ['Giulio Cesare e Augusto', 'Romolo e Remo', 'Il Papa e l'Imperatore', 'I Romani e gli Etruschi'],
          correctAnswer: 'Romolo e Remo'
        },
        {
          id: '1-2',
          text: 'In quale anno Roma divenne la capitale del Regno d'Italia?',
          options: ['753 a.C.', '476 d.C.', '1870', '1946'],
          correctAnswer: '1870'
        },
        {
          id: '1-3',
          text: 'Quale dei seguenti NON è menzionato come un monumento di Roma?',
          options: ['Il Colosseo', 'La Fontana di Trevi', 'La Torre di Pisa', 'Il Foro Romano'],
          correctAnswer: 'La Torre di Pisa'
        }
      ],
      topic: 'Storia italiana',
      vocabulary: [
        { word: 'fondata', definition: 'creata, stabilita' },
        { word: 'villaggio', definition: 'piccolo centro abitato' },
        { word: 'patrimonio', definition: 'insieme di beni culturali o artistici' }
      ],
      confidenceScore: 95
    },
    {
      id: '2',
      title: 'Il Sistema Politico Italiano',
      content: `L'Italia è una repubblica parlamentare dal 2 giugno 1946, quando un referendum popolare abolì la monarchia. La Costituzione italiana entrò in vigore il 1° gennaio 1948 e rimane tuttora il fondamento del sistema legale italiano.

Il sistema politico italiano si basa sulla divisione dei tre poteri: legislativo, esecutivo e giudiziario. Il potere legislativo è esercitato dal Parlamento, composto dalla Camera dei Deputati e dal Senato della Repubblica. Il potere esecutivo appartiene al Governo, formato dal Presidente del Consiglio (il Primo Ministro) e dai Ministri. Il potere giudiziario è esercitato dalla Magistratura, che è indipendente dagli altri poteri.

Il Presidente della Repubblica è il Capo dello Stato e rappresenta l'unità nazionale. È eletto dal Parlamento in seduta comune e dura in carica sette anni. Tra i suoi compiti ci sono la nomina del Presidente del Consiglio, la promulgazione delle leggi e il comando delle Forze Armate.

L'Italia è divisa in 20 regioni, di cui cinque hanno uno statuto speciale che garantisce loro una maggiore autonomia. Ogni regione ha un proprio governo e un proprio consiglio regionale. Le regioni sono a loro volta suddivise in province e comuni.`,
      difficulty: 'intermediate',
      questions: [
        {
          id: '2-1',
          text: 'Quando è stata fondata la Repubblica Italiana?',
          options: ['1 gennaio 1948', '2 giugno 1946', '25 aprile 1945', '17 marzo 1861'],
          correctAnswer: '2 giugno 1946'
        },
        {
          id: '2-2',
          text: 'Chi esercita il potere legislativo in Italia?',
          options: ['Il Governo', 'Il Presidente della Repubblica', 'Il Parlamento', 'La Magistratura'],
          correctAnswer: 'Il Parlamento'
        },
        {
          id: '2-3',
          text: 'Quante regioni ha l'Italia?',
          options: ['15', '20', '25', '30'],
          correctAnswer: '20'
        }
      ],
      topic: 'Politica italiana',
      vocabulary: [
        { word: 'referendum', definition: 'consultazione popolare' },
        { word: 'promulgazione', definition: 'atto formale con cui si rende esecutiva una legge' },
        { word: 'statuto', definition: 'insieme di norme che regolano un ente' }
      ],
      confidenceScore: 90
    }
  ];
  
  // Check if the user has completed today's reading passage
  useEffect(() => {
    const checkDailyCompletion = async () => {
      try {
        // In a real app, you would check against a database
        const lastCompletedDate = localStorage.getItem(`readingCompleted_${user?.id}`);
        const today = new Date().toISOString().split('T')[0];
        
        if (lastCompletedDate === today) {
          setHasCompletedToday(true);
        }
      } catch (error) {
        console.error('Error checking daily completion:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    setActivePassageList(samplePassages);
    checkDailyCompletion();
  }, [user?.id]);
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerRunning) {
      handleSubmit();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeRemaining, isTimerRunning]);
  
  // Handle passage selection
  const selectPassage = (passage: ReadingPassage) => {
    setSelectedPassage(passage);
    setAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setTimeRemaining(600);
    setIsTimerRunning(true);
    setSelectedTab('reading');
  };
  
  // Handle answer selection
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  // Handle submission
  const handleSubmit = () => {
    if (!selectedPassage) return;
    
    setIsTimerRunning(false);
    
    // Calculate score
    let correctCount = 0;
    selectedPassage.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / selectedPassage.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    // Save completion status
    if (user?.id) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`readingCompleted_${user.id}`, today);
      setHasCompletedToday(true);
    }
    
    toast({
      title: "Reading Exercise Completed",
      description: `Your score: ${calculatedScore}%. ${getScoreFeedback(calculatedScore)}`,
      variant: calculatedScore >= 70 ? "default" : "destructive",
    });
  };
  
  // Get feedback based on score
  const getScoreFeedback = (score: number) => {
    if (score >= 90) return "Excellent! You have a strong understanding.";
    if (score >= 70) return "Good job! You're doing well.";
    if (score >= 50) return "You're making progress. Keep practicing!";
    return "More practice needed. Don't give up!";
  };
  
  // Toggle text highlighting
  const toggleTextHighlight = () => {
    setIsTextHighlighted(prev => !prev);
  };
  
  // Handle read aloud
  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsReadAloudActive(false);
    } else if (selectedPassage) {
      speakText?.(selectedPassage.content, 'it-IT');
      setIsReadAloudActive(true);
    }
  };
  
  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Generate a new passage
  const generateNewPassage = async () => {
    setIsLoading(true);
    
    try {
      // Generate passage content
      const passageContent = await generateContent(
        "Create an informative text in Italian at B1 level (300-400 words) about Italian culture, history, or citizenship topics. Include only the text content, no title or questions."
      );
      
      // Generate questions
      const questionsResult = await generateQuestions({
        contentTypes: ['reading'],
        difficulty: 'intermediate',
        count: 3,
        isCitizenshipFocused: true
      });
      
      // Create a new passage object
      if (passageContent && questionsResult.questions) {
        const newPassage: ReadingPassage = {
          id: Date.now().toString(),
          title: "Testo generato dall'AI",
          content: passageContent,
          difficulty: 'intermediate',
          questions: questionsResult.questions.slice(0, 3).map((q: any, index: number) => ({
            id: `gen-${index}`,
            text: q.text || q.question,
            options: q.options || ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: q.correctAnswer
          })),
          topic: "Cultura italiana",
          confidenceScore: Math.floor(Math.random() * 11) + 80 // 80-90
        };
        
        // Add to the list
        setActivePassageList(prev => [newPassage, ...prev]);
        
        // Select the new passage
        selectPassage(newPassage);
        
        toast({
          title: "New Passage Generated",
          description: "An AI-generated reading passage has been created for you."
        });
      } else {
        throw new Error("Failed to generate content");
      }
    } catch (error) {
      console.error("Error generating passage:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate a new reading passage. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Helmet>
          <title>Reading Comprehension - CILS Italian</title>
        </Helmet>
        
        <h1 className="text-3xl font-bold mb-8">Reading Comprehension</h1>
        
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading reading materials...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Already completed state
  if (hasCompletedToday && !selectedPassage) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Helmet>
          <title>Reading Comprehension - CILS Italian</title>
        </Helmet>
        
        <h1 className="text-3xl font-bold mb-8">Reading Comprehension</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Reading Completed</CardTitle>
            <CardDescription>
              You've already completed today's reading exercise. Come back tomorrow for a new passage!
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <p className="text-center text-muted-foreground">
                  Regular reading practice helps improve your Italian comprehension skills.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setHasCompletedToday(false)}>
              View Previous Passages
            </Button>
            <Button onClick={generateNewPassage} disabled={isProcessing}>
              Generate New Passage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Helmet>
        <title>Reading Comprehension - CILS Italian</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Reading Comprehension</h1>
        
        <Badge variant="outline" className="text-sm">
          CILS B1
        </Badge>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="passages">Passages</TabsTrigger>
          <TabsTrigger value="reading" disabled={!selectedPassage}>Reading</TabsTrigger>
        </TabsList>
        
        <TabsContent value="passages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePassageList.map(passage => (
              <Card key={passage.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {passage.title}
                    <Badge variant={passage.difficulty === 'beginner' ? 'secondary' : passage.difficulty === 'intermediate' ? 'default' : 'destructive'} className="ml-2">
                      {passage.difficulty}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{passage.topic}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {passage.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center mt-2">
                    <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{passage.questions.length} questions</span>
                    
                    <div className="ml-auto">
                      <ConfidenceIndicator score={passage.confidenceScore} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => selectPassage(passage)}
                  >
                    Start Reading
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Generate New Passage Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Generate New Passage</CardTitle>
                <CardDescription>Create a new reading passage with AI</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  Generate a customized reading passage about Italian culture, history, or citizenship topics with AI.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={generateNewPassage}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Generate Passage
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reading" className="space-y-4">
          {selectedPassage && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedPassage.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">{selectedPassage.topic}</Badge>
                          <Flag className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="text-xs capitalize">{selectedPassage.difficulty}</span>
                        </CardDescription>
                      </div>
                      
                      <div>
                        <ConfidenceIndicator score={selectedPassage.confidenceScore} />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Time: {formatTime(timeRemaining)}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={toggleTextHighlight}
                          className={isTextHighlighted ? 'bg-primary/10' : ''}
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span className="text-xs">Highlight</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleReadAloud}
                          className={isReadAloudActive ? 'bg-primary/10' : ''}
                        >
                          <VolumeUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`prose max-w-none ${isTextHighlighted ? 'bg-yellow-50' : ''}`}>
                      {selectedPassage.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={`${isTextHighlighted ? 'leading-relaxed text-[1.1rem]' : ''}`}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    {selectedPassage.vocabulary && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">Vocabulary</h3>
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <ul className="list-none space-y-1">
                            {selectedPassage.vocabulary.map((item, index) => (
                              <li key={index}>
                                <span className="font-medium">{item.word}</span>: {item.definition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Reading Comprehension</CardTitle>
                    <CardDescription>
                      Answer the questions based on the passage
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {selectedPassage.questions.map((question, qIndex) => (
                      <div key={question.id} className="space-y-2">
                        <div className="flex items-start">
                          <span className="font-medium mr-2">{qIndex + 1}.</span>
                          <span>{question.text}</span>
                        </div>
                        
                        <RadioGroup
                          value={answers[question.id] || ''}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                          disabled={isSubmitted}
                          className="space-y-2 ml-6"
                        >
                          {question.options.map((option, oIndex) => (
                            <div 
                              key={oIndex} 
                              className={`flex items-start space-x-2 p-2 rounded ${
                                isSubmitted && option === question.correctAnswer 
                                  ? 'bg-green-50' 
                                  : isSubmitted && option === answers[question.id] && option !== question.correctAnswer 
                                  ? 'bg-red-50' 
                                  : 'hover:bg-muted'
                              }`}
                            >
                              <RadioGroupItem value={option} id={`q${qIndex}-o${oIndex}`} className="mt-1" />
                              <Label 
                                htmlFor={`q${qIndex}-o${oIndex}`}
                                className="flex-1 cursor-pointer"
                              >
                                {option}
                              </Label>
                              {isSubmitted && option === question.correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                              )}
                              {isSubmitted && option === answers[question.id] && option !== question.correctAnswer && (
                                <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-1" />
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                        
                        {isSubmitted && answers[question.id] !== question.correctAnswer && (
                          <div className="ml-6 mt-1 p-2 bg-red-50 rounded text-sm border border-red-100">
                            <p className="font-medium text-red-700">Correct answer: {question.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                  
                  <CardFooter>
                    {isSubmitted ? (
                      <div className="w-full space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Your Score</span>
                          <Badge variant={score && score >= 70 ? "default" : "destructive"}>
                            {score}%
                          </Badge>
                        </div>
                        <Progress value={score || 0} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          {score !== null && getScoreFeedback(score)}
                        </p>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => setSelectedTab('passages')}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Return to Passages
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleSubmit} 
                        disabled={Object.keys(answers).length !== selectedPassage.questions.length}
                        className="w-full"
                      >
                        Submit Answers
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reading;
