
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AIGeneratedQuestion, ItalianTestSection, ItalianLevel } from '@/types/core-types';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
  const [score, setScore] = useState(0);
  const [startTime] = useState<Date>(new Date());
  const [answers, setAnswers] = useState<Array<{
    questionId: string;
    selectedAnswer: string | null;
    isCorrect: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const questionsCount = questions.length;
  const progress = ((currentQuestionIndex + 1) / questionsCount) * 100;

  // Function to handle submitting an answer
  const handleSubmitAnswer = () => {
    if (!selectedAnswer && contentType !== 'writing' && contentType !== 'speaking') return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      
      setAnswers(prev => [
        ...prev,
        {
          questionId: currentQuestion?.id || '',
          selectedAnswer,
          isCorrect: isCorrect
        }
      ]);
      
      setIsAnswerSubmitted(true);
      setIsLoading(false);
    }, 500);
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    
    if (currentQuestionIndex < questionsCount - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate final score
      const finalScore = Math.round((score / questionsCount) * 100);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  };

  // Handle completion of the exercise
  useEffect(() => {
    if (currentQuestionIndex === questionsCount && onComplete) {
      const finalScore = Math.round((score / questionsCount) * 100);
      onComplete(finalScore);
    }
  }, [currentQuestionIndex, questionsCount, score, onComplete]);

  // If no questions are available, show a message
  if (!questions || questions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <p>No questions available for this section.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // When all questions are answered, show the summary
  if (currentQuestionIndex >= questionsCount) {
    const finalScore = Math.round((score / questionsCount) * 100);
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <h2 className="text-2xl font-bold">Exercise Completed!</h2>
            <p className="text-lg">
              Your score: <span className="font-bold">{finalScore}%</span>
            </p>
            <p>
              Time spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
            </p>
            <p>
              Correct answers: {score} out of {questionsCount}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            Question {currentQuestionIndex + 1} of {questionsCount}
          </div>
          <div className="text-sm">
            Score: {score} / {currentQuestionIndex}
          </div>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              {currentQuestion?.question || currentQuestion?.text}
            </h3>
            
            {contentType === 'writing' ? (
              <div className="space-y-2">
                <Textarea 
                  placeholder="Write your answer here..." 
                  rows={6}
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
              </div>
            ) : contentType === 'speaking' ? (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-24"
                  onClick={() => setSelectedAnswer('Recording submitted')}
                >
                  Click to Record
                </Button>
                {selectedAnswer && (
                  <p className="text-center text-sm text-green-600">Recording submitted</p>
                )}
              </div>
            ) : (
              <RadioGroup
                value={selectedAnswer || ''}
                onValueChange={setSelectedAnswer}
                className="space-y-2"
              >
                {currentQuestion?.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Radio
                      value={option}
                      id={`option-${index}`}
                      disabled={isAnswerSubmitted}
                    />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                    
                    {isAnswerSubmitted && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    
                    {isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
          
          {isAnswerSubmitted && currentQuestion.explanation && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-1">Explanation:</h4>
              <p className="text-sm text-green-700">{currentQuestion.explanation}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            {!isAnswerSubmitted ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={isLoading || (!selectedAnswer && contentType !== 'writing' && contentType !== 'speaking')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < questionsCount - 1 ? 'Next Question' : 'Finish'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionAnsweringComponent;
