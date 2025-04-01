
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AIGeneratedQuestion, ItalianLevel, ItalianTestSection } from '@/types/italian-types';
import { AlertCircle, CheckCircle, ChevronRight, Medal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No questions available for this section. Try refreshing.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleSubmit = () => {
    if (!selectedAnswers[currentQuestion]) return;

    setIsSubmitted(true);
    
    // Calculate if answer is correct for the current question
    const currentScore = selectedAnswers[currentQuestion] === question.correctAnswer ? 1 : 0;
    
    // Update the overall score
    setScore(prev => prev + currentScore);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final score as percentage
      const finalScore = (score / questions.length) * 100;
      setIsCompleted(true);
      onComplete(finalScore);
    }
  };

  const isCurrentAnswerCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;

  return (
    <div className="space-y-8">
      {!isCompleted ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <span className="text-muted-foreground text-sm">
                {contentType} • {difficultyLevel}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{question.text || question.question}</h3>
              
              <RadioGroup 
                value={selectedAnswers[currentQuestion]} 
                onValueChange={handleAnswerSelect}
                disabled={isSubmitted}
              >
                <div className="space-y-3">
                  {question.options?.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${i}`}
                        disabled={isSubmitted}
                        className={isSubmitted ? 
                          (option === question.correctAnswer ? "text-primary border-primary" : 
                           (selectedAnswers[currentQuestion] === option ? "text-destructive border-destructive" : ""))
                          : ""
                        }
                      />
                      <Label 
                        htmlFor={`option-${i}`}
                        className={isSubmitted ? 
                          (option === question.correctAnswer ? "text-primary" : 
                           (selectedAnswers[currentQuestion] === option && option !== question.correctAnswer ? "text-destructive" : ""))
                          : ""
                        }
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            
            {isSubmitted && (
              <div className={`p-4 rounded-md ${isCurrentAnswerCorrect ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                <div className="flex gap-2 items-center mb-2">
                  {isCurrentAnswerCorrect ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                  <h4 className="font-medium">
                    {isCurrentAnswerCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                </div>
                <p className="text-sm">
                  {question.explanation || `The correct answer is: ${question.correctAnswer}`}
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {Object.keys(selectedAnswers).length}/{questions.length} answered
            </div>
            
            <div className="space-x-2">
              {!isSubmitted ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!selectedAnswers[currentQuestion]}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestion < questions.length - 1 ? (
                    <>Next Question <ChevronRight className="ml-2 h-4 w-4" /></>
                  ) : (
                    'Complete Quiz'
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Medal className="h-5 w-5" /> Quiz Completed
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <p className="text-3xl font-bold">{Math.round((score / questions.length) * 100)}%</p>
              <p className="text-muted-foreground">
                You got {score} out of {questions.length} questions correct
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Progress Summary</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {score >= (questions.length * 0.7) 
                  ? "Great job! You've mastered this section." 
                  : "Keep practicing to improve your score."}
              </p>
              
              <Button className="w-full" onClick={() => window.location.reload()}>
                Practice Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionAnsweringComponent;
