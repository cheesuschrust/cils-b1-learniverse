
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AIGeneratedQuestion, ItalianTestSection, ItalianLevel } from '@/types/italian-types';
import { AlertCircle, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QuestionAnsweringComponentProps {
  questions: AIGeneratedQuestion[];
  contentType: ItalianTestSection;
  onComplete: (score: number) => void;
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
        const questionTime = Math.floor((Date.now() - startTime) / 1000);
        setTimeSpent(prev => prev + questionTime);
      }
    };
  }, [currentQuestionIndex]);
  
  // Reset state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setHasAnswered(false);
    setCorrectAnswers(0);
    setShowExplanation(false);
    setTimeSpent(0);
    setStartTime(Date.now());
  }, [questions]);
  
  const handleAnswerSelect = (value: string) => {
    if (!hasAnswered) {
      setSelectedAnswer(value);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        variant: "destructive"
      });
      return;
    }
    
    // Record time for this question
    if (startTime) {
      const questionTime = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(prev => prev + questionTime);
    }
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct!",
        variant: "success"
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentQuestion.correctAnswer}`,
        variant: "destructive"
      });
    }
    
    setHasAnswered(true);
    setShowExplanation(true);
    
    // Log the answer (would connect to analytics in a real app)
    console.log('User answer:', {
      userId,
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      correct: isCorrect,
      timeSpent: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
      contentType,
      difficulty: difficultyLevel
    });
  };
  
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate final score as percentage
      const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Call onComplete with score
      onComplete(finalScore);
      
      toast({
        title: "Quiz completed!",
        description: `Your score: ${finalScore}%`,
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
  
  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p>No questions available for this section.</p>
      </div>
    );
  }

  // We need to handle questions that might use either text or question property
  const questionText = currentQuestion.text || currentQuestion.question || "No question text available";
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </h3>
          <span className="text-sm font-medium text-muted-foreground">
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)} • {difficultyLevel}
          </span>
        </div>
        <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-1" />
        <CardTitle className="text-lg mt-4">{questionText}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {currentQuestion.options && (
          <RadioGroup value={selectedAnswer} className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className={`flex items-center space-x-2 rounded-md border p-3 
                ${hasAnswered && option === currentQuestion.correctAnswer ? 'bg-green-50 border-green-200' : ''} 
                ${hasAnswered && selectedAnswer === option && option !== currentQuestion.correctAnswer ? 'bg-red-50 border-red-200' : ''}`}>
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`} 
                  disabled={hasAnswered}
                  onClick={() => handleAnswerSelect(option)} 
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
                {hasAnswered && option === currentQuestion.correctAnswer && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {hasAnswered && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
        )}
        
        {showExplanation && currentQuestion.explanation && (
          <div className="mt-4 p-3 rounded-md bg-muted/50">
            <h4 className="font-medium mb-1">Explanation:</h4>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!hasAnswered ? (
          <Button onClick={handleSubmitAnswer} className="w-full">
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="w-full">
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuestionAnsweringComponent;
