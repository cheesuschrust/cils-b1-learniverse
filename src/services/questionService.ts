import { supabase } from '@/lib/supabase';
import { Question, QuizAttempt, ReviewSchedule, ReviewPerformance } from '@/types/question';
import { calculateNextReview, generateReviewSchedule, calculateReviewPerformance } from '@/utils/spacedRepetition';

export interface QuestionGenerationOptions {
  count: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: 'english' | 'italian' | 'both';
  tags?: string[];
}

// The service class for handling all question operations
class QuestionService {
  /**
   * Retrieves questions from the database based on filters
   */
  async getQuestions(
    contentId?: string,
    questionType?: string,
    limit = 10,
    offset = 0
  ) {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      if (questionType) {
        query = query.eq('question_type', questionType);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  /**
   * Creates a new question in the database
   */
  async createQuestion(questionData: {
    content_id?: string;
    question: string;
    question_type: string;
    options?: any;
    correct_answer: string;
    explanation?: string;
    difficulty?: string;
    language?: string;
    created_by: string;
    tags?: string[];
  }) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([questionData])
        .select();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  /**
   * Updates an existing question in the database
   */
  async updateQuestion(
    questionId: string,
    updates: {
      question?: string;
      options?: any;
      correct_answer?: string;
      explanation?: string;
      difficulty?: string;
      tags?: string[];
    }
  ) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', questionId)
        .select();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  /**
   * Deletes a question from the database
   */
  async deleteQuestion(questionId: string) {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  /**
   * Records a user's answer to a question and updates spaced repetition data
   */
  async recordQuestionAttempt(
    userId: string,
    questionIds: string[],
    answers: Record<string, string>,
    contentType: string,
    scorePercentage: number,
    timeSpent?: number,
    isReview: boolean = false
  ) {
    try {
      // First, create the attempt record
      const { data: attemptData, error: attemptError } = await supabase
        .from('question_attempts')
        .insert({
          user_id: userId,
          content_type: contentType,
          total_questions: questionIds.length,
          correct_answers: Math.round((questionIds.length * scorePercentage) / 100),
          score_percentage: scorePercentage,
          time_spent: timeSpent,
          created_at: new Date().toISOString(),
          completed: true,
          is_review: isReview
        })
        .select();

      if (attemptError) {
        throw attemptError;
      }

      if (!attemptData || attemptData.length === 0) {
        throw new Error('Failed to create question attempt');
      }

      const attemptId = attemptData[0].id;

      // Now create individual response records for each question
      const responses = [];
      const questionUpdates = [];
      
      for (const questionId of questionIds) {
        const userAnswer = answers[questionId] || '';
        
        // Get the correct answer for this question
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('correct_answer, difficulty_factor, review_count, next_review_date')
          .eq('id', questionId)
          .single();

        if (questionError) {
          console.error('Error fetching question:', questionError);
          continue;
        }

        const isCorrect = userAnswer.toLowerCase() === questionData.correct_answer.toLowerCase();

        responses.push({
          attempt_id: attemptId,
          question_id: questionId,
          user_answer: userAnswer,
          is_correct: isCorrect,
          time_spent: timeSpent ? timeSpent / questionIds.length : null,
          created_at: new Date().toISOString(),
        });
        
        // Update spaced repetition metadata
        if (isReview) {
          const currentFactor = questionData.difficulty_factor || 2.5;
          const reviewCount = (questionData.review_count || 0) + 1;
          
          const { nextReviewDate, difficultyFactor } = calculateNextReview(
            isCorrect,
            currentFactor,
            isCorrect ? reviewCount : 0
          );
          
          questionUpdates.push({
            id: questionId,
            next_review_date: nextReviewDate.toISOString(),
            difficulty_factor: difficultyFactor,
            review_count: isCorrect ? reviewCount : 0,
            last_reviewed_at: new Date().toISOString()
          });
        } else if (!questionData.next_review_date) {
          // If this is the first time seeing this question, schedule for review
          const { nextReviewDate, difficultyFactor } = calculateNextReview(isCorrect);
          
          questionUpdates.push({
            id: questionId,
            next_review_date: nextReviewDate.toISOString(),
            difficulty_factor: difficultyFactor,
            review_count: 0,
            last_reviewed_at: new Date().toISOString()
          });
        }
      }

      // Insert all responses
      if (responses.length > 0) {
        const { error: responsesError } = await supabase
          .from('question_responses')
          .insert(responses);

        if (responsesError) {
          throw responsesError;
        }
      }
      
      // Update question spaced repetition data
      if (questionUpdates.length > 0) {
        for (const update of questionUpdates) {
          const { error: updateError } = await supabase
            .from('questions')
            .update({
              next_review_date: update.next_review_date,
              difficulty_factor: update.difficulty_factor,
              review_count: update.review_count,
              last_reviewed_at: update.last_reviewed_at,
              updated_at: new Date().toISOString()
            })
            .eq('id', update.id);
            
          if (updateError) {
            console.error('Error updating question review data:', updateError);
          }
        }
      }

      // Update user metrics
      await this.updateUserMetrics(userId, questionIds.length, Math.round((questionIds.length * scorePercentage) / 100));

      return attemptId;
    } catch (error) {
      console.error('Error recording question attempt:', error);
      throw error;
    }
  }

  /**
   * Updates user metrics after answering questions
   */
  private async updateUserMetrics(userId: string, totalQuestions: number, correctAnswers: number) {
    try {
      // Get current user metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (metricsError && metricsError.code !== 'PGSQL_EMPTY_RESULT') {
        console.error('Error fetching user metrics:', metricsError);
        return;
      }

      // If metrics exist, update them
      if (metrics) {
        // Check if we should increment the streak
        const lastActivity = new Date(metrics.updated_at);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Increment streak if they answered at least one question correctly today
        // and either they already answered yesterday or this is their first time
        const shouldIncrementStreak = 
          correctAnswers > 0 && 
          (lastActivity.toDateString() === yesterday.toDateString() || 
           metrics.streak === 0);
           
        // Reset streak if they haven't answered in more than a day
        const shouldResetStreak = 
          lastActivity.toDateString() !== today.toDateString() && 
          lastActivity.toDateString() !== yesterday.toDateString();
          
        let newStreak = metrics.streak;
        if (shouldIncrementStreak) {
          newStreak += 1;
        } else if (shouldResetStreak) {
          newStreak = correctAnswers > 0 ? 1 : 0;
        }

        const { error: updateError } = await supabase
          .from('user_metrics')
          .update({
            total_questions: metrics.total_questions + totalQuestions,
            correct_answers: metrics.correct_answers + correctAnswers,
            streak: newStreak,
            updated_at: new Date().toISOString(),
          })
          .eq('id', metrics.id);

        if (updateError) {
          console.error('Error updating user metrics:', updateError);
        }
      } else {
        // If no metrics exist, create them
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert({
            user_id: userId,
            total_questions: totalQuestions,
            correct_answers: correctAnswers,
            streak: correctAnswers > 0 ? 1 : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating user metrics:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in updateUserMetrics:', error);
    }
  }

  /**
   * Gets the total number of attempt records for pagination
   */
  async getAttemptCount(userId: string, contentType?: string) {
    try {
      let query = supabase
        .from('question_attempts')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error counting attempts:', error);
      return 0;
    }
  }

  /**
   * Gets question attempts for a user
   */
  async getQuestionAttempts(
    userId: string,
    contentType?: string,
    limit = 10,
    offset = 0
  ) {
    try {
      let query = supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching question attempts:', error);
      throw error;
    }
  }

  /**
   * Get questions due for review
   * @param userId User ID
   * @param limit Maximum number of questions to return
   * @param contentType Optional filter by content type
   * @returns Array of questions due for review
   */
  async getDueReviews(userId: string, limit = 50, contentType?: string) {
    try {
      const now = new Date().toISOString();
      
      let query = supabase
        .from('questions')
        .select('*')
        .lt('next_review_date', now)
        .order('next_review_date')
        .limit(limit);
        
      if (contentType) {
        query = query.eq('content_type', contentType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching due reviews:', error);
      return [];
    }
  }
  
  /**
   * Get review statistics for a user
   * @param userId User ID
   * @returns Review schedule and performance metrics
   */
  async getReviewStats(userId: string): Promise<{schedule: ReviewSchedule, performance: ReviewPerformance}> {
    try {
      // Get all questions with review data
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .not('next_review_date', 'is', null);
        
      if (questionsError) {
        throw questionsError;
      }
      
      // Get all review attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_review', true);
        
      if (attemptsError) {
        throw attemptsError;
      }
      
      // Generate statistics
      const schedule = generateReviewSchedule(questions || []);
      const performance = calculateReviewPerformance(attempts || []);
      
      return { schedule, performance };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      return {
        schedule: {
          dueToday: 0,
          dueThisWeek: 0,
          dueNextWeek: 0,
          dueByDate: {}
        },
        performance: {
          totalReviews: 0,
          correctReviews: 0,
          efficiency: 0,
          streakDays: 0,
          reviewsByCategory: {}
        }
      };
    }
  }
}

// Export an instance of the service
export const questionService = new QuestionService();

// Default export for compatibility with existing imports
export default questionService;
