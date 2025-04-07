
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { BookOpen, CheckCircle2, XCircle, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface ReadingExercise {
  id: string;
  title: string;
  text: string;
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    correctAnswer: string;
  }>;
  difficulty: string;
  isPremium: boolean;
}

const ReadingModule: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  
  const [exercises, setExercises] = useState<ReadingExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  // Load exercises from database
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'reading')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data to match our interface
          const transformedExercises: ReadingExercise[] = data.map(item => ({
            id: item.id,
            title: item.title,
            text: item.content.text || '',
            questions: item.content.questions || [],
            difficulty: item.difficulty || 'intermediate',
            isPremium: item.premium || false
          }));
          
          setExercises(transformedExercises);
        } else {
          // Load fallback exercise if no data available
          const fallbackExercise: ReadingExercise = {
            id: 'fallback',
            title: 'La Vita in Italia',
            text: `L'Italia è conosciuta in tutto il mondo per la sua ricca cultura, la sua storia millenaria e la sua eccellente cucina. Ogni anno, milioni di turisti visitano le città italiane come Roma, Firenze, Venezia e Milano per ammirare l'arte, l'architettura e assaporare la cucina locale.

La vita quotidiana in Italia è caratterizzata da un ritmo rilassato. Gli italiani danno grande importanza alla famiglia e alle relazioni sociali. Il pranzo e la cena sono momenti importanti della giornata, durante i quali le famiglie si riuniscono per mangiare insieme e parlare.

Nelle città italiane, è comune vedere persone che passeggiano nelle piazze o si siedono ai caffè all'aperto, specialmente durante la sera. Questa abitudine si chiama "passeggiata" ed è un modo per socializzare e godersi la bellezza delle città italiane.

L'Italia è anche famosa per il suo patrimonio culturale. Il paese ospita 55 siti del patrimonio mondiale dell'UNESCO, più di qualsiasi altro paese al mondo. Dai monumenti antichi di Roma ai canali di Venezia, l'Italia offre un'incredibile varietà di attrazioni culturali.`,
            questions: [
              {
                id: 'q1',
                question: 'Perché i turisti visitano l'Italia?',
                options: [
                  { id: 'a', text: 'Solo per la cucina' },
                  { id: 'b', text: 'Per l'arte, l'architettura e la cucina' },
                  { id: 'c', text: 'Solo per l'architettura' },
                  { id: 'd', text: 'Per il clima caldo' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'q2',
                question: 'Cosa è importante nella vita quotidiana degli italiani?',
                options: [
                  { id: 'a', text: 'Solo il lavoro' },
                  { id: 'b', text: 'Lo sport' },
                  { id: 'c', text: 'La famiglia e le relazioni sociali' },
                  { id: 'd', text: 'La tecnologia' }
                ],
                correctAnswer: 'c'
              },
              {
                id: 'q3',
                question: 'Cos'è la "passeggiata"?',
                options: [
                  { id: 'a', text: 'Un tipo di cibo italiano' },
                  { id: 'b', text: 'Una danza tradizionale' },
                  { id: 'c', text: 'Una festa annuale' },
                  { id: 'd', text: 'L'abitudine di passeggiare nelle piazze o sedersi ai caffè' }
                ],
                correctAnswer: 'd'
              },
              {
                id: 'q4',
                question: 'Quanti siti del patrimonio mondiale dell'UNESCO ha l'Italia?',
                options: [
                  { id: 'a', text: '30' },
                  { id: 'b', text: '40' },
                  { id: 'c', text: '55' },
                  { id: 'd', text: '70' }
                ],
                correctAnswer: 'c'
              }
            ],
            difficulty: 'beginner',
            isPremium: false
          };
          
          setExercises([fallbackExercise]);
        }
      } catch (error) {
        console.error('Error fetching reading exercises:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reading exercises. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExercises();
  }, [toast]);
  
  // Reset state when changing exercises
  useEffect(() => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore({ correct: 0, total: 0 });
  }, [currentExerciseIndex]);
  
  const currentExercise = exercises[currentExerciseIndex];
  
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const handleSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    currentExercise.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore({
      correct: correctAnswers,
      total: currentExercise.questions.length
    });
    
    setIsSubmitted(true);
    
    // Track usage
    incrementUsage('readingExercises');
    
    // Update user stats in database
    updateUserStats(correctAnswers, currentExercise.questions.length);
  };
  
  const updateUserStats = async (correct: number, total: number) => {
    if (!user) return;
    
    try {
      // Update user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
        return;
      }
      
      if (stats) {
        // Update existing stats
        await supabase
          .from('user_stats')
          .update({
            questions_answered: stats.questions_answered + total,
            correct_answers: stats.correct_answers + correct,
            reading_score: stats.reading_score 
              ? Math.round((stats.reading_score + (correct / total * 100)) / 2) 
              : Math.round(correct / total * 100),
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);
      } else {
        // Create new stats record
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            questions_answered: total,
            correct_answers: correct,
            reading_score: Math.round(correct / total * 100),
            last_activity_date: new Date().toISOString().split('T')[0]
          });
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };
  
  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Cycle back to first exercise
      setCurrentExerciseIndex(0);
    }
  };
  
  const allAnswered = currentExercise?.questions.every(q => selectedAnswers[q.id]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading reading exercises...</p>
      </div>
    );
  }
  
  if (!currentExercise) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No exercises found</h3>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any reading exercises. Please try again later.
        </p>
      </div>
    );
  }
  
  if (hasReachedLimit('readingExercises')) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Daily Limit Reached</CardTitle>
          <CardDescription>
            You've reached your daily limit of {getLimit('readingExercises')} reading exercises.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-muted-foreground">
              You've completed {getUsage('readingExercises')}/{getLimit('readingExercises')} exercises today.
            </p>
            <p className="text-muted-foreground mt-2">
              Come back tomorrow for more exercises, or upgrade to Premium for unlimited access.
            </p>
          </div>
          <Button>Upgrade to Premium</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Results: {currentExercise.title}</CardTitle>
          <CardDescription>
            You scored {score.correct} out of {score.total}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Score</span>
              <span>{Math.round((score.correct / score.total) * 100)}%</span>
            </div>
            <Progress value={(score.correct / score.total) * 100} />
          </div>
          
          <div className="space-y-4">
            {currentExercise.questions.map((question, index) => {
              const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 
                    'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium mb-2">Question {index + 1}: {question.question}</p>
                      <p className="text-sm mb-1">Your answer: {
                        question.options.find(o => o.id === selectedAnswers[question.id])?.text || 'Not answered'
                      }</p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Correct answer: {
                            question.options.find(o => o.id === question.correctAnswer)?.text
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={nextExercise}>
            Next Exercise
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reading Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                {currentExercise.title}
              </CardTitle>
              <CardDescription>
                Read the text and answer the questions. {currentExercise.isPremium && '(Premium Content)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {currentExercise.text.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Answer all {currentExercise.questions.length} questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentExercise.questions.map((question, index) => (
                  <div key={question.id}>
                    <h3 className="text-base font-medium mb-3">
                      {index + 1}. {question.question}
                    </h3>
                    
                    <RadioGroup
                      value={selectedAnswers[question.id] || ''}
                      onValueChange={(value) => handleAnswerSelect(question.id, value)}
                      className="space-y-2"
                    >
                      {question.options.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`q${index}-option-${option.id}`} />
                          <Label htmlFor={`q${index}-option-${option.id}`} className="flex-1 cursor-pointer py-1">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="w-full"
              >
                {allAnswered ? 'Submit Answers' : `Answer all questions (${currentExercise.questions.filter(q => selectedAnswers[q.id]).length}/${currentExercise.questions.length})`}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReadingModule;
