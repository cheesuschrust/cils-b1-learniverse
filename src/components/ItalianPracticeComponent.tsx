
import React, { useState, useEffect } from 'react';
import { useItalianAI } from '../contexts/ItalianAIContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ItalianPracticeProps,
  AIGeneratedQuestion,
  QuestionGenerationParams
} from '../types/type-definitions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Check, X, Timer, Star, GraduationCap, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ItalianPracticeComponent({
  testSection,
  level,
  isCitizenshipMode,
  onComplete
}: ItalianPracticeProps) {
  const { generateQuestions, isGenerating } = useItalianAI();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Load questions when component mounts
    loadQuestions();
    // Start the timer
    setStartTime(Date.now());
    
    // Timer interval
    const intervalId = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [testSection, level, isCitizenshipMode]);

  const loadQuestions = async () => {
    if (!user) {
      setError('Please log in to practice');
      return;
    }
    
    const params: QuestionGenerationParams = {
      italianLevel: level,
      testSection: testSection,
      isCitizenshipFocused: isCitizenshipMode,
      count: 10 // 10 questions for a practice session
    };
    
    try {
      const result = await generateQuestions(params);
      
      if (result.error) {
        setError(result.error);
      } else {
        setQuestions(result.questions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setIsComplete(false);
        setStartTime(Date.now());
      }
    } catch (err) {
      setError('Error loading questions. Please try again.');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Practice session complete
      completeSession();
    }
  };

  const completeSession = async () => {
    setIsComplete(true);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const finalScore = (score / questions.length) * 100;
    
    // Save practice results to database
    try {
      if (user) {
        await fetch('/api/save-practice-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            sessionType: testSection,
            score: finalScore,
            questionsAnswered: questions.length,
            questionsCorrect: score,
            duration: totalTime,
            isCitizenshipFocused: isCitizenshipMode
          }),
        });
      }
    } catch (error) {
      console.error('Error saving practice session:', error);
    }
    
    // Call the completion callback
    if (onComplete) {
      onComplete({
        score: finalScore,
        time: totalTime
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p>{error}</p>
            <Button onClick={loadQuestions} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating || questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 w-48 bg-muted rounded mb-4" />
            <div className="h-4 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
          <p className="mt-6 text-muted-foreground">Caricamento domande...</p>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pratica Completata!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6">
            <div className="relative mb-6">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="hsl(var(--muted))" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="10"
                  strokeDasharray={`${Math.round((score / questions.length) * 100) * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{Math.round((score / questions.length) * 100)}%</span>
              </div>
            </div>
            
            <div className="results-summary space-y-2 w-full max-w-md">
              <div className="flex justify-between">
                <p>Domande corrette:</p>
                <p className="font-medium">{score} di {questions.length}</p>
              </div>
              <div className="flex justify-between">
                <p>Tempo:</p>
                <p className="font-medium">{formatTime(elapsedTime)}</p>
              </div>
              <Separator className="my-4" />
              
              <div className="py-2">
                {Math.round((score / questions.length) * 100) >= 70 ? (
                  <div className="flex items-center text-green-600">
                    <Check className="mr-2 h-5 w-5" />
                    <p>Ottimo lavoro! Hai superato questo test.</p>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <Star className="mr-2 h-5 w-5" />
                    <p>Continua a praticare per migliorare il tuo punteggio.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={loadQuestions} className="px-6">Nuova Sessione</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted p-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{testSection}</Badge>
            <Badge>{level}</Badge>
            {isCitizenshipMode && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                <span>Citizenship</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm flex items-center">
              <Timer className="h-4 w-4 mr-1" /> 
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>
        
        <Progress
          value={(currentQuestionIndex / questions.length) * 100}
          className="h-1 mt-4"
        />
        
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Score: {score}/{currentQuestionIndex}</span>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <div className="question-container">
          <p className="question-text text-lg font-medium mb-6">{currentQuestion.text}</p>
          
          {currentQuestion.options && (
            <ul className="answer-options space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <li
                  key={index}
                  className={cn(
                    "option-item p-3 rounded-md cursor-pointer border transition-colors flex items-center",
                    selectedAnswer === option ? "border-primary bg-primary/5" : "border-muted",
                    isAnswerSubmitted && option === currentQuestion.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "",
                    isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer 
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""
                  )}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className={cn(
                    "option-letter flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-3",
                    selectedAnswer === option 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground",
                    isAnswerSubmitted && option === currentQuestion.correctAnswer 
                      ? "bg-green-500 text-white" : "",
                    isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer 
                      ? "bg-red-500 text-white" : ""
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                  
                  {isAnswerSubmitted && option === currentQuestion.correctAnswer && (
                    <Check className="ml-auto h-5 w-5 text-green-500" />
                  )}
                  {isAnswerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                    <X className="ml-auto h-5 w-5 text-red-500" />
                  )}
                </li>
              ))}
            </ul>
          )}
          
          {isAnswerSubmitted && (
            <div className={cn(
              "feedback-container p-4 rounded-md mt-4",
              selectedAnswer === currentQuestion.correctAnswer 
                ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400" 
                : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
            )}>
              <p className="font-medium">
                {selectedAnswer === currentQuestion.correctAnswer 
                  ? 'Corretto! 🎉' 
                  : `Non corretto. La risposta corretta è: ${currentQuestion.correctAnswer}`
                }
              </p>
              {currentQuestion.explanation && (
                <p className="explanation mt-2 text-sm">{currentQuestion.explanation}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <Button 
          variant="outline" 
          disabled={currentQuestionIndex === 0 || isAnswerSubmitted}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
        >
          Precedente
        </Button>
        
        {!isAnswerSubmitted ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
          >
            Controlla Risposta
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Prossima Domanda' : 'Termina Pratica'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
