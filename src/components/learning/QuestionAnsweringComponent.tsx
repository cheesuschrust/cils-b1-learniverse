
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { AIGeneratedQuestion, ItalianLevel, ItalianTestSection } from '@/types/italian-types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionAnsweringComponentProps {
  questions: AIGeneratedQuestion[];
  contentType: ItalianTestSection;
  onComplete?: (score: number) => void;
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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeStarted] = useState<Date>(new Date());

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  // Reset state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
  }, [questions]);
  
  const handleAnswerSelect = (value: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(value);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    
    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setIsAnswerSubmitted(true);
    
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // All questions completed
      const finalScore = score + (isCorrect ? 1 : 0);
      const percentageScore = (finalScore / totalQuestions) * 100;
      
      if (onComplete) {
        onComplete(percentageScore);
      }
    }
  };
  
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No questions available. Try refreshing or selecting a different category.</p>
        </CardContent>
      </Card>
    );
  }
  
  const progress = ((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / totalQuestions) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Practice
          </CardTitle>
          <div className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="py-4">
        <div className="space-y-6">
          <div className="text-lg font-medium">
            {currentQuestion.question || currentQuestion.text}
          </div>
          
          {currentQuestion.options && (
            <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelect}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswerSubmitted} />
                  <label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </label>
                  {isAnswerSubmitted && option === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {isAnswerSubmitted && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}
          
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <p className="font-medium mb-2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {currentQuestion.explanation && (
                <p className="text-sm">
                  <span className="font-medium">Explanation:</span> {currentQuestion.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm">
          Score: {score}/{currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
        </div>
        <div className="space-x-2">
          {!isAnswerSubmitted ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Complete'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionAnsweringComponent;
