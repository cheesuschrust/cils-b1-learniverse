import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { format, isAfter, isSameDay, addDays, differenceInDays } from 'date-fns';
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
  question_type: 'multiple_choice' | 'fill_blank' | 'reorder' | 'listening' | 'reading' | 'citizenship';
}

interface UseDailyQuestionReturn {
  todaysQuestion: DailyQuestion | null;
  isLoading: boolean;
  hasCompletedToday: boolean;
  streak: number;
  lastCompletionDate: Date | null;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string | null) => void;
  submitAnswer: (answer: string) => Promise<boolean>;
  resetQuestion: () => Promise<void>;
  refreshQuestion: () => Promise<void>;
  questionsRemaining: number;
  dailyLimit: number;
  isLimitReached: boolean;
}

export const useDailyQuestion = (): UseDailyQuestionReturn => {
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
  const [questionsRemaining, setQuestionsRemaining] = useState<number>(5);
  const [dailyLimit, setDailyLimit] = useState<number>(5);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

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
      
      // Check if user has reached daily limit (for free users)
      if (user) {
        const isPremium = await checkIsPremiumUser(user.id);
        
        // Get count of questions answered today
        const { count, error: countError } = await supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('last_activity', `${today}T00:00:00`)
          .lt('last_activity', `${format(addDays(new Date(today), 1), 'yyyy-MM-dd')}T00:00:00`);
        
        if (countError) throw countError;
        
        const limit = isPremium ? 20 : 5; // Premium users get more questions
        setDailyLimit(limit);
        setQuestionsRemaining(Math.max(0, limit - (count || 0)));
        setIsLimitReached((count || 0) >= limit && !isPremium);
        
        // If limit reached and not premium, don't fetch a question
        if ((count || 0) >= limit && !isPremium) {
          setIsLoading(false);
          return;
        }
      }

      // Fetch question categories from user progress to determine where they need help
      let questionCategory = 'grammar'; // Default
      let difficulty = 'intermediate'; // Default
      
      if (user) {
        // Get user performance across categories
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('content_id, score')
          .eq('user_id', user.id)
          .order('last_activity', { ascending: false })
          .limit(20);
          
        if (progressData && progressData.length > 0) {
          // Get content details for these progress entries
          const contentIds = progressData.map(p => p.content_id);
          const { data: contentData } = await supabase
            .from('learning_content')
            .select('category_id, difficulty')
            .in('id', contentIds);
            
          if (contentData && contentData.length > 0) {
            // Calculate average scores by category
            const categoryScores: Record<string, { total: number, count: number }> = {};
            
            for (let i = 0; i < progressData.length; i++) {
              const progress = progressData[i];
              const content = contentData.find(c => c.id === progress.content_id);
              
              if (content && content.category_id) {
                if (!categoryScores[content.category_id]) {
                  categoryScores[content.category_id] = { total: 0, count: 0 };
                }
                
                categoryScores[content.category_id].total += progress.score || 0;
                categoryScores[content.category_id].count += 1;
              }
            }
            
            // Find category with lowest average score
            let lowestScore = 100;
            let lowestCategory = '';
            
            Object.entries(categoryScores).forEach(([category, stats]) => {
              const average = stats.total / stats.count;
              if (average < lowestScore) {
                lowestScore = average;
                lowestCategory = category;
              }
            });
            
            if (lowestCategory) {
              // Get category name from category_id
              const { data: categoryData } = await supabase
                .from('content_categories')
                .select('name')
                .eq('id', lowestCategory)
                .single();
                
              if (categoryData) {
                questionCategory = categoryData.name.toLowerCase();
              }
            }
            
            // Determine appropriate difficulty
            const averageScore = progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length;
            if (averageScore < 60) difficulty = 'beginner';
            else if (averageScore > 80) difficulty = 'advanced';
            else difficulty = 'intermediate';
          }
        }
      }

      // Fetch today's question from the database with adaptive difficulty and category
      const { data: questionData, error: questionError } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('question_date', today)
        .eq('category', questionCategory)
        .eq('difficulty', difficulty)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (questionError && questionError.code !== 'PGRST116') {
        // If no exact match for today, get a question from any date that matches category and difficulty
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('daily_questions')
          .select('*')
          .eq('category', questionCategory)
          .eq('difficulty', difficulty)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (fallbackError && fallbackError.code !== 'PGRST116') {
          throw fallbackError;
        }
        
        if (fallbackData) {
          setTodaysQuestion({ ...fallbackData, question_date: today });
        } else {
          // If still no match, get any question
          const { data: anyData, error: anyError } = await supabase
            .from('daily_questions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (anyError && anyError.code !== 'PGRST116') {
            throw anyError;
          }
          
          if (anyData) {
            setTodaysQuestion({ ...anyData, question_date: today });
          } else {
            setTodaysQuestion(null);
          }
        }
      } else if (questionData) {
        setTodaysQuestion(questionData);
      }

      // If user is logged in, check if they have already completed today's question
      if (user && todaysQuestion) {
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
        if (todaysQuestion) {
          const { data: userAnswersData, error: userAnswersError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('content_id', todaysQuestion.id)
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
  }, [user, toast, userTimezone, todaysQuestion]);

  // Helper to check if user is premium
  const checkIsPremiumUser = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_premium_user', { user_id: userId });
      if (error) throw error;
      return !!data;
    } catch (e) {
      console.error('Error checking premium status:', e);
      return false;
    }
  };

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

      // Update question limit count
      setQuestionsRemaining(prev => Math.max(0, prev - 1));
      if (questionsRemaining <= 1 && !(await checkIsPremiumUser(user.id))) {
        setIsLimitReached(true);
      }

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
          // If last activity was within 1-3 days ago and user is premium, maintain streak (streak protection)
          else if (await checkIsPremiumUser(user.id)) {
            const daysSinceLastActivity = differenceInDays(today, lastActivityDate);
            if (daysSinceLastActivity > 0 && daysSinceLastActivity <= 3) {
              newStreak = userStatsData.streak_days || 1;
              // Notify user of streak protection
              toast({
                title: 'Streak Protected!',
                description: 'As a premium user, your streak is protected for up to 3 days of inactivity.',
                variant: 'default',
              });
            } else {
              newStreak = 1; // Reset streak if more than 3 days
            }
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
        
        // Check for streak achievements and award XP
        checkAndAwardStreakAchievements(user.id, newStreak);
      }

      // Award XP for completing the daily question
      awardXpForDailyQuestion(user.id, isAnswerCorrect);

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

  // Award XP for completing daily questions
  const awardXpForDailyQuestion = async (userId: string, isCorrect: boolean) => {
    try {
      const baseXp = isCorrect ? 10 : 5; // Base XP for correct/incorrect
      let bonusXp = 0;
      
      // Streak bonuses
      if (streak >= 7) bonusXp += 5;
      if (streak >= 30) bonusXp += 10;
      
      const totalXp = baseXp + bonusXp;
      
      // Update user's XP in the database
      await supabase.rpc('add_user_xp', { 
        user_id: userId, 
        xp_amount: totalXp, 
        activity_type: 'daily_question'
      });
      
      // Show XP gained toast
      toast({
        title: 'XP Earned!',
        description: `You earned ${totalXp} XP for completing today's question.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  // Check for and award streak achievements
  const checkAndAwardStreakAchievements = async (userId: string, currentStreak: number) => {
    try {
      const streakMilestones = [
        { days: 7, name: 'Weekly Warrior', xp: 50 },
        { days: 30, name: 'Monthly Master', xp: 100 },
        { days: 100, name: 'Century Club', xp: 500 },
        { days: 365, name: 'Year Long Legend', xp: 1000 },
      ];
      
      for (const milestone of streakMilestones) {
        if (currentStreak === milestone.days) {
          // Check if achievement already exists
          const { data: existingAchievement } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', userId)
            .eq('achievement_name', milestone.name)
            .single();
            
          if (!existingAchievement) {
            // Award new achievement
            await supabase
              .from('user_achievements')
              .insert({
                user_id: userId,
                achievement_name: milestone.name,
                achievement_type: 'streak',
                description: `Maintain a study streak for ${milestone.days} days`,
                metadata: { streak_days: milestone.days, xp_awarded: milestone.xp }
              });
              
            // Award XP
            await supabase.rpc('add_user_xp', { 
              user_id: userId, 
              xp_amount: milestone.xp, 
              activity_type: 'achievement'
            });
            
            // Show achievement notification
            toast({
              title: '🏆 Achievement Unlocked!',
              description: `${milestone.name}: You've maintained a ${milestone.days}-day streak!`,
              variant: 'default',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
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

    const isPremium = await checkIsPremiumUser(user.id);
    
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
      
      // Increase questions remaining count
      setQuestionsRemaining(prev => prev + 1);
      setIsLimitReached(false);

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
    questionsRemaining,
    dailyLimit,
    isLimitReached
  };
};

export default useDailyQuestion;
