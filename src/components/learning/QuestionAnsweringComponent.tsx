
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackProgress } from '@/integrations/supabase/client';
import { ItalianTestSection, ItalianLevel } from '@/types/italian-types';

interface QuestionAnsweringComponentProps {
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }[];
  contentType: ItalianTestSection;
  onComplete: (result: { score: number; timeSpent: number }) => void;
  difficultyLevel: ItalianLevel;
  userId?: string;
}

const QuestionAnsweringComponent: React.FC<QuestionAnsweringComponentProps> = ({
  questions,
  contentType,
  onComplete,
  difficultyLevel,
  userId
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const { toast } = useToast();
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  // Start timer when component mounts or question changes
  useEffect(() => {
    setStartTime(Date.now());
    
    return () => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeSpent(prev => prev + elapsed);
      }
    };
  }, [currentQuestionIndex]);
  
  const handleAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate time spent on this question
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(prev => prev + elapsed);
      setStartTime(null);
    }
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
      });
    }
    
    setHasAnswered(true);
    setShowExplanation(true);
  };
  
  const handleNext = () => {
    // Track progress if userId is provided
    if (userId) {
      trackProgress({
        user_id: userId,
        content_id: `${contentType}-question-${currentQuestion.id}`,
        score: hasAnswered && selectedAnswer === currentQuestion.correctAnswer ? 100 : 0,
        completed: true,
        answers: {
          selected: selectedAnswer,
          correct: currentQuestion.correctAnswer
        }
      }).catch(console.error);
    }
    
    if (isLastQuestion) {
      // Calculate final score
      const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Call onComplete with results
      onComplete({
        score: finalScore, 
        timeSpent
      });
      
      toast({
        title: "Quiz completed!",
        description: `You scored ${finalScore}% (${correctAnswers}/${totalQuestions})`,
      });
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setHasAnswered(false);
      setShowExplanation(false);
      setStartTime(Date.now());
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm text-muted-foreground">
          {correctAnswers} correct
        </span>
      </div>
      <Progress 
        value={(currentQuestionIndex / totalQuestions) * 100} 
        className="h-2" 
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            className="space-y-3"
            disabled={hasAnswered}
          >
            {currentQuestion.options.map((option) => (
              <div 
                key={option} 
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  hasAnswered && option === currentQuestion.correctAnswer
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : hasAnswered && option === selectedAnswer
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value={option} id={option} />
                <Label 
                  htmlFor={option} 
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
                {hasAnswered && option === currentQuestion.correctAnswer && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {hasAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {showExplanation && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Explanation:</p>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!hasAnswered ? (
            <Button 
              onClick={handleAnswer} 
              disabled={!selectedAnswer}
              className="w-full"
            >
              Check Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="w-full"
            >
              {isLastQuestion ? 'Finish' : 'Next Question'} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionAnsweringComponent;
