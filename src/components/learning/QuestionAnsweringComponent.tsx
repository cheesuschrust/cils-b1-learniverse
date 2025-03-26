
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useQuestionLimit } from '@/hooks/useQuestionLimit';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  questionType: 'multipleChoice' | 'flashcards' | 'writing' | 'speaking' | 'listening';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface QuestionAnsweringComponentProps {
  questions: Question[];
  contentType: 'multipleChoice' | 'flashcards' | 'writing' | 'speaking' | 'listening';
  onComplete?: (results: AnswerResults) => void;
  showResults?: boolean;
}

interface AnswerResults {
  totalQuestions: number;
  correctAnswers: number;
  percentageCorrect: number;
  questionData: {
    questionId: string;
    correct: boolean;
    userAnswer: string;
    timeSpent: number;
  }[];
  timeSpent: number;
}

const QuestionAnsweringComponent: React.FC<QuestionAnsweringComponentProps> = ({
  questions,
  contentType,
  onComplete,
  showResults = true
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<AnswerResults | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [startTime] = useState<Date>(new Date());
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [revealExplanation, setRevealExplanation] = useState(false);
  
  // Question limit tracking
  const questionLimit = useQuestionLimit(contentType === 'multipleChoice' ? 'multipleChoice' : contentType as any);
  
  // Reset question start time when moving to a new question
  useEffect(() => {
    setQuestionStartTime(new Date());
    setRevealExplanation(false);
  }, [currentIndex]);
  
  // Track time spent on the current question
  const trackQuestionTime = () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    
    const endTime = new Date();
    const timeSpent = (endTime.getTime() - questionStartTime.getTime()) / 1000; // in seconds
    
    setQuestionTimes(prev => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + timeSpent
    }));
  };
  
  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    
    // Track time before moving to next question
    trackQuestionTime();
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };
  
  const handleNext = () => {
    // Track time for current question
    trackQuestionTime();
    
    // Only move forward if there's a next question and current question is answered
    if (currentIndex < questions.length - 1 && answers[questions[currentIndex].id]) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    // Track time for current question
    trackQuestionTime();
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleSubmit = async () => {
    // Track time for the final question
    trackQuestionTime();
    
    setIsChecking(true);
    
    // Calculate results
    let correctCount = 0;
    const questionData = [];
    
    for (const question of questions) {
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      
      if (isCorrect) {
        correctCount++;
      }
      
      questionData.push({
        questionId: question.id,
        correct: isCorrect,
        userAnswer,
        timeSpent: questionTimes[question.id] || 0
      });
    }
    
    const endTime = new Date();
    const totalTimeSpent = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
    
    const calculatedResults: AnswerResults = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentageCorrect: Math.round((correctCount / questions.length) * 100),
      questionData,
      timeSpent: totalTimeSpent
    };
    
    setResults(calculatedResults);
    setSubmitted(true);
    
    // Save results to database if user is logged in
    if (user) {
      try {
        // Save attempt record
        const attemptId = crypto.randomUUID();
        const now = new Date().toISOString();
        
        await supabase.from('question_attempts').insert({
          id: attemptId,
          user_id: user.id,
          content_type: contentType,
          total_questions: questions.length,
          correct_answers: correctCount,
          score_percentage: calculatedResults.percentageCorrect,
          time_spent: totalTimeSpent,
          created_at: now,
          completed: true
        });
        
        // Save individual question responses
        const questionResponses = questionData.map(q => ({
          attempt_id: attemptId,
          question_id: q.questionId,
          user_answer: q.userAnswer,
          is_correct: q.correct,
          time_spent: q.timeSpent,
          created_at: now
        }));
        
        await supabase.from('question_responses').insert(questionResponses);
        
        // Update user metrics
        const { data: existingMetrics } = await supabase
          .from('user_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (existingMetrics) {
          // Update existing metrics
          await supabase
            .from('user_metrics')
            .update({
              total_questions: existingMetrics.total_questions + questions.length,
              correct_answers: existingMetrics.correct_answers + correctCount,
              updated_at: now
            })
            .eq('user_id', user.id);
        } else {
          // Create new metrics record
          await supabase.from('user_metrics').insert({
            user_id: user.id,
            total_questions: questions.length,
            correct_answers: correctCount,
            streak: 1,
            created_at: now,
            updated_at: now
          });
        }
      } catch (error) {
        console.error('Error saving question results:', error);
      }
    }
    
    // Call onComplete callback with results
    if (onComplete) {
      onComplete(calculatedResults);
    }
    
    setIsChecking(false);
    
    toast({
      title: "Assessment Complete",
      description: `You scored ${correctCount} out of ${questions.length} questions correctly.`,
    });
  };
  
  // Check if all questions are answered
  const allQuestionsAnswered = questions.every(q => !!answers[q.id]);
  
  // Current question
  const currentQuestion = questions[currentIndex];
  
  // Render progress and question count info
  const renderProgress = () => {
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    );
  };
  
  // Render the current question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    switch (currentQuestion.questionType) {
      case 'multipleChoice':
        return renderMultipleChoiceQuestion();
      case 'writing':
        return renderWritingQuestion();
      case 'flashcards':
        return renderFlashcardQuestion();
      default:
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unsupported Question Type</AlertTitle>
            <AlertDescription>
              This question type ({currentQuestion.questionType}) is not supported yet.
            </AlertDescription>
          </Alert>
        );
    }
  };
  
  // Render multiple choice question
  const renderMultipleChoiceQuestion = () => {
    if (!currentQuestion || !currentQuestion.options) return null;
    
    const isAnswered = !!answers[currentQuestion.id];
    const isCorrect = submitted && answers[currentQuestion.id] === currentQuestion.correctAnswer;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
        
        <RadioGroup
          value={answers[currentQuestion.id] || ''}
          onValueChange={handleAnswer}
          disabled={submitted}
        >
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <div key={option} className={`
                flex items-center space-x-2 rounded-md border p-3
                ${submitted && option === currentQuestion.correctAnswer ? 'bg-green-50 border-green-200' : ''}
                ${submitted && option === answers[currentQuestion.id] && option !== currentQuestion.correctAnswer ? 'bg-red-50 border-red-200' : ''}
              `}>
                <RadioGroupItem value={option} id={`option-${option}`} />
                <Label htmlFor={`option-${option}`} className="flex-1">
                  {option}
                </Label>
                {submitted && option === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {submitted && option === answers[currentQuestion.id] && option !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </RadioGroup>
        
        {submitted && currentQuestion.explanation && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setRevealExplanation(!revealExplanation)}
            >
              {revealExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </Button>
            
            {revealExplanation && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Render writing question
  const renderWritingQuestion = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
        
        <Textarea
          placeholder="Write your answer here..."
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswer(e.target.value)}
          rows={6}
          disabled={submitted}
          className="w-full"
        />
        
        {submitted && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="font-medium">Sample Answer:</h4>
            <p className="mt-1">{currentQuestion.correctAnswer}</p>
            
            {currentQuestion.explanation && revealExplanation && (
              <div className="mt-2 border-t pt-2">
                <h4 className="font-medium">Explanation:</h4>
                <p className="mt-1 text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
            
            {currentQuestion.explanation && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setRevealExplanation(!revealExplanation)}
              >
                {revealExplanation ? 'Hide Explanation' : 'Show Explanation'}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Render flashcard question
  const renderFlashcardQuestion = () => {
    const [flipped, setFlipped] = useState(false);
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className={`w-full max-w-md aspect-[3/2] cursor-pointer perspective-1000 mb-4`}
          onClick={() => !submitted && setFlipped(!flipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
            {/* Front of card */}
            <div className={`absolute w-full h-full backface-hidden bg-white border rounded-xl p-6 flex items-center justify-center ${flipped ? 'hidden' : ''}`}>
              <h3 className="text-xl font-medium text-center">{currentQuestion.question}</h3>
            </div>
            
            {/* Back of card */}
            <div className={`absolute w-full h-full backface-hidden bg-white border rounded-xl p-6 flex items-center justify-center rotate-y-180 ${flipped ? '' : 'hidden'}`}>
              <p className="text-lg text-center">{currentQuestion.correctAnswer}</p>
            </div>
          </div>
        </div>
        
        <div className="space-x-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setFlipped(false);
              handleAnswer("Incorrect");
            }}
            disabled={submitted}
          >
            Didn't Know
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => {
              setFlipped(false);
              handleAnswer("Correct");
            }}
            disabled={submitted}
          >
            Knew It
          </Button>
        </div>
        
        {submitted && (
          <div className="mt-4 text-center">
            <p>You marked this card as: <strong>{answers[currentQuestion.id]}</strong></p>
          </div>
        )}
      </div>
    );
  };
  
  // Render results summary
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Assessment Complete!</h2>
          <p className="text-muted-foreground">
            You completed {results.totalQuestions} questions in {Math.round(results.timeSpent / 60)} minutes {Math.round(results.timeSpent % 60)} seconds
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-32 h-32 relative flex items-center justify-center rounded-full border-8" style={{
            borderColor: results.percentageCorrect >= 70 ? 'rgb(34, 197, 94)' : 
                          results.percentageCorrect >= 40 ? 'rgb(234, 179, 8)' : 
                          'rgb(239, 68, 68)',
            borderLeftColor: 'transparent',
            transform: `rotate(${45 + (results.percentageCorrect * 2.7)}deg)`
          }}>
            <div className="text-2xl font-bold">
              {results.percentageCorrect}%
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-8 text-center">
          <div>
            <div className="text-3xl font-bold text-green-500">{results.correctAnswers}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-red-500">{results.totalQuestions - results.correctAnswers}</div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </div>
          
          <div>
            <div className="text-3xl font-bold">{Math.round(results.timeSpent / results.totalQuestions)}</div>
            <div className="text-sm text-muted-foreground">Seconds/Question</div>
          </div>
        </div>
        
        <Alert className={`
          ${results.percentageCorrect >= 70 ? 'bg-green-50 border-green-200' : 
            results.percentageCorrect >= 40 ? 'bg-amber-50 border-amber-200' : 
            'bg-red-50 border-red-200'}
        `}>
          <AlertTitle>
            {results.percentageCorrect >= 70 ? 'Excellent work!' : 
             results.percentageCorrect >= 40 ? 'Good effort!' : 
             'Keep practicing!'}
          </AlertTitle>
          <AlertDescription>
            {results.percentageCorrect >= 70 ? 'You have a strong understanding of this material.' : 
             results.percentageCorrect >= 40 ? 'You\'re making good progress, but there\'s room for improvement.' : 
             'This material needs more review. Don\'t worry, practice makes perfect!'}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center">
          <Button onClick={() => setCurrentIndex(0)}>
            Review Questions
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Answer Questions</CardTitle>
        <CardDescription>
          {contentType === 'multipleChoice' ? 'Multiple Choice Questions' : 
           contentType === 'flashcards' ? 'Flashcards' : 
           contentType === 'writing' ? 'Writing Questions' : 
           contentType === 'speaking' ? 'Speaking Practice' : 
           'Listening Exercise'}
        </CardDescription>
        
        {questionLimit && contentType !== 'flashcards' && (
          <Alert variant={questionLimit.canAccessContent ? "default" : "destructive"} className="mt-2 bg-muted">
            <div className="flex items-center gap-2">
              {questionLimit.canAccessContent ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {questionLimit.remainingQuestions === "unlimited" 
                  ? "Premium Access" 
                  : questionLimit.canAccessContent 
                    ? "Questions Available" 
                    : "Daily Limit Reached"
                }
              </AlertTitle>
            </div>
            <AlertDescription className="mt-1">
              {questionLimit.remainingQuestions === "unlimited" 
                ? "You have unlimited questions available (Premium)"
                : questionLimit.canAccessContent
                  ? `You have ${questionLimit.remainingQuestions} questions remaining today`
                  : "You've reached your daily limit. Upgrade to premium for unlimited questions."
              }
            </AlertDescription>
          </Alert>
        )}
        
        {!submitted && renderProgress()}
      </CardHeader>
      
      <CardContent>
        {submitted && showResults && !currentQuestion ? (
          renderResults()
        ) : (
          renderQuestion()
        )}
      </CardContent>
      
      {!submitted || currentQuestion ? (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isChecking}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {Math.floor(Object.values(questionTimes).reduce((sum, time) => sum + time, 0) / 60)}m {Math.round(Object.values(questionTimes).reduce((sum, time) => sum + time, 0) % 60)}s
          </div>
          
          {currentIndex < questions.length - 1 ? (
            <Button
              variant={answers[currentQuestion?.id] ? "default" : "outline"}
              onClick={handleNext}
              disabled={!answers[currentQuestion?.id] || isChecking}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isChecking || submitted}
            >
              {isChecking ? (
                <>Checking...</>
              ) : (
                <>Submit Answers</>
              )}
            </Button>
          )}
        </CardFooter>
      ) : null}
    </Card>
  );
};

export default QuestionAnsweringComponent;
