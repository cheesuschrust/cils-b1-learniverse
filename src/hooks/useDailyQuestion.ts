import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { format, isAfter, isSameDay, parseISO, subDays } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useGamificationContext } from '@/contexts/GamificationContext';

interface DailyQuestionStatus {
  streak: number;
  hasCompletedToday: boolean;
  lastCompletionDate: string | null;
}

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

export function useDailyQuestion() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { showAchievementUnlock } = useGamificationContext();
  
  const [streak, setStreak] = useState<number>(0);
  const [hasCompletedToday, setHasCompletedToday] = useState<boolean>(false);
  const [lastCompletionDate, setLastCompletionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [todaysQuestion, setTodaysQuestion] = useState<DailyQuestion | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [userTimeZone, setUserTimeZone] = useState<string>('UTC');
  const [recentCategories, setRecentCategories] = useState<Record<string, number>>({});

  // On component mount, determine the user's timezone
  useEffect(() => {
    try {
      const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimeZone(detectedTimeZone || 'UTC');
    } catch (e) {
      console.error('Error detecting timezone, defaulting to UTC:', e);
      setUserTimeZone('UTC');
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchDailyQuestionStatus();
  }, [user, userTimeZone]);

  // Fetch user's daily question status and today's question
  const fetchDailyQuestionStatus = async () => {
    try {
      setLoading(true);
      
      // Get today's date in user's timezone
      const nowInUserTZ = utcToZonedTime(new Date(), userTimeZone);
      const todayStr = format(nowInUserTZ, 'yyyy-MM-dd');
      
      // Get the user metrics which contains the streak info
      const { data: userMetrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (metricsError && metricsError.code !== 'PGSQL_EMPTY_RESULT') {
        throw metricsError;
      }

      // Get question history to avoid repetition
      const { data: historyData, error: historyError } = await supabase
        .from('question_attempts')
        .select('question_id, created_at, category')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);
        
      if (historyError) {
        console.error('Error fetching question history:', historyError);
      } else if (historyData) {
        // Track recent question categories for balancing
        const categories: Record<string, number> = {};
        const questionIds = historyData.map(item => {
          if (item.category) {
            categories[item.category] = (categories[item.category] || 0) + 1;
          }
          return item.question_id;
        });
        
        setQuestionHistory(questionIds);
        setRecentCategories(categories);
      }
      
      // Get the latest question attempt to determine if the user has completed today's question
      const { data: attempts, error: attemptsError } = await supabase
        .from('question_attempts')
        .select('*, question:question_id(*)')
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
        ? format(utcToZonedTime(new Date(latestAttempt.created_at), userTimeZone), 'yyyy-MM-dd') 
        : null;
      
      setLastCompletionDate(latestDate);
      const completedToday = latestDate === todayStr;
      setHasCompletedToday(completedToday);

      // If the user has completed today's question, set the question and result
      if (completedToday && latestAttempt) {
        setTodaysQuestion(latestAttempt.question);
        setIsCorrect(latestAttempt.is_correct);
        setSelectedAnswer(latestAttempt.selected_answer);
      } else {
        // If not completed, fetch a new question for today
        await fetchTodaysQuestion();
      }
    } catch (error) {
      console.error('Error fetching daily question status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a new question for today based on user's progress and question history
  const fetchTodaysQuestion = async () => {
    try {
      // Get user's progress stats to determine appropriate difficulty
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      // If we can't get user stats, default to intermediate difficulty
      let targetDifficulty = 'intermediate';
      
      if (!statsError && userStats) {
        const averageScore = Object.entries({
          listening_score: userStats.listening_score,
          reading_score: userStats.reading_score,
          writing_score: userStats.writing_score,
          speaking_score: userStats.speaking_score,
        }).reduce((sum, [_, score]) => sum + (score || 0), 0) / 4;
        
        // Adjust difficulty based on user's average score
        if (averageScore >= 80) targetDifficulty = 'advanced';
        else if (averageScore < 50) targetDifficulty = 'beginner';
      }
      
      // Determine which categories to prioritize (those with lower scores or less frequency)
      let targetCategories: string[] = [];
      
      if (!statsError && userStats) {
        const categoryScores = {
          listening: userStats.listening_score || 50,
          reading: userStats.reading_score || 50,
          writing: userStats.writing_score || 50, 
          speaking: userStats.speaking_score || 50,
          grammar: 50, // Default if no specific score
          vocabulary: 50, // Default if no specific score
          culture: 50, // Default if no specific score
          citizenship: 50 // Default if no specific score
        };
        
        // Sort categories by lowest score first
        targetCategories = Object.entries(categoryScores)
          .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
          .map(([category]) => category);
      }
      
      // Get today's date in user's timezone
      const nowInUserTZ = utcToZonedTime(new Date(), userTimeZone);
      const todayStr = format(nowInUserTZ, 'yyyy-MM-dd');
      
      // First check if there's a daily question specifically assigned to today
      const { data: dailyQuestion, error: dailyError } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('question_date', todayStr)
        .single();
      
      if (!dailyError && dailyQuestion) {
        setTodaysQuestion(dailyQuestion);
        return;
      }
      
      // If no specific daily question for today, select based on user profile
      let query = supabase
        .from('daily_questions')
        .select('*');
      
      // Free users can only access non-premium questions
      if (user && !user.isPremiumUser) {
        query = query.eq('is_premium', false);
      }
      
      // Avoid questions the user has already seen
      if (questionHistory.length > 0) {
        query = query.not('id', 'in', `(${questionHistory.join(',')})`);
      }
      
      // Try to match the target difficulty
      query = query.eq('difficulty', targetDifficulty);
      
      // Try to get a question from a prioritized category
      let question = null;
      
      // Try each target category in order of priority
      for (const category of targetCategories) {
        const { data, error } = await query
          .eq('category', category)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!error && data) {
          question = data;
          break;
        }
      }
      
      // If no question found with target difficulty and category, relax constraints
      if (!question) {
        const { data, error } = await supabase
          .from('daily_questions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!error) question = data;
      }
      
      setTodaysQuestion(question);
    } catch (error) {
      console.error('Error fetching today\'s question:', error);
    }
  };

  // Submit an answer to today's question
  const submitAnswer = async (answer: string): Promise<boolean> => {
    if (!user || !todaysQuestion) return false;
    
    try {
      const isAnswerCorrect = answer === todaysQuestion.correct_answer;
      setIsCorrect(isAnswerCorrect);
      setSelectedAnswer(answer);
      
      // Record the attempt in the database
      const { error: attemptError } = await supabase
        .from('question_attempts')
        .insert({
          user_id: user.id,
          question_id: todaysQuestion.id,
          selected_answer: answer,
          is_correct: isAnswerCorrect,
          completed: true,
          category: todaysQuestion.category,
          difficulty: todaysQuestion.difficulty,
          created_at: new Date().toISOString()
        });
      
      if (attemptError) throw attemptError;
      
      // Update streak and other metrics
      await completeToday(isAnswerCorrect);
      
      // Set the question as completed for today
      setHasCompletedToday(true);
      
      return isAnswerCorrect;
    } catch (error) {
      console.error('Error submitting answer:', error);
      return false;
    }
  };

  // Mark today's question as completed and update statistics
  const completeToday = async (isCorrect: boolean = true) => {
    if (!user) return false;

    try {
      // Get the current date in the user's timezone
      const nowInUserTZ = utcToZonedTime(new Date(), userTimeZone);
      const todayStr = format(nowInUserTZ, 'yyyy-MM-dd');
      
      // Get the user's current metrics
      const { data: metrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGSQL_EMPTY_RESULT') {
        throw fetchError;
      }
      
      const existingMetrics = metrics || { streak: 0, last_daily_question: null };
      let newStreak = existingMetrics.streak;
      
      // Handle streak calculation with timezone awareness
      const lastCompletionDate = existingMetrics.last_daily_question 
        ? utcToZonedTime(parseISO(existingMetrics.last_daily_question), userTimeZone)
        : null;
      
      if (!lastCompletionDate) {
        // First time completing a daily question
        newStreak = 1;
      } else {
        const yesterday = subDays(nowInUserTZ, 1);
        
        if (isSameDay(lastCompletionDate, yesterday)) {
          // Completed yesterday's question, increment streak
          newStreak += 1;
        } else if (isSameDay(lastCompletionDate, nowInUserTZ)) {
          // Already completed today, maintain streak
          // Do nothing, keep the streak as is
        } else {
          // Broke the streak
          newStreak = 1;
        }
      }
      
      // Update user metrics with new streak and last completion date
      const { error: updateError } = await supabase
        .from('user_metrics')
        .upsert({
          user_id: user.id,
          streak: newStreak,
          last_daily_question: nowInUserTZ.toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (updateError) throw updateError;
      
      // Update the local streak state
      setStreak(newStreak);
      setLastCompletionDate(todayStr);
      
      // Award points via gamification if the answer is correct
      if (isCorrect) {
        // Update user gamification data - increase XP, etc.
        const { data: gamification, error: gamificationError } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (gamificationError && gamificationError.code !== 'PGSQL_EMPTY_RESULT') {
          console.error('Error fetching gamification data:', gamificationError);
        } else {
          const xpToAward = 10; // Base XP for completing daily question
          const streakBonus = Math.min(10, Math.floor(newStreak / 3)); // Bonus for maintaining streak
          const totalXP = xpToAward + streakBonus;
          
          if (gamification) {
            await supabase
              .from('user_gamification')
              .update({
                xp: (gamification.xp || 0) + totalXP,
                weekly_xp: (gamification.weekly_xp || 0) + totalXP,
                lifetime_xp: (gamification.lifetime_xp || 0) + totalXP,
                last_activity_date: new Date().toISOString()
              })
              .eq('user_id', user.id);
          } else {
            await supabase
              .from('user_gamification')
              .insert({
                user_id: user.id,
                xp: totalXP,
                weekly_xp: totalXP,
                lifetime_xp: totalXP,
                last_activity_date: new Date().toISOString()
              });
          }
        }
        
        // Check for streak-based achievements
        if (newStreak >= 7 && newStreak % 7 === 0) {
          // Weekly streak achievement
          addNotification({
            title: 'Weekly Streak Achieved!',
            message: `You've maintained a ${newStreak}-day streak. Keep it up!`,
            type: 'streak',
            priority: 'high',
            icon: 'flame'
          });
        } else if (newStreak >= 30 && newStreak % 30 === 0) {
          // Monthly streak achievement
          addNotification({
            title: 'Monthly Streak Achieved!',
            message: `Incredible! You've maintained a ${newStreak}-day streak.`,
            type: 'achievement',
            priority: 'high',
            icon: 'trophy'
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error completing daily question:', error);
      return false;
    }
  };

  // Reset the current question (Premium users only)
  const resetQuestion = async () => {
    if (!user?.isPremiumUser) {
      addNotification({
        title: 'Premium Feature',
        message: 'Question reset is only available for premium users. Upgrade your account to access this feature.',
        type: 'system',
        priority: 'medium',
      });
      return false;
    }
    
    try {
      setIsCorrect(null);
      setSelectedAnswer(null);
      setHasCompletedToday(false);
      
      // Fetch a new question
      await fetchTodaysQuestion();
      
      return true;
    } catch (error) {
      console.error('Error resetting question:', error);
      return false;
    }
  };

  return {
    streak,
    hasCompletedToday,
    lastCompletionDate,
    loading,
    todaysQuestion,
    isCorrect,
    selectedAnswer,
    setSelectedAnswer,
    submitAnswer,
    completeToday,
    resetQuestion,
    refetch: fetchDailyQuestionStatus
  };
}
