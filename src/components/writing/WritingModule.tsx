
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { Edit, CheckCircle2, HelpCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface WritingExercise {
  id: string;
  title: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  exampleAnswer?: string;
  hints: string[];
  difficulty: string;
  isPremium: boolean;
}

const WritingModule: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  
  const [exercises, setExercises] = useState<WritingExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [showExample, setShowExample] = useState(false);
  
  // Load exercises from database
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'writing')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data to match our interface
          const transformedExercises: WritingExercise[] = data.map(item => ({
            id: item.id,
            title: item.title,
            prompt: item.content.prompt || '',
            minWords: item.content.minWords || 30,
            maxWords: item.content.maxWords || 150,
            exampleAnswer: item.content.exampleAnswer,
            hints: item.content.hints || [],
            difficulty: item.difficulty || 'intermediate',
            isPremium: item.premium || false
          }));
          
          setExercises(transformedExercises);
        } else {
          // Load fallback exercise if no data available
          const fallbackExercise: WritingExercise = {
            id: 'fallback',
            title: 'Describing Your Daily Routine',
            prompt: 'Write a short text in Italian describing your typical daily routine. Include when you wake up, what you eat, your work or study activities, and how you spend your evenings.',
            minWords: 40,
            maxWords: 100,
            exampleAnswer: 'Mi sveglio alle sette ogni mattina. Faccio colazione con caffè e biscotti. Alle otto inizio a lavorare. Lavoro fino alle cinque. Dopo il lavoro, faccio una passeggiata nel parco. Ceno alle otto di sera. Dopo cena, guardo un po' di televisione o leggo un libro. Vado a dormire alle undici.',
            hints: [
              'Use present tense for routine activities',
              'Include time expressions like "alle sette" (at seven)',
              'Use reflexive verbs like "svegliarsi" (to wake up)',
              'Include meal times: "colazione" (breakfast), "pranzo" (lunch), "cena" (dinner)'
            ],
            difficulty: 'beginner',
            isPremium: false
          };
          
          setExercises([fallbackExercise]);
        }
      } catch (error) {
        console.error('Error fetching writing exercises:', error);
        toast({
          title: 'Error',
          description: 'Failed to load writing exercises. Please try again later.',
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
    setAnswer('');
    setWordCount(0);
    setIsSubmitted(false);
    setFeedback('');
    setScore(null);
    setShowExample(false);
  }, [currentExerciseIndex]);
  
  // Update word count when answer changes
  useEffect(() => {
    if (answer.trim() === '') {
      setWordCount(0);
      return;
    }
    
    const words = answer.trim().split(/\s+/);
    setWordCount(words.length);
  }, [answer]);
  
  const currentExercise = exercises[currentExerciseIndex];
  
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };
  
  const submitAnswer = async () => {
    if (answer.trim() === '') return;
    
    try {
      // Simulate AI analysis with random score
      // In a real app, you would send the text to a server for analysis
      const randomScore = Math.floor(Math.random() * 41) + 60; // 60-100
      setScore(randomScore);
      
      // Generate feedback based on score
      let feedbackText = '';
      if (randomScore >= 90) {
        feedbackText = 'Excellent work! Your writing demonstrates a strong command of Italian grammar and vocabulary. Keep up the good work!';
      } else if (randomScore >= 80) {
        feedbackText = 'Very good writing. You have a good grasp of Italian, with just a few minor errors. Keep practicing!';
      } else if (randomScore >= 70) {
        feedbackText = 'Good effort! Your meaning is clear, though there are some grammatical errors. Focus on verb conjugations and gender agreement.';
      } else {
        feedbackText = 'You\'re making progress! Try to use more varied vocabulary and pay attention to sentence structure. Keep practicing regular verbs.';
      }
      
      setFeedback(feedbackText);
      setIsSubmitted(true);
      
      // Track usage
      incrementUsage('writingExercises');
      
      // Update user stats in database
      updateUserStats(randomScore);
      
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to analyze your writing. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const updateUserStats = async (scoreValue: number) => {
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
            questions_answered: stats.questions_answered + 1,
            correct_answers: stats.correct_answers + (scoreValue >= 70 ? 1 : 0),
            writing_score: stats.writing_score 
              ? Math.round((stats.writing_score + scoreValue) / 2) 
              : scoreValue,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);
      } else {
        // Create new stats record
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            questions_answered: 1,
            correct_answers: scoreValue >= 70 ? 1 : 0,
            writing_score: scoreValue,
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
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading writing exercises...</p>
      </div>
    );
  }
  
  if (!currentExercise) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No exercises found</h3>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any writing exercises. Please try again later.
        </p>
      </div>
    );
  }
  
  if (hasReachedLimit('writingExercises')) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Daily Limit Reached</CardTitle>
          <CardDescription>
            You've reached your daily limit of {getLimit('writingExercises')} writing exercises.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-muted-foreground">
              You've completed {getUsage('writingExercises')}/{getLimit('writingExercises')} exercises today.
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
          <CardTitle>Feedback: {currentExercise.title}</CardTitle>
          <CardDescription>
            Your writing score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Score</span>
              <span>{score}%</span>
            </div>
            <Progress value={score || 0} className="h-2 mb-4" />
            
            <div className="p-4 rounded-lg border bg-muted mb-6">
              <p className="mb-2 font-medium">AI Feedback:</p>
              <p>{feedback}</p>
            </div>
            
            <div className="p-4 rounded-lg border">
              <p className="mb-2 font-medium">Your Answer:</p>
              <p className="whitespace-pre-wrap">{answer}</p>
            </div>
            
            {currentExercise.exampleAnswer && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowExample(!showExample)}
                  className="w-full"
                >
                  {showExample ? 'Hide Example Answer' : 'Show Example Answer'}
                </Button>
                
                {showExample && (
                  <div className="p-4 rounded-lg border mt-3 bg-green-50 dark:bg-green-950">
                    <p className="mb-2 font-medium">Example Answer:</p>
                    <p className="whitespace-pre-wrap">{currentExercise.exampleAnswer}</p>
                  </div>
                )}
              </div>
            )}
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
      <h1 className="text-3xl font-bold mb-6">Writing Practice</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2 text-green-500" />
            {currentExercise.title}
          </CardTitle>
          <CardDescription>
            Write in Italian to practice your skills. {currentExercise.isPremium && '(Premium Content)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Your Task:</h3>
            <p className="text-lg mb-4">{currentExercise.prompt}</p>
            <p className="text-sm text-muted-foreground">
              Write between {currentExercise.minWords} and {currentExercise.maxWords} words.
            </p>
          </div>
          
          {currentExercise.hints.length > 0 && (
            <div className="bg-muted p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-2">Helpful Tips:</h4>
              <ul className="space-y-1 list-disc pl-4">
                {currentExercise.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <Textarea
              placeholder="Write your answer in Italian..."
              value={answer}
              onChange={handleAnswerChange}
              rows={8}
              className="resize-none"
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm">
                Word count: {wordCount}
              </span>
              <span className={`text-sm ${
                wordCount < currentExercise.minWords
                  ? 'text-red-500'
                  : wordCount > currentExercise.maxWords
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}>
                {wordCount < currentExercise.minWords
                  ? `Need ${currentExercise.minWords - wordCount} more words`
                  : wordCount > currentExercise.maxWords
                  ? `${wordCount - currentExercise.maxWords} words over limit`
                  : 'Within word limit'}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            onClick={nextExercise}
          >
            Skip Exercise
          </Button>
          
          <Button
            onClick={submitAnswer}
            disabled={wordCount < currentExercise.minWords || answer.trim() === ''}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Submit for Feedback
          </Button>
        </CardFooter>
      </Card>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-start">
          <Sparkles className="h-5 w-5 text-yellow-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium mb-1">Writing Practice Tips</h3>
            <p className="text-sm text-muted-foreground">
              Try to use vocabulary and grammar you've already learned. Start with simple sentences and gradually make them more complex. 
              Don't rely too much on translation tools - try to compose directly in Italian.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingModule;
