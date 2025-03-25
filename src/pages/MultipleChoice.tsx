
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ChevronRight, CheckCircle, AlertCircle, Pencil, XCircle, ChevronLeft, RotateCcw, Save, Plus, Tag, Filter, Clock } from 'lucide-react';
import { generateQuestionSet, evaluateAnswer } from '@/services/questionService';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';
import { MultipleChoiceQuestion, QuestionSet } from '@/types/question';
import { useMultipleChoice } from '@/hooks/useMultipleChoice';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import SpeakableWord from '@/components/learning/SpeakableWord';

const CATEGORIES = [
  'Italian Grammar',
  'Vocabulary',
  'Common Phrases',
  'Verb Conjugation',
  'Travel Phrases',
  'Business Italian',
  'Food and Dining',
  'Art and Culture',
  'Italian History',
  'Idioms and Expressions'
];

const MultipleChoicePage: React.FC = () => {
  const { isAIEnabled, speakText, isSpeaking } = useAIUtils();
  const { toast } = useToast();
  const { 
    questionSets, 
    saveQuestionSet, 
    saveQuizAttempt, 
    getQuizStats 
  } = useMultipleChoice();
  const { language, autoPlayAudio } = useUserPreferences();
  
  // State for generating questions
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [questionCount, setQuestionCount] = useState(5);
  const [questionLanguage, setQuestionLanguage] = useState<'english' | 'italian'>(language === 'it' ? 'italian' : 'english');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // State for quiz
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<QuestionSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // State for feedback
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  
  // Stats
  const quizStats = useMemo(() => getQuizStats(), [getQuizStats]);
  
  // Setup timer when quiz starts
  useEffect(() => {
    if (quizMode && startTime === null) {
      setStartTime(Date.now());
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000));
      }, 1000);
      setTimer(interval);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [quizMode, startTime, timer]);
  
  // Format elapsed time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle generating questions
  const handleGenerateQuestions = async () => {
    if (!isAIEnabled) {
      toast({
        title: "AI Features Disabled",
        description: "Enable AI to generate custom questions. Using pre-made question sets instead.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      let prompt = category;
      if (customPrompt) {
        prompt = customPrompt;
      }
      
      const generatedQuestions = await generateQuestionSet(
        prompt,
        difficulty,
        questionLanguage,
        questionCount
      );
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error('Failed to generate questions. Please try again with a different topic.');
      }
      
      // Map the generated questions to our question format
      const questions: MultipleChoiceQuestion[] = generatedQuestions.map((item, index) => ({
        id: `gen-${Date.now()}-${index}`,
        question: item.question,
        options: item.options,
        correctAnswer: item.options[item.correctAnswerIndex],
        explanation: item.explanation || 'Explanation not provided',
        difficulty,
        category: prompt,
        language: questionLanguage
      }));
      
      // Create a new question set
      const newQuestionSet: QuestionSet = {
        id: `set-${Date.now()}`,
        title: `${difficulty} ${prompt}`,
        description: `Generated ${questionCount} questions about ${prompt}`,
        questions,
        category: prompt,
        difficulty,
        language: questionLanguage,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      saveQuestionSet(newQuestionSet);
      
      toast({
        title: "Questions Generated",
        description: `Successfully created ${questions.length} ${difficulty.toLowerCase()} level questions.`,
      });
      
      // Start quiz with new questions
      setCurrentQuestionSet(newQuestionSet);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setQuizMode(true);
      setShowResults(false);
      setQuizCompleted(false);
      setStartTime(Date.now());
      setElapsedTime(0);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate questions');
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate questions',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Start quiz with a saved question set
  const handleStartQuiz = (questionSetId: string) => {
    const set = questionSets.find(s => s.id === questionSetId);
    if (set) {
      setCurrentQuestionSet(set);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setQuizMode(true);
      setShowResults(false);
      setQuizCompleted(false);
      setStartTime(Date.now());
      setElapsedTime(0);
    }
  };
  
  // Handle selecting an answer
  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (quizCompleted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (!currentQuestionSet) return;
    
    if (currentQuestionIndex < currentQuestionSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of quiz
      setShowResults(true);
      
      // Stop timer
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      
      // Calculate results
      const score = calculateScore();
      
      // Save attempt
      if (!quizCompleted) {
        saveQuizAttempt({
          id: `attempt-${Date.now()}`,
          userId: 'current-user',
          questionSetId: currentQuestionSet.id,
          score,
          totalQuestions: currentQuestionSet.questions.length,
          completedAt: new Date(),
          timeSpent: elapsedTime
        });
        
        setQuizCompleted(true);
      }
      
      toast({
        title: "Quiz Completed!",
        description: `Your score: ${score} out of ${currentQuestionSet.questions.length}`,
      });
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Calculate score
  const calculateScore = (): number => {
    if (!currentQuestionSet) return 0;
    
    return currentQuestionSet.questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
  };
  
  // Get detailed feedback on an answer
  const handleGetFeedback = async (questionId: string) => {
    if (!isAIEnabled || !currentQuestionSet) {
      toast({
        title: "Feature Disabled",
        description: "AI features are required for detailed feedback.",
        variant: "destructive",
      });
      return;
    }
    
    const question = currentQuestionSet.questions.find(q => q.id === questionId);
    if (!question) return;
    
    setIsFeedbackLoading(true);
    
    try {
      const response = await evaluateAnswer(
        selectedAnswers[questionId],
        question.correctAnswer,
        question.question,
        questionLanguage
      );
      
      setFeedback(response);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback('Unable to generate feedback at this time. Please try again later.');
    } finally {
      setIsFeedbackLoading(false);
    }
  };
  
  // Reset the quiz to start over
  const handleResetQuiz = () => {
    if (currentQuestionSet) {
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setShowResults(false);
      setQuizCompleted(false);
      setStartTime(Date.now());
      setElapsedTime(0);
    }
  };
  
  // Speak the current question
  const handleSpeakQuestion = useCallback(async () => {
    if (!currentQuestionSet) return;
    
    const question = currentQuestionSet.questions[currentQuestionIndex];
    if (!question) return;
    
    try {
      await speakText(
        question.question, 
        questionLanguage === 'italian' ? 'it-IT' : 'en-US'
      );
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }, [currentQuestionSet, currentQuestionIndex, questionLanguage, speakText]);
  
  // Auto-speak question when navigating
  useEffect(() => {
    if (quizMode && autoPlayAudio && currentQuestionSet) {
      handleSpeakQuestion();
    }
  }, [quizMode, currentQuestionIndex, handleSpeakQuestion, autoPlayAudio, currentQuestionSet]);
  
  // Get current question
  const currentQuestion = useMemo(() => {
    if (!currentQuestionSet || currentQuestionIndex >= currentQuestionSet.questions.length) {
      return null;
    }
    return currentQuestionSet.questions[currentQuestionIndex];
  }, [currentQuestionSet, currentQuestionIndex]);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Multiple Choice</h1>
          <p className="text-muted-foreground">Test your knowledge with quizzes</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConfidenceIndicator contentType="multiple-choice" />
          
          {quizMode && (
            <div className="flex items-center bg-muted px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
          )}
          
          {quizMode && (
            <Button variant="outline" onClick={() => setQuizMode(false)}>
              Exit Quiz
            </Button>
          )}
        </div>
      </header>
      
      {quizMode ? (
        <div className="max-w-3xl mx-auto">
          {/* Quiz Progress Bar */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {currentQuestionSet?.questions.length}
              </span>
              <Badge variant="outline">
                {currentQuestionSet?.difficulty}
              </Badge>
            </div>
            <Progress 
              value={((currentQuestionIndex + 1) / (currentQuestionSet?.questions.length || 1)) * 100} 
              className="h-2" 
            />
          </div>
          
          {showResults ? (
            /* Results View */
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>
                  {currentQuestionSet?.title} - Completed in {formatTime(elapsedTime)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4">
                  <div className="text-2xl font-bold mb-2">
                    Your Score: {calculateScore()} / {currentQuestionSet?.questions.length}
                  </div>
                  <div className="text-lg">
                    {calculateScore() === currentQuestionSet?.questions.length 
                      ? "Perfect score! Excellent work!" 
                      : calculateScore() > (currentQuestionSet?.questions.length || 0) / 2 
                        ? "Good job! Keep practicing to improve." 
                        : "Keep practicing to improve your score."}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-2">Question Summary</h3>
                  
                  {currentQuestionSet?.questions.map((question, index) => {
                    const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                    
                    return (
                      <Card key={question.id} className={`border-l-4 ${
                        isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                      }`}>
                        <CardContent className="pt-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                  {isCorrect ? 
                                    <CheckCircle className="h-4 w-4" /> : 
                                    <XCircle className="h-4 w-4" />
                                  }
                                </div>
                                <span className="font-medium">Question {index + 1}</span>
                              </div>
                              
                              <div className="pl-8">
                                <SpeakableWord 
                                  word={question.question}
                                  language={questionLanguage === 'italian' ? 'it' : 'en'}
                                  className="font-medium"
                                />
                                
                                <div className="mt-2 space-y-1">
                                  {question.options.map((option) => (
                                    <div key={option} className={`flex items-center p-2 rounded-md ${
                                      option === question.correctAnswer ? 'bg-green-50 text-green-700' : 
                                      option === selectedAnswers[question.id] ? 'bg-red-50 text-red-700' : ''
                                    }`}>
                                      <div className="w-5">
                                        {option === question.correctAnswer && <CheckCircle className="h-4 w-4 text-green-500" />}
                                        {option === selectedAnswers[question.id] && option !== question.correctAnswer && 
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        }
                                      </div>
                                      <span className="ml-2">{option}</span>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="mt-3 text-sm text-muted-foreground border-t pt-2">
                                  <span className="font-medium">Explanation: </span>
                                  {question.explanation}
                                </div>
                                
                                {/* AI Feedback */}
                                {feedback && question.id === currentQuestion?.id && (
                                  <Alert className="mt-3">
                                    <AlertDescription>{feedback}</AlertDescription>
                                  </Alert>
                                )}
                                
                                {isAIEnabled && (
                                  <Button 
                                    variant="link" 
                                    className="mt-1 p-0 h-auto text-sm"
                                    onClick={() => handleGetFeedback(question.id)}
                                    disabled={isFeedbackLoading}
                                  >
                                    {isFeedbackLoading && question.id === currentQuestion?.id ? (
                                      <>
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        Generating feedback...
                                      </>
                                    ) : (
                                      <>
                                        <Pencil className="h-3 w-3 mr-1" />
                                        Get detailed explanation
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setQuizMode(false)}>
                  Back to Quizzes
                </Button>
                <Button onClick={handleResetQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart Quiz
                </Button>
              </CardFooter>
            </Card>
          ) : (
            /* Question View */
            currentQuestion && (
              <Card>
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        <SpeakableWord
                          word={currentQuestion.question}
                          language={questionLanguage === 'italian' ? 'it' : 'en'}
                        />
                      </CardTitle>
                      {/* Play button for question audio */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={handleSpeakQuestion}
                        disabled={isSpeaking}
                      >
                        {isSpeaking ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="text-xl">🔊</span>
                        )}
                      </Button>
                    </div>
                    <CardDescription>
                      {currentQuestionSet?.title} - {currentQuestionSet?.difficulty}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedAnswers[currentQuestion.id] || ''}
                    onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
                  >
                    {currentQuestion.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-muted cursor-pointer">
                        <RadioGroupItem 
                          value={option} 
                          id={`option-${option}`} 
                          className="peer" 
                        />
                        <Label 
                          htmlFor={`option-${option}`} 
                          className="flex-1 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestion.id]}
                  >
                    {currentQuestionIndex === currentQuestionSet.questions.length - 1 ? 'Finish' : 'Next'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Create Quiz */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create New Quiz</CardTitle>
                <CardDescription>
                  Generate multiple choice questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="topic">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Question Language</Label>
                  <Select value={questionLanguage} onValueChange={(value) => setQuestionLanguage(value as any)}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Questions</Label>
                  <Select 
                    value={questionCount.toString()} 
                    onValueChange={(value) => setQuestionCount(parseInt(value))}
                  >
                    <SelectTrigger id="count">
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-topic">Custom Topic (Optional)</Label>
                  <Textarea
                    id="custom-topic"
                    placeholder="Enter a specific topic or instructions for the quiz"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use the selected topic or enter a custom topic
                  </p>
                </div>
                
                {generationError && (
                  <Alert variant="destructive">
                    <AlertDescription>{generationError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateQuestions} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Column - Saved Quizzes */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Saved Quizzes</CardTitle>
                <CardDescription>
                  Start a quiz from previously generated questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="saved">
                  <TabsList className="mb-4">
                    <TabsTrigger value="saved">Saved Quizzes</TabsTrigger>
                    <TabsTrigger value="stats">Your Stats</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="saved" className="space-y-4">
                    {questionSets.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No saved quizzes yet. Generate a new quiz to get started!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {questionSets.map((set) => (
                          <Card key={set.id} className="hover:bg-muted/30 transition">
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <h3 className="font-medium">{set.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {set.description}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline">{set.questions.length} Questions</Badge>
                                    <Badge variant="outline">{set.difficulty}</Badge>
                                    <Badge variant="outline">
                                      {set.language === 'italian' ? '🇮🇹 Italian' : '🇬🇧 English'}
                                    </Badge>
                                  </div>
                                </div>
                                <Button onClick={() => handleStartQuiz(set.id)}>
                                  Start Quiz
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="stats">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-muted/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Total Quizzes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{quizStats.totalAttempts}</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-muted/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Average Score</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">
                              {quizStats.totalAttempts > 0 
                                ? `${Math.round(quizStats.averageScore * 100)}%` 
                                : 'N/A'}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-muted/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Best Score</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">
                              {quizStats.totalAttempts > 0 
                                ? `${Math.round(quizStats.bestScore * 100)}%` 
                                : 'N/A'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {quizStats.questionSets.length > 0 ? (
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg">Quiz Performance</h3>
                          {quizStats.questionSets.map((set) => (
                            <Card key={set.id} className="overflow-hidden">
                              <div className="p-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{set.title}</h4>
                                  <Badge variant="outline">{set.attempts} attempts</Badge>
                                </div>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>Best Score:</span>
                                    <span className="font-medium">{Math.round(set.bestScore * 100)}%</span>
                                  </div>
                                  <Progress 
                                    value={set.bestScore * 100} 
                                    className="h-2" 
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            No quiz statistics yet. Complete a quiz to see your performance!
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoicePage;
