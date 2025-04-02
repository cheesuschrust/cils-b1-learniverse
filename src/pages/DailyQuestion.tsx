
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Clock, Star, Book, BookOpen, Languages, VolumeX, Volume2, Mic, Check, Info } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/components/ui/use-toast';
import { ItalianLevel, ItalianTestSection } from '@/types/italian-types';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget';

const DailyQuestion: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ItalianTestSection>('reading');
  const [question, setQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(180); // 3 minutes for CILS B1
  const [timerRunning, setTimerRunning] = useState(false);
  const [dailyQuestionAttempts, setDailyQuestionAttempts] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Admin status check
  
  const { toast } = useToast();
  const { generateQuestions } = useAI();

  // Check if user is admin - in a real app, this would come from auth context
  useEffect(() => {
    // Simulate checking auth status
    const checkIfAdmin = async () => {
      // This would be replaced with actual auth check
      setIsAdmin(localStorage.getItem('userRole') === 'admin');
    };
    
    checkIfAdmin();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerRunning) {
      // Time's up
      setTimerRunning(false);
      handleTimeUp();
    }
    
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle time up
  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "You've run out of time for this question.",
      variant: "destructive"
    });
    
    // Submit whatever the current answer is
    handleSubmitAnswer();
  };

  // Generate a question
  const generateQuestion = async () => {
    // Check if daily limit reached (for free users)
    if (dailyQuestionAttempts >= 1) {
      toast({
        title: "Daily Limit Reached",
        description: "Free users can only attempt one question per day. Upgrade to premium for unlimited practice.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate question based on selected category
      const result = await generateQuestions({
        contentTypes: [selectedCategory],
        difficulty: 'B1', // CILS B1 citizenship level
        isCitizenshipFocused: true,
        count: 1,
        topics: ['citizenship', 'italian culture'],
      });
      
      if (!result || !result.questions || result.questions.length === 0) {
        throw new Error("Failed to generate question");
      }
      
      // Set the question
      setQuestion(result.questions[0]);
      
      // Reset states
      setUserAnswer('');
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeRemaining(180); // Reset timer to 3 minutes
      setTimerRunning(true);
      
      toast({
        title: "Question Ready",
        description: `Your daily ${selectedCategory} question is ready. You have 3 minutes to answer.`,
      });
      
      // Increment daily attempts
      setDailyQuestionAttempts(prev => prev + 1);
      
    } catch (error) {
      console.error('Error generating question:', error);
      
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle option selection (for multiple choice)
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  // Handle text input (for writing, etc.)
  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isAnswered) return;
    setUserAnswer(e.target.value);
  };

  // Handle submit answer
  const handleSubmitAnswer = () => {
    if (!question) return;
    
    setTimerRunning(false);
    setIsAnswered(true);
    
    // Check answer based on question type
    let isCorrect = false;
    
    if (question.options && question.options.length > 0) {
      // Multiple choice
      isCorrect = selectedOption === question.correctAnswer;
    } else {
      // Free text - in real app, would use AI to evaluate
      // Simple check for now
      const answerLowerCase = userAnswer.toLowerCase().trim();
      const correctAnswerLowerCase = question.correctAnswer.toLowerCase().trim();
      
      // Very basic check - in real app would use more sophisticated comparison
      isCorrect = answerLowerCase.includes(correctAnswerLowerCase) || 
                  correctAnswerLowerCase.includes(answerLowerCase);
    }
    
    // Calculate score based on correctness and time
    const timeBonus = Math.max(0, timeRemaining / 180) * 20; // Max 20 points for time
    const scoreValue = isCorrect ? 80 + timeBonus : timeBonus;
    
    setUserScore(Math.round(scoreValue));
    
    // Show result
    toast({
      title: isCorrect ? "Correct Answer!" : "Incorrect Answer",
      description: `Your score: ${Math.round(scoreValue)}%. ${isCorrect ? 'Well done!' : `The correct answer was: ${question.correctAnswer}`}`,
      variant: isCorrect ? "default" : "destructive"
    });
  };

  // Render question based on type
  const renderQuestion = () => {
    if (!question) return null;
    
    switch (selectedCategory) {
      case 'reading':
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium mb-2">Reading Passage</h3>
              <p className="text-sm">{question.text}</p>
              
              {question.options && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Select the correct answer:</h3>
                  <div className="space-y-2">
                    {question.options.map((option: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <div 
                          className={`p-3 border rounded-md cursor-pointer w-full ${
                            selectedOption === option 
                              ? 'bg-primary/10 border-primary' 
                              : 'hover:bg-gray-50'
                          } ${
                            isAnswered && option === question.correctAnswer
                              ? 'bg-green-100 border-green-500'
                              : ''
                          } ${
                            isAnswered && selectedOption === option && option !== question.correctAnswer
                              ? 'bg-red-100 border-red-500'
                              : ''
                          }`}
                          onClick={() => handleOptionSelect(option)}
                        >
                          <div className="flex">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                            <span>{option}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {isAnswered && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium">Explanation</h4>
                <p className="text-sm mt-1">{question.explanation || "No explanation available for this question."}</p>
              </div>
            )}
          </div>
        );
        
      case 'writing':
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium mb-2">Writing Prompt</h3>
              <p className="text-sm">{question.text}</p>
              
              <div className="mt-4">
                <textarea
                  className="w-full p-3 border rounded-md min-h-[150px]"
                  placeholder="Write your answer in Italian..."
                  value={userAnswer}
                  onChange={handleTextInputChange}
                  disabled={isAnswered}
                />
              </div>
            </div>
            
            {isAnswered && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium">Feedback</h4>
                <p className="text-sm mt-1">
                  {userScore > 70 
                    ? "Your answer demonstrates good understanding of the topic and appropriate language use for B1 level."
                    : "Your answer has some errors. Focus on using proper grammar and vocabulary appropriate for B1 level."}
                </p>
                <h4 className="font-medium mt-3">Sample Answer</h4>
                <p className="text-sm mt-1 italic">{question.correctAnswer}</p>
              </div>
            )}
          </div>
        );
        
      case 'listening':
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Listening Exercise</h3>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play Audio
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-md text-center">
                <Volume2 className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm mt-2">Audio transcript (for demonstration):</p>
                <p className="text-xs mt-1 italic">{question.text}</p>
              </div>
              
              {question.options && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Select the correct answer based on what you heard:</h3>
                  <div className="space-y-2">
                    {question.options.map((option: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <div 
                          className={`p-3 border rounded-md cursor-pointer w-full ${
                            selectedOption === option 
                              ? 'bg-primary/10 border-primary' 
                              : 'hover:bg-gray-50'
                          } ${
                            isAnswered && option === question.correctAnswer
                              ? 'bg-green-100 border-green-500'
                              : ''
                          } ${
                            isAnswered && selectedOption === option && option !== question.correctAnswer
                              ? 'bg-red-100 border-red-500'
                              : ''
                          }`}
                          onClick={() => handleOptionSelect(option)}
                        >
                          <div className="flex">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                            <span>{option}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {isAnswered && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium">Explanation</h4>
                <p className="text-sm mt-1">{question.explanation || "No explanation available for this question."}</p>
              </div>
            )}
          </div>
        );
        
      case 'vocabulary':
      case 'grammar':
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium mb-2">{selectedCategory === 'vocabulary' ? 'Vocabulary' : 'Grammar'} Question</h3>
              <p className="text-sm">{question.text}</p>
              
              {question.options && (
                <div className="mt-6">
                  <div className="space-y-2">
                    {question.options.map((option: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <div 
                          className={`p-3 border rounded-md cursor-pointer w-full ${
                            selectedOption === option 
                              ? 'bg-primary/10 border-primary' 
                              : 'hover:bg-gray-50'
                          } ${
                            isAnswered && option === question.correctAnswer
                              ? 'bg-green-100 border-green-500'
                              : ''
                          } ${
                            isAnswered && selectedOption === option && option !== question.correctAnswer
                              ? 'bg-red-100 border-red-500'
                              : ''
                          }`}
                          onClick={() => handleOptionSelect(option)}
                        >
                          <div className="flex">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                            <span>{option}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {isAnswered && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium">Explanation</h4>
                <p className="text-sm mt-1">{question.explanation || "No explanation available for this question."}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return <div>Question type not available</div>;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>Daily Question - CILS B1 Citizenship Prep</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Daily Question Challenge</h1>
        <p className="text-muted-foreground mt-1">
          Practice with one daily question aligned with CILS B1 citizenship requirements.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!question ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Select Question Type</CardTitle>
                    <CardDescription>Choose one category for today's practice question</CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date().toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="reading" onValueChange={(v) => setSelectedCategory(v as ItalianTestSection)}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="reading">Reading</TabsTrigger>
                    <TabsTrigger value="writing">Writing</TabsTrigger>
                    <TabsTrigger value="listening">Listening</TabsTrigger>
                    <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="reading">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Reading Comprehension</h3>
                        <p className="text-sm text-muted-foreground">Test your understanding of Italian texts with citizenship-related content.</p>
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>CILS B1 Reading Format</AlertTitle>
                      <AlertDescription>
                        The CILS B1 citizenship test includes reading passages about Italian civic life, institutions, and daily situations, followed by comprehension questions.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  
                  <TabsContent value="writing">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Book className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Writing Exercise</h3>
                        <p className="text-sm text-muted-foreground">Practice writing in Italian about citizenship-related topics.</p>
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>CILS B1 Writing Format</AlertTitle>
                      <AlertDescription>
                        The writing section requires composing short texts (80-100 words) on everyday topics or personal experiences relevant to living in Italy.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  
                  <TabsContent value="listening">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Volume2 className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Listening Exercise</h3>
                        <p className="text-sm text-muted-foreground">Test your ability to understand spoken Italian in various contexts.</p>
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>CILS B1 Listening Format</AlertTitle>
                      <AlertDescription>
                        The listening section features dialogues and monologues about everyday situations in Italy, with questions testing comprehension of main ideas and details.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  
                  <TabsContent value="vocabulary">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Languages className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Vocabulary & Grammar</h3>
                        <p className="text-sm text-muted-foreground">Test your knowledge of Italian words and grammatical structures.</p>
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>CILS B1 Vocabulary Requirements</AlertTitle>
                      <AlertDescription>
                        B1 level vocabulary includes around 2,000 words covering daily life, work, family, hobbies, and basic civic concepts needed for citizenship.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={generateQuestion}
                  disabled={isLoading || dailyQuestionAttempts >= 1}
                >
                  {isLoading ? "Generating..." : "Start Today's Question"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedCategory === 'reading' ? 'Reading Comprehension' : 
                               selectedCategory === 'writing' ? 'Writing Exercise' : 
                               selectedCategory === 'listening' ? 'Listening Exercise' : 
                               'Vocabulary & Grammar'}</CardTitle>
                    <CardDescription>CILS B1 Citizenship Question</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isAdmin && question && (
                      <ConfidenceIndicator score={85} isAdminView={true} />
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {formatTime(timeRemaining)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {renderQuestion()}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setQuestion(null);
                    setTimerRunning(false);
                  }}
                  disabled={isLoading}
                >
                  Back to Categories
                </Button>
                
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={isLoading || isAnswered || (!selectedOption && !userAnswer)}
                >
                  Submit Answer
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {isAnswered && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Your Score</span>
                      <span className="text-sm font-medium">{userScore}%</span>
                    </div>
                    <Progress value={userScore} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-muted-foreground mb-1">Time Used</div>
                      <div className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTime(180 - timeRemaining)} / 3:00
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-muted-foreground mb-1">CILS B1 Relevance</div>
                      <div className="font-medium flex items-center">
                        <Star className="h-4 w-4 mr-2 text-amber-500" />
                        Very High
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <FeedbackWidget 
                  contentId={question?.id}
                  contentType="daily-question"
                  position="bottom-right"
                  onFeedbackSubmit={(feedback) => {
                    console.log('Feedback submitted:', feedback);
                    // In a real app, would save this to the database
                    toast({
                      title: "Thank you for your feedback!",
                      description: "Your input helps us improve our questions."
                    });
                  }}
                />
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>CILS B1 Citizenship Preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Daily Questions Used</h3>
                  <div className="flex items-center">
                    <Progress value={(dailyQuestionAttempts / 1) * 100} className="h-2 flex-1 mr-3" />
                    <span className="text-sm font-medium">{dailyQuestionAttempts}/1</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free users receive one question per day
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">CILS B1 Areas Coverage</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Reading</span>
                        <span className="text-xs">45%</span>
                      </div>
                      <Progress value={45} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Writing</span>
                        <span className="text-xs">30%</span>
                      </div>
                      <Progress value={30} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Listening</span>
                        <span className="text-xs">20%</span>
                      </div>
                      <Progress value={20} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Vocabulary</span>
                        <span className="text-xs">60%</span>
                      </div>
                      <Progress value={60} className="h-1.5" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">Citizenship Topics</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Italian Constitution</Badge>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">Government</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Civic Rights</Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">History</Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">Culture</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Progress Stats
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>CILS B1 Requirements</CardTitle>
              <CardDescription>Citizenship Test Overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-medium mb-1">Test Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    The CILS B1 Citizenship test evaluates your ability to communicate in Italian at an intermediate level.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Listening</span>
                    <span className="text-sm font-medium">20 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reading</span>
                    <span className="text-sm font-medium">25 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Writing</span>
                    <span className="text-sm font-medium">25 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Speaking</span>
                    <span className="text-sm font-medium">30 points</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-sm font-medium">Passing Score</span>
                    <span className="text-sm font-medium">≥ 60 points</span>
                  </div>
                </div>
                
                <Alert variant="default" className="bg-primary/5 border-primary/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Time Limits</AlertTitle>
                  <AlertDescription className="text-xs">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Listening: 30 minutes</li>
                      <li>Reading: 40 minutes</li>
                      <li>Writing: 40 minutes</li>
                      <li>Speaking: 10 minutes</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestion;
