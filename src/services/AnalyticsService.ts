
import { supabase } from '@/lib/supabase';
import { DateRange, AnalyticsFilters } from '@/types/analytics';
import { format, eachDayOfInterval, getDay, parseISO, isValid } from 'date-fns';

// Helper function to format date for consistent use
const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'yyyy-MM-dd');
};

class AnalyticsService {
  /**
   * Get user learning activity data for charts
   */
  async getUserActivityData(userId: string, range: DateRange): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group data by date for charts
      const activityByDate = data.reduce((acc: Record<string, any>, attempt) => {
        const date = formatDate(attempt.created_at);
        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0,
            correct: 0,
            score: 0,
            timeSpent: 0,
            attempts: 0
          };
        }
        
        acc[date].total += attempt.total_questions;
        acc[date].correct += attempt.correct_answers;
        acc[date].score += attempt.score_percentage;
        acc[date].timeSpent += attempt.time_spent || 0;
        acc[date].attempts += 1;
        
        return acc;
      }, {});
      
      // Fill in missing dates in the range with zero values
      const allDates = eachDayOfInterval({ start: range.from, end: range.to });
      const formattedActivityData = allDates.map(date => {
        const dateStr = formatDate(date);
        return activityByDate[dateStr] || {
          date: dateStr,
          total: 0,
          correct: 0,
          score: 0,
          timeSpent: 0,
          attempts: 0,
          day: getDay(date) // 0 = Sunday, 6 = Saturday
        };
      });

      return formattedActivityData;
    } catch (error) {
      console.error('Error fetching user activity data:', error);
      throw error;
    }
  }

  /**
   * Get data for heatmap visualization (activity by day and time)
   */
  async getActivityHeatmapData(userId: string, range: DateRange): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('question_attempts')
        .select('created_at, total_questions')
        .eq('user_id', userId)
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString());

      if (error) throw error;

      // Create heatmap data (day of week x hour of day)
      const heatmapData: any[] = [];
      
      // Initialize empty heatmap data
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          heatmapData.push({
            day,
            hour,
            value: 0,
            dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
            hourFormatted: `${hour}:00`
          });
        }
      }
      
      // Fill with actual data
      data.forEach(record => {
        const date = new Date(record.created_at);
        const day = date.getDay(); // 0-6
        const hour = date.getHours(); // 0-23
        
        const index = day * 24 + hour;
        if (heatmapData[index]) {
          heatmapData[index].value += record.total_questions || 1;
        }
      });

      return heatmapData;
    } catch (error) {
      console.error('Error fetching activity heatmap data:', error);
      throw error;
    }
  }

  /**
   * Get performance by category/topic
   */
  async getPerformanceByCategory(userId: string, range: DateRange): Promise<any[]> {
    try {
      // First get all user's question attempts in the date range
      const { data: attempts, error: attemptsError } = await supabase
        .from('question_attempts')
        .select('id, user_id, content_type, total_questions, correct_answers, score_percentage, created_at')
        .eq('user_id', userId)
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString());

      if (attemptsError) throw attemptsError;

      // Group and aggregate by content type
      const byCategory = attempts.reduce((acc: Record<string, any>, attempt) => {
        const category = attempt.content_type || 'unknown';
        
        if (!acc[category]) {
          acc[category] = {
            category,
            total: 0,
            correct: 0,
            attempts: 0,
            averageScore: 0
          };
        }
        
        acc[category].total += attempt.total_questions;
        acc[category].correct += attempt.correct_answers;
        acc[category].attempts += 1;
        acc[category].averageScore += attempt.score_percentage;
        
        return acc;
      }, {});
      
      // Calculate averages and convert to array
      return Object.values(byCategory).map((item: any) => ({
        ...item,
        averageScore: item.attempts > 0 ? Math.round(item.averageScore / item.attempts) : 0,
        masteryPercentage: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
      }));
    } catch (error) {
      console.error('Error fetching performance by category:', error);
      throw error;
    }
  }

  /**
   * Get user goals and progress
   */
  async getUserGoals(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If there are no goals yet, return empty array
      if (!data || data.length === 0) {
        return [];
      }

      // For each goal, calculate current progress
      const goalsWithProgress = await Promise.all(data.map(async goal => {
        let progress = 0;
        
        // Different calculation based on goal type
        switch (goal.goal_type) {
          case 'questions_answered':
            const { count: questionsCount } = await supabase
              .from('question_responses')
              .select('*', { count: 'exact' })
              .eq('user_id', userId)
              .gte('created_at', goal.start_date)
              .lte('created_at', goal.end_date || new Date().toISOString());
              
            progress = Math.min(100, (questionsCount || 0) / goal.target_value * 100);
            break;
            
          case 'mastery_score':
            const { data: attempts } = await supabase
              .from('question_attempts')
              .select('score_percentage')
              .eq('user_id', userId)
              .gte('created_at', goal.start_date)
              .lte('created_at', goal.end_date || new Date().toISOString());
              
            const avgScore = attempts?.length 
              ? attempts.reduce((sum, item) => sum + item.score_percentage, 0) / attempts.length
              : 0;
              
            progress = Math.min(100, (avgScore / goal.target_value) * 100);
            break;
            
          case 'study_days':
            // Group by date to count unique days
            const { data: activityDays } = await supabase
              .from('question_attempts')
              .select('created_at')
              .eq('user_id', userId)
              .gte('created_at', goal.start_date)
              .lte('created_at', goal.end_date || new Date().toISOString());
              
            const uniqueDays = new Set(
              (activityDays || []).map(a => formatDate(a.created_at))
            ).size;
              
            progress = Math.min(100, (uniqueDays / goal.target_value) * 100);
            break;
        }
        
        return {
          ...goal,
          progress: Math.round(progress)
        };
      }));

      return goalsWithProgress;
    } catch (error) {
      console.error('Error fetching user goals:', error);
      throw error;
    }
  }

  /**
   * Create or update a user learning goal
   */
  async saveUserGoal(
    userId: string,
    goalData: {
      id?: string;
      goalType: string;
      targetValue: number;
      startDate: string;
      endDate?: string;
      title: string;
      description?: string;
    }
  ): Promise<any> {
    try {
      const goalRecord = {
        user_id: userId,
        goal_type: goalData.goalType,
        target_value: goalData.targetValue,
        start_date: goalData.startDate,
        end_date: goalData.endDate,
        title: goalData.title,
        description: goalData.description,
        created_at: new Date().toISOString(),
      };

      if (goalData.id) {
        // Update existing goal
        const { data, error } = await supabase
          .from('user_goals')
          .update(goalRecord)
          .eq('id', goalData.id)
          .select();
          
        if (error) throw error;
        return data?.[0];
      } else {
        // Create new goal
        const { data, error } = await supabase
          .from('user_goals')
          .insert([goalRecord])
          .select();
          
        if (error) throw error;
        return data?.[0];
      }
    } catch (error) {
      console.error('Error saving user goal:', error);
      throw error;
    }
  }

  /**
   * Get knowledge gaps based on analysis of incorrect answers
   */
  async getKnowledgeGaps(userId: string, range: DateRange): Promise<any[]> {
    try {
      // Get incorrect responses with question details
      const { data: incorrectResponses, error } = await supabase
        .from('question_responses')
        .select(`
          *,
          question:question_id(
            id,
            question,
            question_type,
            content_id,
            difficulty,
            tags
          )
        `)
        .eq('user_id', userId)
        .eq('is_correct', false)
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString());

      if (error) throw error;
      
      if (!incorrectResponses || incorrectResponses.length === 0) {
        return [];
      }

      // Count occurrences by tag to identify knowledge gaps
      const tagCounts: Record<string, { count: number, difficulty: string[] }> = {};
      
      incorrectResponses.forEach(response => {
        if (response.question && response.question.tags) {
          const tags = Array.isArray(response.question.tags) 
            ? response.question.tags 
            : [];
            
          tags.forEach(tag => {
            if (!tagCounts[tag]) {
              tagCounts[tag] = { count: 0, difficulty: [] };
            }
            tagCounts[tag].count += 1;
            if (!tagCounts[tag].difficulty.includes(response.question.difficulty)) {
              tagCounts[tag].difficulty.push(response.question.difficulty);
            }
          });
        }
      });
      
      // Convert to array and sort by count (most problematic first)
      return Object.entries(tagCounts)
        .map(([tag, data]) => ({
          tag,
          count: data.count,
          difficulty: data.difficulty,
          percentage: Math.round((data.count / incorrectResponses.length) * 100)
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching knowledge gaps:', error);
      throw error;
    }
  }

  /**
   * Get session statistics for analysis
   */
  async getSessionStatistics(userId: string, range: DateRange): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          totalSessions: 0,
          averageSessionLength: 0,
          averageQuestionsPerSession: 0,
          averageScorePercentage: 0,
          optimalTimeOfDay: null,
          completionRate: 0,
          timePerQuestion: 0
        };
      }

      // Group attempts into sessions (attempts within 30 minutes of each other)
      const sessions: any[][] = [];
      let currentSession: any[] = [data[0]];
      
      for (let i = 1; i < data.length; i++) {
        const current = new Date(data[i].created_at);
        const previous = new Date(data[i-1].created_at);
        const diffMinutes = (current.getTime() - previous.getTime()) / (1000 * 60);
        
        if (diffMinutes <= 30) {
          currentSession.push(data[i]);
        } else {
          sessions.push(currentSession);
          currentSession = [data[i]];
        }
      }
      
      if (currentSession.length > 0) {
        sessions.push(currentSession);
      }

      // Calculate session statistics
      const totalSessions = sessions.length;
      let totalTime = 0;
      let totalQuestions = 0;
      let totalCorrect = 0;
      let totalScorePercentage = 0;
      let sessionsByHour: Record<number, {count: number, avgScore: number}> = {};
      
      sessions.forEach(session => {
        const sessionTime = session.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0);
        const sessionQuestions = session.reduce((sum, attempt) => sum + attempt.total_questions, 0);
        const sessionCorrect = session.reduce((sum, attempt) => sum + attempt.correct_answers, 0);
        const sessionScore = session.reduce((sum, attempt) => sum + attempt.score_percentage, 0) / session.length;
        
        totalTime += sessionTime;
        totalQuestions += sessionQuestions;
        totalCorrect += sessionCorrect;
        totalScorePercentage += sessionScore;
        
        // Track performance by hour for optimal time analysis
        const hour = new Date(session[0].created_at).getHours();
        if (!sessionsByHour[hour]) {
          sessionsByHour[hour] = { count: 0, avgScore: 0 };
        }
        sessionsByHour[hour].count += 1;
        sessionsByHour[hour].avgScore += sessionScore;
      });
      
      // Find optimal time of day (hour with best average score, with minimum 2 sessions)
      let optimalHour = null;
      let bestScore = 0;
      
      Object.entries(sessionsByHour).forEach(([hour, data]) => {
        if (data.count >= 2) {
          const avgScore = data.avgScore / data.count;
          if (avgScore > bestScore) {
            bestScore = avgScore;
            optimalHour = parseInt(hour);
          }
        }
      });
      
      return {
        totalSessions,
        averageSessionLength: totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0,
        averageQuestionsPerSession: totalSessions > 0 ? Math.round(totalQuestions / totalSessions) : 0,
        averageScorePercentage: totalSessions > 0 ? Math.round(totalScorePercentage / totalSessions) : 0,
        optimalTimeOfDay: optimalHour !== null ? `${optimalHour}:00` : null,
        completionRate: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        timePerQuestion: totalQuestions > 0 ? Math.round((totalTime / totalQuestions) * 10) / 10 : 0
      };
    } catch (error) {
      console.error('Error fetching session statistics:', error);
      throw error;
    }
  }

  /**
   * Get streak information (consecutive days with activity)
   */
  async getUserStreak(userId: string): Promise<{currentStreak: number, longestStreak: number, lastActiveDate: string | null}> {
    try {
      // Get user metrics which includes the streak info
      const { data, error } = await supabase
        .from('user_metrics')
        .select('streak, updated_at')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGSQL_EMPTY_RESULT') {
        throw error;
      }
      
      if (!data) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null
        };
      }
      
      // Also get historical streak data to determine longest streak
      const { data: streakHistory, error: historyError } = await supabase
        .from('user_streak_history')
        .select('streak_length, end_date')
        .eq('user_id', userId)
        .order('streak_length', { ascending: false })
        .limit(1);
        
      if (historyError) {
        throw historyError;
      }
      
      const longestStreak = streakHistory && streakHistory.length > 0 && streakHistory[0].streak_length > data.streak
        ? streakHistory[0].streak_length
        : data.streak;

      return {
        currentStreak: data.streak,
        longestStreak,
        lastActiveDate: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching user streak:', error);
      throw error;
    }
  }

  /**
   * Generate recommendations based on performance
   */
  async getStudyRecommendations(userId: string): Promise<any[]> {
    try {
      // First get knowledge gaps
      const knowledgeGaps = await this.getKnowledgeGaps(userId, {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
        to: new Date()
      });
      
      // Get performance by content type
      const performanceByCategory = await this.getPerformanceByCategory(userId, {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      });
      
      // Generate recommendations based on gaps and performance
      const recommendations = [];
      
      // Add recommendations based on knowledge gaps
      if (knowledgeGaps.length > 0) {
        const topGaps = knowledgeGaps.slice(0, 3);
        topGaps.forEach(gap => {
          recommendations.push({
            type: 'knowledge_gap',
            focus: gap.tag,
            reason: `You've struggled with ${gap.tag} (${gap.percentage}% of incorrect answers)`,
            priority: gap.count > 5 ? 'high' : 'medium',
            difficulty: gap.difficulty.join(', ')
          });
        });
      }
      
      // Add recommendations based on performance by category
      if (performanceByCategory.length > 0) {
        // Find lowest performing categories
        const sortedByPerformance = [...performanceByCategory].sort((a, b) => 
          a.masteryPercentage - b.masteryPercentage
        );
        
        const lowPerformingCategories = sortedByPerformance
          .filter(cat => cat.masteryPercentage < 70 && cat.total >= 5)
          .slice(0, 2);
          
        lowPerformingCategories.forEach(category => {
          recommendations.push({
            type: 'category_performance',
            focus: category.category,
            reason: `Your mastery in ${category.category} is ${category.masteryPercentage}%`,
            priority: category.masteryPercentage < 50 ? 'high' : 'medium',
            totalQuestions: category.total
          });
        });
      }
      
      // Add general recommendations if we don't have enough specific ones
      if (recommendations.length < 3) {
        recommendations.push({
          type: 'general',
          focus: 'Diverse practice',
          reason: 'Regular practice across different topics improves retention',
          priority: 'low',
          suggestion: 'Try practicing different question types each day'
        });
        
        // Add another general recommendation if needed
        if (recommendations.length < 3) {
          recommendations.push({
            type: 'general',
            focus: 'Spaced repetition',
            reason: 'Reviewing content at increasing intervals improves long-term memory',
            priority: 'medium',
            suggestion: 'Review previously mastered content once a week'
          });
        }
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error generating study recommendations:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
