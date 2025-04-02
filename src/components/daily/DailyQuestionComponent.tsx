
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight, HelpCircle, Timer, BookOpen, MessageSquare, Headphones, Edit } from 'lucide-react';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { useAI } from '@/hooks/useAI';
import { ItalianTestSection, AIGeneratedQuestion } from '@/types/core-types';

interface DailyQuestionComponentProps {
  userId?: string;
  onQuestionCompleted?: (result: { score: number; category: string; correct: boolean }) => void;
  alwaysShow?: boolean;
}

const DailyQuestionComponent: React.FC<DailyQuestionComponentProps> = ({
  userId,
  onQuestionCompleted,
  alwaysShow = false
}) => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState<ItalianTestSection | null>(null);
  const [categoryConfidence, setCategoryConfidence] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<AIGeneratedQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasCompletedToday, setHasCompletedToday] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { toast } = useToast();
  const { generateQuestions, isGenerating, remainingCredits } = useAI();
  
  // Check if the user has already completed today's question
  useEffect(() => {
    const checkDailyCompletion = async () => {
      try {
        // In a real app, you would check against a database
        // For now, we'll check localStorage
        const lastCompletedDate = localStorage.getItem(`dailyQuestion_${userId}`);
        const today = new Date().toISOString().split('T')[0];
        
        if (lastCompletedDate === today && !alwaysShow) {
          setHasCompletedToday(true);
        }
      } catch (error) {
        console.error('Error checking daily completion:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDailyCompletion();
  }, [userId, alwaysShow]);
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerRunning) {
      handleTimeUp();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeRemaining, isTimerRunning]);
  
  // Function to handle time up
  const handleTimeUp = () => {
    setIsTimerRunning(false);
    setIsAnswerSubmitted(true);
    setIsCorrect(false);
    toast({
      title: "Time's up!",
      description: "You ran out of time to answer the question.",
      variant: "destructive"
    });
  };
  
  // Generate a question for the selected category
  const generateQuestionForCategory = async (category: ItalianTestSection) => {
    setIsLoading(true);
    try {
      const result = await generateQuestions({
        contentTypes: [category],
        difficulty: 'intermediate',
        count: 1,
        isCitizenshipFocused: true
      });
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
        return;
      }
      
      if (result.questions && result.questions.length > 0) {
        setCurrentQuestion(result.questions[0]);
        
        // Set a confidence level based on the category
        // In a real app, this would come from the AI system
        const confidenceLevels: Record<string, number> = {
          'grammar': 92,
          'vocabulary': 85,
          'culture': 78,
          'listening': 82,
          'reading': 88,
          'writing': 75,
          'speaking': 70,
          'citizenship': 95
        };
        
        setCategoryConfidence(confidenceLevels[category] || 80);
        setTimeRemaining(30);
        setIsTimerRunning(true);
        setSelectedAnswer('');
        setIsAnswerSubmitted(false);
        setIsCorrect(null);
        setShowExplanation(false);
      } else {
        toast({
          title: "No Questions Available",
          description: "Could not generate a question for this category.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle category selection
  const handleCategorySelect = (category: ItalianTestSection) => {
    setSelectedCategory(category);
    generateQuestionForCategory(category);
  };
  
  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedAnswer) return;
    
    setIsAnswerSubmitted(true);
    setIsTimerRunning(false);
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Save completion status
    if (userId) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`dailyQuestion_${userId}`, today);
      setHasCompletedToday(true);
    }
    
    // Call the callback if provided
    if (onQuestionCompleted) {
      onQuestionCompleted({
        score: correct ? 100 : 0,
        category: selectedCategory || 'general',
        correct
      });
    }
    
    toast({
      title: correct ? "Correct!" : "Incorrect",
      description: correct 
        ? "Great job! You answered correctly." 
        : `The correct answer was: ${currentQuestion.correctAnswer}`,
      variant: correct ? "default" : "destructive"
    });
  };
  
  // Try another question
  const handleTryAnother = () => {
    if (selectedCategory) {
      generateQuestionForCategory(selectedCategory);
    }
  };
  
  // Category selection cards
  const categoryCards = [
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      description: 'Test your Italian vocabulary knowledge',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: 'grammar',
      title: 'Grammar',
      description: 'Practice Italian grammar rules',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 'listening',
      title: 'Listening',
      description: 'Improve your Italian listening skills',
      icon: <Headphones className="h-5 w-5" />
    },
    {
      id: 'writing',
      title: 'Writing',
      description: 'Enhance your Italian writing abilities',
      icon: <Edit className="h-5 w-5" />
    }
  ];
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading daily question...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Already completed state
  if (hasCompletedToday && !alwaysShow) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Daily Question Completed</CardTitle>
          <CardDescription>
            You've already completed today's question. Come back tomorrow for a new one!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center text-muted-foreground">
                Remember to practice regularly to improve your Italian skills!
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setHasCompletedToday(false)}>
            View Past Questions
          </Button>
          {remainingCredits > 0 && (
            <Button onClick={() => setHasCompletedToday(false)}>
              Try Another Question
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  // Category selection state
  if (!selectedCategory) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Italian Question of the Day</CardTitle>
          <CardDescription>
            Select a category for today's question to improve your Italian citizenship exam preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryCards.map(category => (
              <div
                key={category.id}
                className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleCategorySelect(category.id as ItalianTestSection)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <p>You have {remainingCredits} questions remaining today</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Question display state
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Daily Italian Question</CardTitle>
            <CardDescription>
              Test your knowledge in {selectedCategory}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="capitalize mr-2">
              {selectedCategory}
            </Badge>
            <ConfidenceIndicator score={categoryConfidence} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mr-2"></div>
            <p>Generating question...</p>
          </div>
        ) : currentQuestion ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Time remaining: {timeRemaining}s
                </span>
              </div>
              <Progress value={(timeRemaining / 30) * 100} className="w-24 h-2" />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.text || currentQuestion.question}</h3>
              
              <RadioGroup 
                value={selectedAnswer} 
                onValueChange={setSelectedAnswer}
                disabled={isAnswerSubmitted}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 border rounded-md p-3 ${
                      isAnswerSubmitted && option === currentQuestion.correctAnswer
                        ? 'bg-green-50 border-green-200'
                        : isAnswerSubmitted && option === selectedAnswer && option !== currentQuestion.correctAnswer
                        ? 'bg-red-50 border-red-200'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} disabled={isAnswerSubmitted} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {isAnswerSubmitted && currentQuestion.explanation && (
              <div className={`mt-4 rounded-md p-4 ${showExplanation ? 'bg-muted' : ''}`}>
                {showExplanation ? (
                  <div className="space-y-2">
                    <h4 className="font-medium">Explanation</h4>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowExplanation(true)}
                    className="w-full flex items-center justify-center"
                  >
                    <span>Show Explanation</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No question available. Please try another category.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setSelectedCategory(null)}
          disabled={isGenerating}
        >
          Back to Categories
        </Button>
        
        {isAnswerSubmitted ? (
          <Button onClick={handleTryAnother}>
            Try Another Question
          </Button>
        ) : (
          <Button 
            onClick={handleSubmitAnswer} 
            disabled={!selectedAnswer || isAnswerSubmitted || isGenerating}
          >
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DailyQuestionComponent;
