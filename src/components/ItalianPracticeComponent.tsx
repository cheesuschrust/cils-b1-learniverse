
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAI } from '@/hooks/useAI';

import { useToast } from '@/components/ui/use-toast';
import { Loader2, Book, Award } from 'lucide-react';

export type ItalianTestSection = 
  'grammar' | 
  'vocabulary' | 
  'culture' | 
  'listening' | 
  'reading' | 
  'writing' | 
  'speaking' | 
  'citizenship';

export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';

interface ItalianPracticeComponentProps {
  initialSection: ItalianTestSection;
  level: ItalianLevel;
  isCitizenshipMode?: boolean;
  onComplete?: (result: { score: number; section: ItalianTestSection }) => void;
  userId: string;
}

export const ItalianPracticeComponent: React.FC<ItalianPracticeComponentProps> = ({
  initialSection,
  level,
  isCitizenshipMode = false,
  onComplete,
  userId
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  const { generateQuestions, isProcessing } = useAI();
  const { toast } = useToast();
  
  // Placeholder for actual question generation/fetching logic
  React.useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        
        const result = await generateQuestions({
          contentTypes: [initialSection],
          topics: isCitizenshipMode ? ['citizenship', 'italian culture', 'government'] : [initialSection],
          difficulty: level,
          count: 5,
          isCitizenshipFocused: isCitizenshipMode
        });
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setQuestions(result.questions || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load questions. Please try again.",
          variant: "destructive"
        });
        
        // Use placeholder questions if real ones couldn't be loaded
        setQuestions([
          {
            id: '1',
            text: `Sample question 1 for ${initialSection} (${level})`,
            type: 'multiple-choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            explanation: 'This is the explanation for the correct answer.'
          },
          {
            id: '2',
            text: `Sample question 2 for ${initialSection} (${level})`,
            type: 'multiple-choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option B',
            explanation: 'This is the explanation for the correct answer.'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [initialSection, level, isCitizenshipMode]);
  
  const handleAnswer = (answer: any) => {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: answer
    });
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = (correctCount / questions.length) * 100;
    setScore(calculatedScore);
    
    if (onComplete) {
      onComplete({
        score: calculatedScore,
        section: initialSection
      });
    }
  };
  
  const resetPractice = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };
  
  if (isLoading || isProcessing) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading practice questions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Practice Results</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center space-y-6">
            <Award className="h-16 w-16 mx-auto text-primary" />
            
            <div>
              <h3 className="text-2xl font-bold">Your Score: {Math.round(score)}%</h3>
              <p className="text-muted-foreground mt-1">
                {score >= 70 
                  ? `Great job! You're doing well on this ${initialSection} section.`
                  : `Keep practicing this ${initialSection} section to improve your score.`
                }
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <h4 className="font-medium">Practice Summary</h4>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={index} className="text-left p-3 border rounded-md">
                    <p className="text-sm font-medium">{question.text}</p>
                    <div className="mt-1 text-sm flex justify-between">
                      <span>
                        Your answer: 
                        <span className={userAnswers[index] === question.correctAnswer 
                          ? "text-green-500 font-medium ml-1" 
                          : "text-red-500 font-medium ml-1"
                        }>
                          {userAnswers[index] || 'Not answered'}
                        </span>
                      </span>
                      {userAnswers[index] !== question.correctAnswer && (
                        <span className="text-green-500 font-medium">
                          Correct: {question.correctAnswer}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Button onClick={resetPractice} className="w-full">Practice Again</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentQuestion = questions[currentIndex];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <span className="capitalize">{initialSection}</span> Practice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
                <span className="text-sm font-medium capitalize">{level} level</span>
              </div>
              
              <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
            </div>
            
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option: string, optIndex: number) => (
                  <div 
                    key={optIndex}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      userAnswers[currentIndex] === option 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'open-ended' && (
              <div className="space-y-2">
                <textarea
                  className="w-full p-3 border rounded-md min-h-[100px]"
                  placeholder="Type your answer here..."
                  value={userAnswers[currentIndex] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              
              <Button onClick={handleNext}>
                {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p>No questions available. Try again later.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItalianPracticeComponent;
