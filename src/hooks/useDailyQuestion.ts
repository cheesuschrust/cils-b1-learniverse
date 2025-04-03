import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { format, isAfter, isSameDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface DailyQuestion {
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

export const useDailyQuestion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [todaysQuestion, setTodaysQuestion] = useState<DailyQuestion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedToday, setHasCompletedToday] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [lastCompletionDate, setLastCompletionDate] = useState<Date | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('UTC');

  // Get user's timezone
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(timezone || 'UTC');
    } catch (e) {
      console.error('Error detecting timezone:', e);
      setUserTimezone('UTC');
    }
  }, []);

  // Function to fetch today's question
  const fetchTodaysQuestion = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get today's date in the user's timezone
      const now = new Date();
      const today = format(utcToZonedTime(now, userTimezone), 'yyyy-MM-dd');

      // Fetch today's question from the database
      const { data: questionData, error: questionError } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('question_date', today)
        .single();

      if (questionError && questionError.code !== 'PGRST116') {
        throw questionError;
      }

      // If user is logged in, check if they have already completed today's question
      if (user) {
        const { data: userStatsData, error: userStatsError } = await supabase
          .from('user_stats')
          .select('streak_days, last_activity_date')
          .eq('user_id', user.id)
          .single();

        if (userStatsError && userStatsError.code !== 'PGRST116') {
          throw userStatsError;
        }

        if (userStatsData) {
          setStreak(userStatsData.streak_days || 0);
          
          if (userStatsData.last_activity_date) {
            const lastActivityDate = new Date(userStatsData.last_activity_date);
            setLastCompletionDate(lastActivityDate);
            
            // Check if the user has completed today's question
            setHasCompletedToday(isSameDay(
              utcToZonedTime(lastActivityDate, userTimezone),
              utcToZonedTime(now, userTimezone)
            ));
          }
        }

        // If there's a today's question, check if the user has already answered it
        if (questionData) {
          const { data: userAnswersData, error: userAnswersError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('content_id', questionData.id)
            .single();

          if (userAnswersError && userAnswersError.code !== 'PGRST116') {
            throw userAnswersError;
          }

          if (userAnswersData) {
            setHasCompletedToday(true);
            setIsCorrect(userAnswersData.score === 100);
            setSelectedAnswer(userAnswersData.answers?.selected || null);
          }
        }
      }

      // Set today's question
      setTodaysQuestion(questionData || null);
    } catch (error) {
      console.error('Error fetching daily question:', error);
      toast({
        title: 'Error',
        description: 'Failed to load today\'s question. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, userTimezone]);

  // Load the question on component mount and when user or timezone changes
  useEffect(() => {
    fetchTodaysQuestion();
  }, [fetchTodaysQuestion]);

  // Submit the user's answer to the daily question
  const submitAnswer = async (answer: string): Promise<boolean> => {
    if (!user || !todaysQuestion) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit an answer.',
        variant: 'destructive',
      });
      return false;
    }

    setSelectedAnswer(answer);
    const isAnswerCorrect = answer === todaysQuestion.correct_answer;
    setIsCorrect(isAnswerCorrect);

    try {
      // Save user's answer
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          content_id: todaysQuestion.id,
          score: isAnswerCorrect ? 100 : 0,
          completed: true,
          answers: { selected: answer, isCorrect: isAnswerCorrect },
          last_activity: new Date().toISOString(),
          time_spent: 60, // Assuming 1 minute spent on the question
        });

      if (progressError) throw progressError;

      // Update user stats
      const today = new Date();
      const { data: userStatsData, error: statsGetError } = await supabase
        .from('user_stats')
        .select('streak_days, last_activity_date')
        .eq('user_id', user.id)
        .single();

      if (statsGetError && statsGetError.code !== 'PGRST116') throw statsGetError;

      // Calculate the new streak value
      let newStreak = 1;
      let streakIncreased = false;

      if (userStatsData) {
        const lastActivityDate = userStatsData.last_activity_date 
          ? new Date(userStatsData.last_activity_date) 
          : null;
        
        // If last activity was yesterday, increment streak
        if (lastActivityDate) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (isSameDay(lastActivityDate, yesterday)) {
            newStreak = (userStatsData.streak_days || 0) + 1;
            streakIncreased = true;
          } 
          // If last activity was today, maintain streak
          else if (isSameDay(lastActivityDate, today)) {
            newStreak = userStatsData.streak_days || 1;
          }
          // Otherwise reset streak to 1
          else {
            newStreak = 1;
          }
        }
      }

      // Update user stats in database
      const { error: statsUpdateError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          streak_days: newStreak,
          questions_answered: userStatsData?.questions_answered 
            ? userStatsData.questions_answered + 1 
            : 1,
          correct_answers: userStatsData?.correct_answers 
            ? (isAnswerCorrect ? userStatsData.correct_answers + 1 : userStatsData.correct_answers)
            : (isAnswerCorrect ? 1 : 0),
          last_activity_date: today.toISOString(),
        });

      if (statsUpdateError) throw statsUpdateError;

      // Update local streak state
      setStreak(newStreak);
      setHasCompletedToday(true);
      setLastCompletionDate(today);

      // Show success notification
      toast({
        title: isAnswerCorrect ? 'Correct!' : 'Incorrect',
        description: isAnswerCorrect 
          ? 'Great job! You got the correct answer.' 
          : `The correct answer was: ${todaysQuestion.correct_answer}`,
        variant: isAnswerCorrect ? 'default' : 'destructive',
      });

      // Show streak increase notification if streak increased
      if (streakIncreased && newStreak > 1) {
        toast({
          title: 'Streak Updated!',
          description: `You've maintained a ${newStreak}-day streak. Keep it up!`,
          variant: 'default',
        });
      }

      return isAnswerCorrect;
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your answer. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Reset the daily question (premium feature)
  const resetQuestion = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to reset the question.',
        variant: 'destructive',
      });
      return;
    }

    const isPremium = user.isPremiumUser;
    
    if (!isPremium) {
      toast({
        title: 'Premium Feature',
        description: 'Reset daily question is only available for premium users.',
        variant: 'destructive',
      });
      return;
    }

    if (!todaysQuestion) {
      toast({
        title: 'Error',
        description: 'No question available to reset.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Delete the user's progress for today's question
      const { error: deleteError } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', todaysQuestion.id);

      if (deleteError) throw deleteError;

      // Reset the states
      setHasCompletedToday(false);
      setIsCorrect(null);
      setSelectedAnswer(null);

      toast({
        title: 'Question Reset',
        description: 'Today\'s question has been reset. You can try again!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error resetting question:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset the question. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    todaysQuestion,
    isLoading,
    hasCompletedToday,
    streak,
    lastCompletionDate,
    isCorrect,
    selectedAnswer,
    setSelectedAnswer,
    submitAnswer,
    resetQuestion,
    refreshQuestion: fetchTodaysQuestion,
  };
};

export default useDailyQuestion;
