
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface DailyQuestionStatus {
  streak: number;
  hasCompletedToday: boolean;
  lastCompletionDate: string | null;
}

export function useDailyQuestion() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number>(0);
  const [hasCompletedToday, setHasCompletedToday] = useState<boolean>(false);
  const [lastCompletionDate, setLastCompletionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchDailyQuestionStatus();
  }, [user]);

  const fetchDailyQuestionStatus = async () => {
    try {
      setLoading(true);
      // Get the user metrics which contains the streak info
      const { data: userMetrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (metricsError && metricsError.code !== 'PGSQL_EMPTY_RESULT') {
        throw metricsError;
      }

      // Get the latest question attempt to determine if the user has completed today's question
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: attempts, error: attemptsError } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (attemptsError) {
        throw attemptsError;
      }

      // Set the streak
      const currentStreak = userMetrics?.streak || 0;
      setStreak(currentStreak);

      // Determine if the user has completed today's question
      const latestAttempt = attempts && attempts.length > 0 ? attempts[0] : null;
      const latestDate = latestAttempt 
        ? format(new Date(latestAttempt.created_at), 'yyyy-MM-dd') 
        : null;
      
      setLastCompletionDate(latestDate);
      setHasCompletedToday(latestDate === today);
    } catch (error) {
      console.error('Error fetching daily question status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark today's question as completed
  const completeToday = async () => {
    if (!user) return;

    try {
      // Update the user metrics to reflect the completion
      const { error: metricsError } = await supabase
        .from('user_metrics')
        .update({
          streak: streak + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (metricsError) {
        throw metricsError;
      }

      // Refetch the status
      fetchDailyQuestionStatus();
      return true;
    } catch (error) {
      console.error('Error completing daily question:', error);
      return false;
    }
  };

  return {
    streak,
    hasCompletedToday,
    lastCompletionDate,
    loading,
    completeToday,
    refetch: fetchDailyQuestionStatus
  };
}
