
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getDailyQuestion } from '@/services/questionService';

const DailyQuestion = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const { data: question, isLoading } = useQuery({
    queryKey: ['dailyQuestion'],
    queryFn: getDailyQuestion
  });

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === question?.correctAnswer;
    
    toast({
      title: isCorrect ? "Correct!" : "Not quite right",
      description: isCorrect 
        ? "Great job! You've earned XP points."
        : `The correct answer was: ${question?.correctAnswer}`,
      variant: isCorrect ? "success" : "destructive",
    });
  };

  if (isLoading || !question) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg">{question.text}</div>
        <div className="space-y-2">
          {question.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleAnswer(option)}
              variant={selectedAnswer === option 
                ? (option === question.correctAnswer ? "success" : "destructive") 
                : "outline"
              }
              className="w-full justify-start h-auto py-4 px-6"
              disabled={isAnswered}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Category: {question.category}
        </div>
        {isAnswered && (
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Next Question
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DailyQuestion;
