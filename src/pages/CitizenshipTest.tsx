import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Check, X, Info, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  options: { [key: string]: string };
  correct_answer: string;
  explanation: string | null;
  category: string;
}

const CitizenshipTest = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('category', 'citizenship')
          .limit(10);
          
        if (error) throw error;
        
        if (data) {
          const formattedQuestions = data.map(q => ({
            id: q.id,
            question_text: q.question,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            category: q.category
          }));
          
          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load citizenship test questions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [toast]);

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const currentQ = questions[currentQuestion];
    const isAnswerCorrect = answer === currentQ.correct_answer;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    if (user) {
      logAttempt(currentQ.id, answer, isAnswerCorrect);
    }
  };

  const logAttempt = async (questionId: string, answer: string, isCorrect: boolean) => {
    try {
      await supabase.from('question_responses').insert({
        user_id: user?.id,
        question_id: questionId,
        user_answer: answer,
        is_correct: isCorrect,
        time_spent: 0,
      });
    } catch (error) {
      console.error('Error logging attempt:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      
      if (user) {
        logTestCompletion();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const logTestCompletion = async () => {
    try {
      await supabase.from('question_attempts').insert({
        user_id: user?.id,
        content_type: 'citizenship',
        total_questions: questions.length,
        correct_answers: score,
        score_percentage: Math.round((score / questions.length) * 100),
        time_spent: 0,
      });
      
      await supabase.rpc('update_citizenship_progress', {
        user_id: user?.id,
        new_score: Math.round((score / questions.length) * 100)
      });
    } catch (error) {
      console.error('Error logging test completion:', error);
    }
  };

  const handleRestartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Citizenship Test</CardTitle>
            <CardDescription>
              Prepare for your Italian citizenship test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8">No questions available at the moment.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const passPercentage = 60;
    const userPercentage = Math.round((score / questions.length) * 100);
    const passed = userPercentage >= passPercentage;
    
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Your Italian citizenship test performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className="text-muted-foreground">
                {passed 
                  ? 'You passed the practice citizenship test!' 
                  : 'You need more practice for the citizenship test.'}
              </p>
            </div>
            
            <div className="flex items-center justify-center text-4xl font-bold gap-2">
              <span>{score}</span>
              <span className="text-muted-foreground text-lg">/</span>
              <span className="text-muted-foreground text-lg">{questions.length}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Score: {userPercentage}%</span>
                <span>Passing: {passPercentage}%</span>
              </div>
              <Progress 
                value={userPercentage} 
                className="h-3"
                indicatorClassName={passed ? "bg-green-600" : "bg-red-500"}
              />
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Test Feedback:</h3>
              <p className="text-sm">
                {passed 
                  ? 'You have demonstrated a good understanding of the Italian citizenship requirements. Continue practicing to ensure success in the actual test.' 
                  : 'You need to improve your knowledge of Italian citizenship requirements. Focus on studying the areas where you struggled.'}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button onClick={handleRestartTest} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="/resources">Study Resources</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Citizenship Test</CardTitle>
              <CardDescription>
                Preparing you for the Italian citizenship exam
              </CardDescription>
            </div>
            <div className="text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">{currentQ.question_text}</h3>
            </div>
            
            <RadioGroup value={selectedAnswer || ''} className="space-y-3">
              {Object.entries(currentQ.options).map(([key, option]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div 
                    className={`border rounded-md p-4 flex-1 cursor-pointer hover:bg-muted transition-colors ${
                      selectedAnswer === key 
                        ? isCorrect 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                          : 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                        : 'border-input'
                    }`}
                    onClick={() => handleSelectAnswer(key)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={key} disabled={isAnswered} />
                        <Label htmlFor={key} className="cursor-pointer">{option}</Label>
                      </div>
                      
                      {isAnswered && selectedAnswer === key && (
                        isCorrect ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      )}
                      
                      {isAnswered && key === currentQ.correct_answer && selectedAnswer !== key && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
            
            {isAnswered && currentQ.explanation && (
              <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Explanation:</h4>
                  <p className="text-sm mt-1">{currentQ.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {isAnswered ? (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'View Results'
              )}
            </Button>
          ) : (
            <Button disabled>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CitizenshipTest;
