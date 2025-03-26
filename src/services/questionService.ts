
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Question, QuestionSet, QuizAttempt, QuizProgress } from "@/types/question";

// Define types for the question service
export type MultipleChoiceQuestion = Question;

export type TextInputQuestion = Question & {
  inputType: 'text' | 'number' | 'date';
  validAnswers: string[];
};

export type MatchingQuestion = Question & {
  matchPairs: { left: string; right: string }[];
};

export type TrueFalseQuestion = Question & {
  statement: string;
};

export class QuestionService {
  /**
   * Fetch questions by content type
   */
  static async getQuestionsByContentType(
    contentType: string,
    limit: number = 10,
    difficulty?: string,
    language?: string
  ): Promise<Question[]> {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('type', contentType)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      
      if (language) {
        query = query.eq('language', language);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Format the questions
      return data.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation || undefined,
        difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced',
        category: q.category,
        tags: q.tags || [],
        createdAt: new Date(q.created_at),
        updatedAt: new Date(q.updated_at),
        language: q.language as 'english' | 'italian' | 'both',
        type: q.type as 'multiple_choice' | 'true_false' | 'fill_blank',
        timeLimit: q.time_limit || undefined,
        points: q.points
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }
  
  /**
   * Fetch a question set by ID
   */
  static async getQuestionSetById(id: string): Promise<QuestionSet> {
    try {
      const { data: questionSet, error: setError } = await supabase
        .from('question_sets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (setError) {
        throw setError;
      }
      
      // Fetch the questions in this set
      const { data: questionLinks, error: linksError } = await supabase
        .from('question_set_questions')
        .select('question_id, order')
        .eq('question_set_id', id)
        .order('order', { ascending: true });
      
      if (linksError) {
        throw linksError;
      }
      
      const questionIds = questionLinks.map(link => link.question_id);
      
      if (questionIds.length === 0) {
        // Return empty question set
        return {
          id: questionSet.id,
          title: questionSet.title,
          description: questionSet.description,
          difficulty: questionSet.difficulty as 'beginner' | 'intermediate' | 'advanced',
          category: questionSet.category,
          tags: questionSet.tags || [],
          createdAt: new Date(questionSet.created_at),
          updatedAt: new Date(questionSet.updated_at),
          createdBy: questionSet.created_by,
          isPublic: questionSet.is_public,
          timeLimit: questionSet.time_limit || undefined,
          passingScore: questionSet.passing_score,
          questions: [],
          language: questionSet.language as 'english' | 'italian' | 'both',
          instructions: questionSet.instructions || undefined
        };
      }
      
      // Fetch the actual questions
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', questionIds);
      
      if (questionsError) {
        throw questionsError;
      }
      
      // Format the questions and sort them according to the order
      const formattedQuestions = questionIds.map(qId => {
        const q = questions.find(q => q.id === qId);
        if (!q) return null;
        
        return {
          id: q.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation || undefined,
          difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced',
          category: q.category,
          tags: q.tags || [],
          createdAt: new Date(q.created_at),
          updatedAt: new Date(q.updated_at),
          language: q.language as 'english' | 'italian' | 'both',
          type: q.type as 'multiple_choice' | 'true_false' | 'fill_blank',
          timeLimit: q.time_limit || undefined,
          points: q.points
        };
      }).filter(q => q !== null) as Question[];
      
      // Format the question set
      return {
        id: questionSet.id,
        title: questionSet.title,
        description: questionSet.description,
        difficulty: questionSet.difficulty as 'beginner' | 'intermediate' | 'advanced',
        category: questionSet.category,
        tags: questionSet.tags || [],
        createdAt: new Date(questionSet.created_at),
        updatedAt: new Date(questionSet.updated_at),
        createdBy: questionSet.created_by,
        isPublic: questionSet.is_public,
        timeLimit: questionSet.time_limit || undefined,
        passingScore: questionSet.passing_score,
        questions: formattedQuestions,
        language: questionSet.language as 'english' | 'italian' | 'both',
        instructions: questionSet.instructions || undefined
      };
    } catch (error) {
      console.error('Error fetching question set:', error);
      throw error;
    }
  }
  
  /**
   * Create a new question
   */
  static async createQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('questions')
        .insert({
          text: question.text,
          options: question.options,
          correct_answer: question.correctAnswer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          category: question.category,
          tags: question.tags,
          language: question.language,
          type: question.type,
          time_limit: question.timeLimit,
          points: question.points,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Format the created question
      return {
        id: data.id,
        text: data.text,
        options: data.options,
        correctAnswer: data.correct_answer,
        explanation: data.explanation || undefined,
        difficulty: data.difficulty as 'beginner' | 'intermediate' | 'advanced',
        category: data.category,
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        language: data.language as 'english' | 'italian' | 'both',
        type: data.type as 'multiple_choice' | 'true_false' | 'fill_blank',
        timeLimit: data.time_limit || undefined,
        points: data.points
      };
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }
  
  /**
   * Create a new question set
   */
  static async createQuestionSet(questionSet: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuestionSet> {
    try {
      const now = new Date().toISOString();
      
      // Insert the question set
      const { data, error } = await supabase
        .from('question_sets')
        .insert({
          title: questionSet.title,
          description: questionSet.description,
          difficulty: questionSet.difficulty,
          category: questionSet.category,
          tags: questionSet.tags,
          created_by: questionSet.createdBy,
          is_public: questionSet.isPublic,
          time_limit: questionSet.timeLimit,
          passing_score: questionSet.passingScore,
          language: questionSet.language,
          instructions: questionSet.instructions,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const questionSetId = data.id;
      
      // If there are questions, link them to the question set
      if (questionSet.questions && questionSet.questions.length > 0) {
        const questionLinks = questionSet.questions.map((q, index) => ({
          question_set_id: questionSetId,
          question_id: q.id,
          order: index
        }));
        
        const { error: linkError } = await supabase
          .from('question_set_questions')
          .insert(questionLinks);
        
        if (linkError) {
          throw linkError;
        }
      }
      
      // Format the created question set
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty as 'beginner' | 'intermediate' | 'advanced',
        category: data.category,
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        createdBy: data.created_by,
        isPublic: data.is_public,
        timeLimit: data.time_limit || undefined,
        passingScore: data.passing_score,
        questions: questionSet.questions || [],
        language: data.language as 'english' | 'italian' | 'both',
        instructions: data.instructions || undefined
      };
    } catch (error) {
      console.error('Error creating question set:', error);
      throw error;
    }
  }
  
  /**
   * Submit a quiz attempt
   */
  static async submitQuizAttempt(
    userId: string,
    questionSetId: string,
    startedAt: Date,
    answers: { questionId: string; selectedAnswer: string; isCorrect: boolean; timeSpent: number }[],
    timeSpent: number
  ): Promise<QuizAttempt> {
    try {
      // Calculate the score
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const totalQuestions = answers.length;
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      // Get the question set to check passing score
      const { data: questionSet, error: setError } = await supabase
        .from('question_sets')
        .select('passing_score')
        .eq('id', questionSetId)
        .single();
      
      if (setError) {
        throw setError;
      }
      
      const passed = score >= questionSet.passing_score;
      
      // Create the quiz attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          question_set_id: questionSetId,
          started_at: startedAt.toISOString(),
          completed_at: new Date().toISOString(),
          score,
          time_spent: timeSpent,
          created_at: new Date().toISOString(),
          completed: true,
          passed
        })
        .select()
        .single();
      
      if (attemptError) {
        throw attemptError;
      }
      
      // Store the answers
      const answerRecords = answers.map(a => ({
        quiz_attempt_id: attemptData.id,
        question_id: a.questionId,
        selected_answer: a.selectedAnswer,
        is_correct: a.isCorrect,
        time_spent: a.timeSpent
      }));
      
      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answerRecords);
      
      if (answersError) {
        throw answersError;
      }
      
      // Update user metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('total_questions, correct_answers, streak')
        .eq('user_id', userId)
        .single();
      
      if (!metricsError && metrics) {
        let streak = metrics.streak;
        
        if (passed) {
          streak += 1;
        } else {
          streak = 0;
        }
        
        await supabase
          .from('user_metrics')
          .update({
            total_questions: metrics.total_questions + totalQuestions,
            correct_answers: metrics.correct_answers + correctAnswers,
            streak,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      }
      
      // Format and return the quiz attempt
      return {
        id: attemptData.id,
        userId,
        questionSetId,
        startedAt,
        completedAt: new Date(),
        score,
        timeSpent,
        answers,
        createdAt: new Date(attemptData.created_at),
        completed: true,
        passed
      };
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      throw error;
    }
  }
  
  /**
   * Get quiz progress for a user
   */
  static async getUserQuizProgress(userId: string): Promise<QuizProgress[]> {
    try {
      // Get all unique question sets the user has attempted
      const { data: attempts, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select('question_set_id, score, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      
      if (attemptsError) {
        throw attemptsError;
      }
      
      if (!attempts || attempts.length === 0) {
        return [];
      }
      
      // Get all question sets
      const questionSetIds = [...new Set(attempts.map(a => a.question_set_id))];
      
      const { data: questionSets, error: setsError } = await supabase
        .from('question_sets')
        .select('id, title')
        .in('id', questionSetIds);
      
      if (setsError) {
        throw setsError;
      }
      
      // For each question set, get the number of questions
      const questionCounts: Record<string, number> = {};
      
      for (const setId of questionSetIds) {
        const { count, error: countError } = await supabase
          .from('question_set_questions')
          .select('*', { count: 'exact', head: true })
          .eq('question_set_id', setId);
        
        if (!countError) {
          questionCounts[setId] = count || 0;
        }
      }
      
      // Group attempts by question set and calculate progress
      const progressBySet: Record<string, QuizProgress> = {};
      
      for (const attempt of attempts) {
        const setId = attempt.question_set_id;
        
        if (!progressBySet[setId]) {
          const questionSet = questionSets.find(qs => qs.id === setId);
          const totalQuestions = questionCounts[setId] || 0;
          
          progressBySet[setId] = {
            questionSetId: setId,
            completed: 0,
            total: totalQuestions,
            percentage: 0,
            bestScore: 0,
            attempts: 0
          };
        }
        
        if (attempt.score > progressBySet[setId].bestScore) {
          progressBySet[setId].bestScore = attempt.score;
        }
        
        if (!progressBySet[setId].lastAttemptDate || 
            new Date(attempt.completed_at) > new Date(progressBySet[setId].lastAttemptDate!)) {
          progressBySet[setId].lastAttemptDate = new Date(attempt.completed_at);
        }
        
        progressBySet[setId].attempts += 1;
      }
      
      // Calculate completed count and percentage
      for (const setId in progressBySet) {
        const { data: completedCount, error: completedError } = await supabase
          .from('quiz_answers')
          .select('question_id', { count: 'exact', head: true })
          .eq('quiz_attempt_id', attempts.find(a => a.question_set_id === setId)?.question_set_id);
        
        if (!completedError) {
          progressBySet[setId].completed = completedCount || 0;
          progressBySet[setId].percentage = progressBySet[setId].total > 0 
            ? Math.round((progressBySet[setId].completed / progressBySet[setId].total) * 100) 
            : 0;
        }
      }
      
      return Object.values(progressBySet);
    } catch (error) {
      console.error('Error getting user quiz progress:', error);
      throw error;
    }
  }
  
  /**
   * Get daily question
   */
  static async getDailyQuestion(language: 'english' | 'italian' | 'both' = 'both'): Promise<Question> {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Try to get a cached daily question
      const { data: cached, error: cachedError } = await supabase
        .from('daily_questions')
        .select('question_id')
        .eq('date', today)
        .maybeSingle();
      
      if (!cachedError && cached?.question_id) {
        // Get the question by ID
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', cached.question_id)
          .single();
        
        if (!questionError) {
          // Format and return the question
          return {
            id: questionData.id,
            text: questionData.text,
            options: questionData.options,
            correctAnswer: questionData.correct_answer,
            explanation: questionData.explanation || undefined,
            difficulty: questionData.difficulty as 'beginner' | 'intermediate' | 'advanced',
            category: questionData.category,
            tags: questionData.tags || [],
            createdAt: new Date(questionData.created_at),
            updatedAt: new Date(questionData.updated_at),
            language: questionData.language as 'english' | 'italian' | 'both',
            type: questionData.type as 'multiple_choice' | 'true_false' | 'fill_blank',
            timeLimit: questionData.time_limit || undefined,
            points: questionData.points
          };
        }
      }
      
      // No cached question found, get a random question
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (language !== 'both') {
        query = query.eq('language', language);
      }
      
      const { data: randomQuestion, error: randomError } = await query;
      
      if (randomError || !randomQuestion || randomQuestion.length === 0) {
        throw new Error('No questions found');
      }
      
      const question = randomQuestion[0];
      
      // Cache this question as today's daily question
      await supabase
        .from('daily_questions')
        .upsert({
          date: today,
          question_id: question.id,
          created_at: new Date().toISOString()
        });
      
      // Format and return the question
      return {
        id: question.id,
        text: question.text,
        options: question.options,
        correctAnswer: question.correct_answer,
        explanation: question.explanation || undefined,
        difficulty: question.difficulty as 'beginner' | 'intermediate' | 'advanced',
        category: question.category,
        tags: question.tags || [],
        createdAt: new Date(question.created_at),
        updatedAt: new Date(question.updated_at),
        language: question.language as 'english' | 'italian' | 'both',
        type: question.type as 'multiple_choice' | 'true_false' | 'fill_blank',
        timeLimit: question.time_limit || undefined,
        points: question.points
      };
    } catch (error) {
      console.error('Error getting daily question:', error);
      
      // Fallback to a default question
      return {
        id: 'default-1',
        text: 'What is the Italian word for "hello"?',
        options: ['Ciao', 'Arrivederci', 'Grazie', 'Prego'],
        correctAnswer: 'Ciao',
        explanation: 'Ciao is the informal way to say hello in Italian.',
        difficulty: 'beginner',
        category: 'vocabulary',
        tags: ['greeting', 'basic'],
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'both',
        type: 'multiple_choice',
        points: 1
      };
    }
  }
  
  // Add seed data for testing
  static async seedQuestions(): Promise<void> {
    try {
      // Check if we already have questions
      const { count, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
      
      if (!countError && count && count > 0) {
        console.log(`Database already has ${count} questions, skipping seed.`);
        return;
      }
      
      // Seed some basic questions
      const sampleQuestions = [
        {
          text: 'What is the Italian word for "hello"?',
          options: ['Ciao', 'Arrivederci', 'Grazie', 'Prego'],
          correct_answer: 'Ciao',
          explanation: 'Ciao is the informal way to say hello in Italian.',
          difficulty: 'beginner',
          category: 'vocabulary',
          tags: ['greeting', 'basic'],
          language: 'both',
          type: 'multiple_choice',
          points: 1
        },
        {
          text: 'Which of these is a correct conjugation of "essere" (to be) in the present tense?',
          options: ['Io sono', 'Io es', 'Io essere', 'Io sta'],
          correct_answer: 'Io sono',
          explanation: '"Sono" is the first-person singular conjugation of "essere" in the present tense.',
          difficulty: 'beginner',
          category: 'grammar',
          tags: ['verbs', 'conjugation'],
          language: 'both',
          type: 'multiple_choice',
          points: 1
        },
        {
          text: 'What is the correct article to use with "studente" (student)?',
          options: ['Lo', 'Il', 'La', 'I'],
          correct_answer: 'Lo',
          explanation: 'Words beginning with "s" followed by another consonant use the article "lo".',
          difficulty: 'intermediate',
          category: 'grammar',
          tags: ['articles', 'rules'],
          language: 'both',
          type: 'multiple_choice',
          points: 2
        }
      ];
      
      const now = new Date().toISOString();
      
      // Insert the sample questions
      for (const question of sampleQuestions) {
        await supabase
          .from('questions')
          .insert({
            ...question,
            created_at: now,
            updated_at: now
          });
      }
      
      console.log(`Seeded ${sampleQuestions.length} questions.`);
    } catch (error) {
      console.error('Error seeding questions:', error);
    }
  }
}
