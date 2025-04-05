import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge-fixed';
import { Check, Clock, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { useToast } from '@/components/ui/use-toast';
import { Clock, CheckCircle, XCircle, RefreshCw, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { format } from 'date-fns';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'reading' | 'culture' | 'citizenship';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

interface DailyQuestionProps {
  userId?: string;
  onComplete?: () => void;
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ userId, onComplete }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nextAvailable, setNextAvailable] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  const { addXP, updateStreak } = useGamificationContext();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      text: 'Qual è la capitale d\'Italia?',
      options: ['Milano', 'Roma', 'Napoli', 'Venezia'],
      correctAnswerIndex: 1,
      explanation: 'Roma è la capitale d\'Italia dal 1871.',
      type: 'culture',
      difficulty: 'easy',
      category: 'geography',
      points: 10
    },
    {
      id: 'q2',
      text: 'Quale di queste parole è un "verbo"?',
      options: ['Casa', 'Mangiare', 'Bella', 'Tre'],
      correctAnswerIndex: 1,
      explanation: '"Mangiare" è un verbo, le altre sono un sostantivo, un aggettivo e un numero.',
      type: 'grammar',
      difficulty: 'easy',
      category: 'parts of speech',
      points: 10
    },
    {
      id: 'q3',
      text: 'Quante regioni ci sono in Italia?',
      options: ['15', '20', '25', '30'],
      correctAnswerIndex: 1,
      explanation: 'L\'Italia è divisa in 20 regioni amministrative.',
      type: 'citizenship',
      difficulty: 'medium',
      category: 'government',
      points: 15
    }
  ];
  
  useEffect(() => {
    const loadDailyQuestion = async () => {
      setLoading(true);
      try {
        const lastAnsweredStr = localStorage.getItem(`lastAnswered_${userId || 'guest'}`);
        
        if (lastAnsweredStr) {
          const lastAnswered = new Date(lastAnsweredStr);
          const today = new Date();
          
          if (lastAnswered.toDateString() === today.toDateString()) {
            setAnswered(true);
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            setNextAvailable(tomorrow);
            
            const savedResult = localStorage.getItem(`lastResult_${userId || 'guest'}`);
            if (savedResult) {
              setCorrect(savedResult === 'correct');
            }
          }
        }
        
        const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
        setQuestion(sampleQuestions[randomIndex]);
      } catch (error) {
        console.error('Error loading daily question:', error);
        toast({
          title: 'Error',
          description: 'Failed to load daily question. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDailyQuestion();
  }, [userId, toast]);
  
  useEffect(() => {
    if (!nextAvailable) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const diffMs = nextAvailable.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeRemaining('');
        setAnswered(false);
        setNextAvailable(null);
        return;
      }
      
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeRemaining(
        `${diffHrs}:${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`
      );
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [nextAvailable]);
  
  const handleSubmit = () => {
    if (selectedOption === null || !question) return;
    
    const isCorrect = selectedOption === question.correctAnswerIndex;
    setCorrect(isCorrect);
    setAnswered(true);
    
    localStorage.setItem(`lastAnswered_${userId || 'guest'}`, new Date().toISOString());
    localStorage.setItem(`lastResult_${userId || 'guest'}`, isCorrect ? 'correct' : 'incorrect');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setNextAvailable(tomorrow);
    
    if (isCorrect) {
      addXP(question.points, 'daily question');
      updateStreak(true);
      toast({
        title: 'Correct!',
        description: `You've earned ${question.points} XP.`,
      });
      addNotification({
        title: "Daily Question Completed",
        message: `You correctly answered today's question and earned ${question.points} XP!`,
        type: "achievement",
        priority: "medium"
      });
    } else {
      updateStreak(true);
      toast({
        title: 'Not quite right',
        description: 'Keep practicing! You still get streak credit for participating.',
      });
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  if (answered) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daily Question</span>
            <span className="text-sm font-normal text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d')}
            </span>
          </CardTitle>
          <CardDescription>
            You've already completed today's question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className={correct ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900" : "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900"}>
            <div className="flex items-center gap-2">
              {correct ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              )}
              <AlertTitle>
                {correct ? 'Correct!' : 'Not quite right'}
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {question?.explanation}
            </AlertDescription>
          </Alert>
          
          {nextAvailable && (
            <div className="mt-6 text-center">
              <h3 className="flex items-center justify-center text-sm font-medium text-muted-foreground gap-1">
                <Clock className="h-4 w-4" />
                Next question available in:
              </h3>
              <div className="text-2xl font-bold mt-1">
                {timeRemaining}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={!nextAvailable || timeRemaining !== ''}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            New Question
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (loading || !question) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Daily Question</CardTitle>
          <CardDescription>Loading your daily Italian question...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Daily Italian Question</CardTitle>
          <div className="flex items-center gap-1 text-sm">
            <Award className="h-4 w-4 text-amber-500" />
            <span>{question.points} XP</span>
          </div>
        </div>
        <CardDescription className="flex justify-between items-center">
          <span>Test your Italian knowledge</span>
          <Badge variant="outline" className="capitalize">
            {question.type}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">{question.text}</h3>
            <RadioGroup value={selectedOption?.toString()} onValueChange={(value) => setSelectedOption(parseInt(value))}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer w-full">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => {
            setSelectedOption(null);
          }}
        >
          Skip
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={selectedOption === null}
        >
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyQuestion;
