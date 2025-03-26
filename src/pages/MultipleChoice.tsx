import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Book, CheckCircle2, XCircle, HelpCircle, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Question, QuestionSet, MultipleChoiceQuestion, QuizAttempt } from '@/types/question';
import { useMultipleChoice } from '@/hooks/useMultipleChoice';
import { Helmet } from 'react-helmet-async';
import ReviewCounter from '@/components/learning/ReviewCounter';
import ReviewIndicator from '@/components/learning/ReviewIndicator';
import ReviewCelebration from '@/components/learning/ReviewCelebration';
import { isDueForReview } from '@/utils/spacedRepetition';
import questionService from '@/services/questionService';

const MultipleChoice = () => {
  const navigate = useNavigate();
  const { setId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { questionSets, getQuestionSetById, saveQuizAttempt } = useMultipleChoice();
  
  const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRevealed, setIsRevealed] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, unanswered: 0 });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState('quiz');
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [dueReviews, setDueReviews] = useState<Question[]>([]);
  const [allReviewsComplete, setAllReviewsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Initialize the quiz
  useEffect(() => {
    if (setId) {
      const questionSet = getQuestionSetById(setId);
      if (questionSet) {
        setCurrentSet(questionSet);
        setStartTime(new Date());
      } else {
        toast({
          title: "Question Set Not Found",
          description: "The requested question set could not be found.",
          variant: "destructive"
        });
        navigate('/dashboard/multiple-choice');
      }
    } else {
      // If no set ID is provided, show the first set or redirect
      if (questionSets.length > 0) {
        setCurrentSet(questionSets[0]);
        setStartTime(new Date());
      } else {
        toast({
          title: "No Question Sets",
          description: "There are no question sets available.",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    }
  }, [setId, questionSets, navigate, toast, getQuestionSetById]);
  
  // Load due reviews when review mode is activated
  useEffect(() => {
    if (isReviewMode && user) {
      const loadDueReviews = async () => {
        try {
          const reviews = await questionService.getDueReviews(user.id, 20);
          setDueReviews(reviews);
          
          if (reviews.length === 0) {
            setAllReviewsComplete(true);
            setShowCelebration(true);
          } else {
            setAllReviewsComplete(false);
            setCurrentQuestionIndex(0);
            setAnswers({});
            setIsRevealed(false);
            setQuizComplete(false);
            setScore({ correct: 0, incorrect: 0, unanswered: 0 });
            setStartTime(new Date());
            setElapsedTime(0);
          }
        } catch (error) {
          console.error('Error loading due reviews:', error);
          toast({
            title: 'Error Loading Reviews',
            description: 'There was a problem loading your due reviews.',
            variant: 'destructive'
          });
        }
      };
      
      loadDueReviews();
    }
  }, [isReviewMode, user, toast]);
  
  // Timer effect
  useEffect(() => {
    if (!startTime || quizComplete) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, quizComplete]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get the current question - use review question if in review mode
  const currentQuestion = isReviewMode 
    ? (dueReviews[currentQuestionIndex] as MultipleChoiceQuestion) 
    : (currentSet?.questions[currentQuestionIndex] as MultipleChoiceQuestion);
  
  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    if (isRevealed || quizComplete) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion?.id || '']: value
    }));
  };
  
  // Check if the selected answer is correct
  const isAnswerCorrect = (): boolean => {
    if (!currentQuestion) return false;
    const selectedAnswer = answers[currentQuestion.id];
    return selectedAnswer === currentQuestion.correctAnswer;
  };
  
  // Reveal the answer
  const handleRevealAnswer = () => {
    setIsRevealed(true);
  };
  
  // Handle review mode toggle
  const handleReviewModeToggle = (reviewMode: boolean) => {
    setIsReviewMode(reviewMode);
    setActiveTab('quiz');
  };
  
  // Move to the next question
  const handleNextQuestion = () => {
    if ((!currentSet && !isReviewMode) || (!dueReviews.length && isReviewMode)) return;
    
    // Update the score if revealed
    if (isRevealed) {
      if (isAnswerCorrect()) {
        setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
    } else {
      setScore(prev => ({ ...prev, unanswered: prev.unanswered + 1 }));
    }
    
    // Check if this was the last question
    const isLastQuestion = isReviewMode 
      ? currentQuestionIndex >= dueReviews.length - 1
      : currentQuestionIndex >= (currentSet?.questions.length || 0) - 1;
      
    if (isLastQuestion) {
      completeQuiz();
    } else {
      // Move to the next question
      setCurrentQuestionIndex(prev => prev + 1);
      setIsRevealed(false);
    }
  };
  
  // Complete the quiz
  const completeQuiz = () => {
    if ((!currentSet && !isReviewMode) || (!user && isReviewMode)) return;
    
    // Calculate final score
    const questions = isReviewMode ? dueReviews : currentSet?.questions || [];
    const totalQuestions = questions.length;
    const correctAnswers = score.correct + (isRevealed && isAnswerCorrect() ? 1 : 0);
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Save the quiz attempt
    const quizAttempt: Omit<QuizAttempt, 'createdAt'> = {
      id: crypto.randomUUID(),
      userId: user?.id || 'guest',
      questionSetId: isReviewMode ? 'review' : (currentSet?.id || 'unknown'),
      answers: answers,
      score: correctAnswers,
      totalQuestions,
      completedAt: new Date(),
      completed: true,
      timeSpent: elapsedTime,
      isReview: isReviewMode
    };
    
    saveQuizAttempt(quizAttempt);
    
    // Set quiz complete
    setQuizComplete(true);
    setActiveTab('results');
    
    // Show celebration if all reviews are complete
    if (isReviewMode) {
      setShowCelebration(true);
      setAllReviewsComplete(true);
    }
    
    // Show completion toast
    toast({
      title: isReviewMode ? "Review Completed" : "Quiz Completed",
      description: `You scored ${correctAnswers} out of ${totalQuestions} (${finalScore}%)`,
    });
  };
  
  // Start a new quiz with the same set
  const handleRestartQuiz = () => {
    // If in review mode, reload due reviews
    if (isReviewMode && user) {
      const loadDueReviews = async () => {
        try {
          const reviews = await questionService.getDueReviews(user.id, 20);
          setDueReviews(reviews);
          
          if (reviews.length === 0) {
            setAllReviewsComplete(true);
            setShowCelebration(true);
          } else {
            resetQuiz();
          }
        } catch (error) {
          console.error('Error loading due reviews:', error);
        }
      };
      
      loadDueReviews();
    } else {
      resetQuiz();
    }
  };
  
  // Reset quiz state
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsRevealed(false);
    setQuizComplete(false);
    setScore({ correct: 0, incorrect: 0, unanswered: 0 });
    setStartTime(new Date());
    setElapsedTime(0);
    setActiveTab('quiz');
  };
  
  // Handle celebration completion
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };
  
  // Go back to the quiz selection
  const handleBackToSets = () => {
    navigate('/dashboard/multiple-choice');
  };
  
  // Calculate progress percentage
  const progressPercentage = isReviewMode 
    ? ((currentQuestionIndex + (isRevealed ? 1 : 0)) / (dueReviews.length || 1)) * 100 
    : currentSet 
      ? ((currentQuestionIndex + (isRevealed ? 1 : 0)) / currentSet.questions.length) * 100 
      : 0;
  
  // Sample data for demonstration
  const sampleQuestions: MultipleChoiceQuestion[] = [
    {
      id: "1",
      type: "multiple-choice",
      question: "What is the Italian word for 'hello'?",
      options: ["Ciao", "Arrivederci", "Grazie", "Prego"],
      correctAnswer: "Ciao",
      explanation: "Ciao is a casual greeting in Italian, equivalent to 'hello' or 'hi' in English.",
      difficulty: "Beginner",
      category: "Vocabulary",
      tags: ["greeting", "basic"],
      createdAt: new Date(),
      updatedAt: new Date(),
      language: "english"
    },
    {
      id: "2",
      type: "multiple-choice",
      question: "Which of these is NOT an Italian word for a type of pasta?",
      options: ["Spaghetti", "Penne", "Panini", "Linguine"],
      correctAnswer: "Panini",
      explanation: "Panini is actually the Italian word for sandwiches. The other options are all types of pasta.",
      difficulty: "Beginner",
      category: "Food",
      tags: ["food", "pasta"],
      createdAt: new Date(),
      updatedAt: new Date(),
      language: "english"
    }
  ];
  
  // If no sets are available, use sample data
  useEffect(() => {
    if (!currentSet && questionSets.length === 0) {
      setCurrentSet({
        id: "sample",
        title: "Italian Basics Sample Quiz",
        description: "A sample quiz to demonstrate the multiple choice feature.",
        questions: sampleQuestions,
        category: "Vocabulary",
        difficulty: "Beginner",
        language: "english",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setStartTime(new Date());
    }
  }, [currentSet, questionSets]);
  
  if (isReviewMode && allReviewsComplete && !currentQuestion) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Helmet>
          <title>Reviews Complete | Italian Learning</title>
        </Helmet>
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Spaced Repetition</h1>
          <ReviewCounter onReviewModeToggle={handleReviewModeToggle} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Reviews Complete</CardTitle>
            <CardDescription>
              You've finished all your reviews for today. Great job!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">You're all caught up!</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Come back tomorrow for more reviews. Consistent review is the key to mastering a language.
            </p>
            
            <Button onClick={() => setIsReviewMode(false)}>
              Learn New Content
            </Button>
          </CardContent>
        </Card>
        
        <ReviewCelebration 
          isVisible={showCelebration} 
          onComplete={handleCelebrationComplete} 
        />
      </div>
    );
  }
  
  if (!currentSet && !isReviewMode) {
    return <div className="flex justify-center items-center h-96">Loading quiz...</div>;
  }
  
  if (!currentQuestion) {
    return <div className="flex justify-center items-center h-96">No questions available</div>;
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>{isReviewMode ? "Review Mode" : "Multiple Choice Quiz"} | Italian Learning</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isReviewMode ? "Spaced Repetition" : "Multiple Choice"}</h1>
        <ReviewCounter onReviewModeToggle={handleReviewModeToggle} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quiz">{isReviewMode ? "Review" : "Quiz"}</TabsTrigger>
          <TabsTrigger value="results" disabled={!quizComplete}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quiz">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  {isReviewMode 
                    ? "Review Questions" 
                    : currentSet?.title
                  }
                </h2>
                <p className="text-muted-foreground">
                  {isReviewMode
                    ? `Reviewing ${dueReviews.length} question${dueReviews.length !== 1 ? 's' : ''}`
                    : currentSet?.description
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {isReviewMode ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <History className="h-3 w-3" />
                    Review Mode
                  </Badge>
                ) : (
                  <>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {currentSet?.difficulty}
                    </span>
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                      {currentSet?.category}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Book className="w-4 h-4 mr-1" />
                <span>
                  Question {currentQuestionIndex + 1} of {isReviewMode ? dueReviews.length : currentSet?.questions.length}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            {currentQuestion ? (
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                    {isReviewMode && currentQuestion.nextReviewDate && (
                      <ReviewIndicator question={currentQuestion} showDays />
                    )}
                  </div>
                  <CardDescription className="text-lg font-medium text-foreground">
                    {currentQuestion.question || currentQuestion.text}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={handleAnswerSelect}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 p-3 rounded-md border ${
                          isRevealed && option === currentQuestion.correctAnswer
                            ? 'bg-green-500/10 border-green-500/50'
                            : isRevealed && answers[currentQuestion.id] === option && option !== currentQuestion.correctAnswer
                              ? 'bg-destructive/10 border-destructive/50'
                              : ''
                        }`}
                      >
                        <RadioGroupItem
                          value={option}
                          id={`option-${index}`}
                          disabled={isRevealed}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className={`flex-grow ${
                            isRevealed && option === currentQuestion.correctAnswer
                              ? 'text-green-600 dark:text-green-400 font-medium'
                              : isRevealed && answers[currentQuestion.id] === option && option !== currentQuestion.correctAnswer
                                ? 'text-destructive font-medium'
                                : ''
                          }`}
                        >
                          {option}
                        </Label>
                        
                        {isRevealed && option === currentQuestion.correctAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                        
                        {isRevealed && answers[currentQuestion.id] === option && option !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                
                {isRevealed && currentQuestion.explanation && (
                  <div className="px-6 pb-4">
                    <div className="p-3 rounded-md bg-muted text-muted-foreground">
                      <p className="font-medium text-foreground">Explanation:</p>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  </div>
                )}
                
                <CardFooter className="flex justify-between">
                  {!isRevealed ? (
                    <>
                      <Button variant="outline" onClick={handleRevealAnswer} disabled={!answers[currentQuestion.id]}>
                        Show Answer
                      </Button>
                      <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex >= (isReviewMode ? dueReviews.length - 1 : (currentSet?.questions.length || 0) - 1) 
                          ? 'Skip & Finish' 
                          : 'Skip'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleNextQuestion} className="ml-auto">
                      {currentQuestionIndex >= (isReviewMode ? dueReviews.length - 1 : (currentSet?.questions.length || 0) - 1) 
                        ? 'Finish' 
                        : 'Next Question'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">No questions available</p>
                  <p className="text-muted-foreground">This set has no questions.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
              <CardDescription>
                {currentSet?.title} - {formatTime(elapsedTime)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {score.correct}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Correct</div>
                </div>
                
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-destructive">
                    {score.incorrect}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Incorrect</div>
                </div>
                
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-muted-foreground">
                    {score.unanswered}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Skipped</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span className="font-medium">
                    {Math.round((score.correct / (currentSet?.questions.length || 1)) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(score.correct / (currentSet?.questions.length || 1)) * 100}
                  className="h-2"
                />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Time Spent</h3>
                <p className="text-muted-foreground">{formatTime(elapsedTime)}</p>
              </div>
              
              {/* Quiz analytics would go here in a more advanced app */}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBackToSets}>
                Back to Question Sets
              </Button>
              <Button onClick={handleRestartQuiz}>
                Retry Quiz
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ReviewCelebration 
        isVisible={showCelebration} 
        onComplete={handleCelebrationComplete} 
      />
    </div>
  );
};

export default MultipleChoice;
