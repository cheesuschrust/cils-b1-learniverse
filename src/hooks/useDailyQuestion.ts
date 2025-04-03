
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DailyQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  category: string;
  difficulty: string;
  question_date: string;
  is_premium: boolean;
}

interface UseDailyQuestionReturn {
  todaysQuestion: DailyQuestion | null;
  isLoading: boolean;
  hasCompletedToday: boolean;
  submitAnswer: (answer: string) => Promise<boolean>;
  streak: number;
  resetQuestion: () => void;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string | null) => void;
}

export function useDailyQuestion(): UseDailyQuestionReturn {
  const [todaysQuestion, setTodaysQuestion] = useState<DailyQuestion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedToday, setHasCompletedToday] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Get today's date in YYYY-MM-DD format based on user's timezone
  const getTodayDateString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Fetch user's streak data
  const fetchUserStreak = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('streak_days')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setStreak(data.streak_days || 0);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  // Fetch today's question
  const fetchTodaysQuestion = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const today = getTodayDateString();
      
      // First check if user has already completed today's question
      const { data: attemptData, error: attemptError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_type', 'daily_question')
        .eq('created_at::date', today)
        .single();
      
      if (attemptError && attemptError.code !== 'PGSQL_EMPTY_RESULT') {
        throw attemptError;
      }
      
      if (attemptData) {
        setHasCompletedToday(true);
        setIsLoading(false);
        return;
      }
      
      // Fetch today's question
      const { data: questionData, error: questionError } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('question_date', today)
        .eq('is_premium', user.isPremiumUser ? true : false)
        .limit(1)
        .single();
      
      if (questionError) {
        // If no question is found for today, try to get a non-premium one as fallback
        if (questionError.code === 'PGSQL_EMPTY_RESULT') {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('daily_questions')
            .select('*')
            .eq('question_date', today)
            .eq('is_premium', false)
            .limit(1)
            .single();
          
          if (fallbackError) {
            throw fallbackError;
          }
          
          setTodaysQuestion(fallbackData);
        } else {
          throw questionError;
        }
      } else {
        setTodaysQuestion(questionData);
      }
    } catch (error) {
      console.error('Error fetching daily question:', error);
      toast({
        title: "Couldn't load today's question",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit answer to today's question
  const submitAnswer = async (answer: string): Promise<boolean> => {
    if (!user?.id || !todaysQuestion) return false;
    
    try {
      const isAnswerCorrect = answer === todaysQuestion.correct_answer;
      setIsCorrect(isAnswerCorrect);
      
      // Record user's answer
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          content_type: 'daily_question',
          content_id: todaysQuestion.id,
          score: isAnswerCorrect ? 100 : 0,
          completed: true,
          answers: { 
            selectedAnswer: answer,
            isCorrect: isAnswerCorrect
          }
        });
      
      if (error) throw error;
      
      // Update streak
      await updateStreak(isAnswerCorrect);
      
      setHasCompletedToday(true);
      
      return isAnswerCorrect;
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Failed to submit answer",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update user's streak
  const updateStreak = async (isCorrect: boolean) => {
    if (!user?.id) return;
    
    try {
      // This will trigger the database function to update streaks
      const { data, error } = await supabase
        .rpc('update_user_streak', { 
          user_id: user.id,
          is_correct: isCorrect 
        });
      
      if (error) throw error;
      
      if (data && typeof data === 'number') {
        setStreak(data);
        
        // If streak milestone, show celebration toast
        if (data > 0 && data % 5 === 0) {
          toast({
            title: `${data} Day Streak!`,
            description: "Keep up the great work with your daily practice!",
            variant: "default",
            className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
          });
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  // Reset question state for testing purposes
  const resetQuestion = () => {
    setHasCompletedToday(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    fetchTodaysQuestion();
  };

  useEffect(() => {
    fetchTodaysQuestion();
    fetchUserStreak();
  }, [user?.id]);

  return {
    todaysQuestion,
    isLoading,
    hasCompletedToday,
    submitAnswer,
    streak,
    resetQuestion,
    isCorrect,
    selectedAnswer,
    setSelectedAnswer
  };
}
