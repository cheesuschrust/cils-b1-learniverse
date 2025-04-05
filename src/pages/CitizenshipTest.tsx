
import React, { useState } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Check, RefreshCw } from 'lucide-react';

// Mock citizenship test questions 
const mockQuestions = [
  {
    id: '1',
    question: 'What is the capital of Italy?',
    options: ['Milan', 'Rome', 'Naples', 'Florence'],
    correctAnswer: 'Rome',
    explanation: 'Rome is the capital city of Italy and serves as the administrative center of both the country and the Rome province.'
  },
  {
    id: '2',
    question: 'What is the official language of Italy?',
    options: ['English', 'French', 'Italian', 'Spanish'],
    correctAnswer: 'Italian',
    explanation: 'Italian is the official language of Italy, derived from the Latin language and part of the Romance language family.'
  },
  {
    id: '3',
    question: 'Which of these is NOT one of the colors in the Italian flag?',
    options: ['Green', 'Red', 'White', 'Blue'],
    correctAnswer: 'Blue',
    explanation: 'The Italian flag consists of three vertical stripes of equal dimensions, with green on the hoist side, white in the middle, and red on the outside.'
  },
  {
    id: '4',
    question: 'In what year did Italy become a unified nation?',
    options: ['1815', '1848', '1861', '1945'],
    correctAnswer: '1861',
    explanation: 'Italy was unified in 1861 under King Victor Emmanuel II, following the efforts of Giuseppe Garibaldi and Count Camillo di Cavour.'
  },
  {
    id: '5',
    question: 'What is the type of government in Italy?',
    options: ['Monarchy', 'Parliamentary Republic', 'Presidential Republic', 'Federal Republic'],
    correctAnswer: 'Parliamentary Republic',
    explanation: 'Italy is a parliamentary republic with a multi-party system and a president who serves as the head of state.'
  }
];

const CitizenshipTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer
    });
  };
  
  const navigateNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitTest();
    }
  };
  
  const navigatePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const submitTest = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowResults(true);
      setIsSubmitting(false);
      
      const score = calculateScore();
      const percentage = (score / mockQuestions.length) * 100;
      
      toast({
        title: `Test completed: ${score}/${mockQuestions.length}`,
        description: `You scored ${percentage.toFixed(0)}% on the citizenship test.`,
        variant: percentage >= 60 ? 'default' : 'destructive',
      });
    }, 1500);
  };
  
  const calculateScore = () => {
    return mockQuestions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.correctAnswer
        ? score + 1
        : score;
    }, 0);
  };
  
  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };
  
  if (showResults) {
    const score = calculateScore();
    const percentage = (score / mockQuestions.length) * 100;
    
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Test Results</CardTitle>
            <CardDescription>
              Your citizenship test score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2">
                {score}/{mockQuestions.length}
              </div>
              <div className="text-xl">
                {percentage.toFixed(0)}%
              </div>
              <div className="mt-4 text-xl">
                {percentage >= 60 ? (
                  <span className="text-green-600 dark:text-green-400">Passed!</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Failed</span>
                )}
              </div>
            </div>
            
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold">Question Review</h3>
              {mockQuestions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-1 ${selectedAnswers[question.id] === question.correctAnswer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {selectedAnswers[question.id] === question.correctAnswer ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="h-5 w-5 flex items-center justify-center font-bold">✗</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Question {index + 1}: {question.question}</h4>
                      <p className="text-sm mb-1">Your answer: {selectedAnswers[question.id] || "Not answered"}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Correct answer: {question.correctAnswer}</p>
                      <p className="text-sm text-muted-foreground mt-2">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetTest} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Italian Citizenship Test</CardTitle>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-4">{currentQuestion.question}</h3>
              <RadioGroup
                value={selectedAnswers[currentQuestion.id] || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="h-1 w-full bg-gray-200 rounded-full mt-6">
              <div
                className="h-1 bg-primary rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={navigatePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={navigateNext}
            disabled={!selectedAnswers[currentQuestion.id] || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : currentQuestionIndex < mockQuestions.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Submit Test"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CitizenshipTest;
