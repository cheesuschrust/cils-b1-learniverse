
import { supabase } from '@/lib/supabase';
import { QuestionType } from '@/types/question';

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
   * Records a user's answer to a question
   */
  async recordQuestionAttempt(
    userId: string,
    questionIds: string[],
    answers: Record<string, string>,
    contentType: string,
    scorePercentage: number,
    timeSpent?: number
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
      for (const questionId of questionIds) {
        const userAnswer = answers[questionId] || '';
        
        // Get the correct answer for this question
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('correct_answer')
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
}

// Export an instance of the service
export const questionService = new QuestionService();

// Default export for compatibility with existing imports
export default questionService;
