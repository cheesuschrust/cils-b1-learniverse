
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { RefreshCw, CheckCircle, XCircle, Lock } from 'lucide-react';
import SpeakableWord from './SpeakableWord';

interface QuestionOfTheDayProps {
  userId?: string;
}

const QuestionOfTheDay: React.FC<QuestionOfTheDayProps> = () => {
  const {
    todaysQuestion,
    isLoading,
    hasCompletedToday,
    isCorrect,
    selectedAnswer,
    setSelectedAnswer,
    submitAnswer,
    resetQuestion,
    isLimitReached,
  } = useDailyQuestion();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    
    setSubmitting(true);
    await submitAnswer(selectedAnswer);
    setSubmitting(false);
  };

  const handleReset = async () => {
    await resetQuestion();
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLimitReached) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Daily Limit Reached</CardTitle>
          <CardDescription>
            You've reached your daily question limit
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="mb-4">
            Upgrade to premium to get unlimited questions and more features.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>Upgrade to Premium</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!todaysQuestion) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Question Available</CardTitle>
          <CardDescription>
            There is no question available for today
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p>Please check back later for today's question.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Question of the Day</CardTitle>
        <CardDescription>
          {todaysQuestion.category.charAt(0).toUpperCase() + todaysQuestion.category.slice(1)} • {
            todaysQuestion.difficulty.charAt(0).toUpperCase() + todaysQuestion.difficulty.slice(1)
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="font-medium text-lg">
          <SpeakableWord 
            word={todaysQuestion.question_text} 
            language="it" 
          />
        </div>
        
        <RadioGroup 
          value={selectedAnswer || ""} 
          onValueChange={setSelectedAnswer}
          disabled={hasCompletedToday}
          className="space-y-3"
        >
          {Array.isArray(todaysQuestion.options) ? 
            todaysQuestion.options.map((option) => (
              <div 
                key={option}
                className={`flex items-center space-x-2 border p-3 rounded-md
                  ${hasCompletedToday && option === todaysQuestion.correct_answer 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : ''}
                  ${hasCompletedToday && selectedAnswer === option && option !== todaysQuestion.correct_answer 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : ''}
                  ${!hasCompletedToday 
                    ? 'hover:border-primary hover:bg-accent/10 transition-colors' 
                    : ''}
                `}
              >
                <RadioGroupItem 
                  value={option} 
                  id={option} 
                  disabled={hasCompletedToday}
                />
                <Label 
                  htmlFor={option} 
                  className={`flex-grow cursor-pointer ${hasCompletedToday ? 'cursor-default' : ''}`}
                >
                  <SpeakableWord word={option} language="it" />
                </Label>
                
                {hasCompletedToday && option === todaysQuestion.correct_answer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                
                {hasCompletedToday && selectedAnswer === option && option !== todaysQuestion.correct_answer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )) : (
              <p className="text-red-500">No options available</p>
            )
          }
        </RadioGroup>
        
        {hasCompletedToday && todaysQuestion.explanation && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h4 className="font-medium mb-1">Explanation:</h4>
            <p className="text-sm text-muted-foreground">{todaysQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!hasCompletedToday ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer || submitting}
            className="w-full"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </Button>
        ) : (
          <div className="flex w-full gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button className="flex-1">
              {isCorrect ? "Continue Learning" : "Practice Similar Questions"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuestionOfTheDay;
