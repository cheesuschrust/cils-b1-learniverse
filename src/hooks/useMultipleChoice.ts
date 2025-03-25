import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MultipleChoiceQuestion, Question, QuestionCategory, QuestionDifficulty, QuestionSet, QuizAttempt } from '@/types/question';
import { useToast } from '@/components/ui/use-toast';

const sampleQuestions: MultipleChoiceQuestion[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'Come ti chiami?',
    options: ['Mi chiamo Giovanni', 'Come ti chiami?', 'Grazie', 'Buongiorno'],
    correctAnswer: 'Mi chiamo Giovanni',
    explanation: 'The question "Come ti chiami?" means "What is your name?" and the correct response is "Mi chiamo..." followed by your name.',
    difficulty: 'Beginner',
    category: 'Greetings',
    language: 'italian',
    tags: ['greeting', 'introduction', 'beginner'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    question: "Quale di queste è una bevanda?",
    options: ["Pane", "Acqua", "Pasta", "Pizza"],
    correctAnswer: "Acqua",
    explanation: "Acqua means water, which is a drink. The others are foods.",
    difficulty: "Beginner",
    category: "Food",
    language: "italian"
  }
];

const sampleQuestionSets: QuestionSet[] = [
  {
    id: "1",
    name: "Italian Basics",
    title: "Italian Basics Quiz",
    description: "Test your knowledge of basic Italian phrases and expressions",
    questions: sampleQuestions,
    category: "Basics",
    difficulty: "Beginner",
    language: "italian",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(),
    isPublic: true,
    attempts: 0,
    bestScore: 0
  }
];

export interface UseMultipleChoiceReturn {
  questionSets: QuestionSet[];
  quizAttempts: QuizAttempt[];
  loading: boolean;
  error: string | null;
  createQuestionSet: (data: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<QuestionSet>;
  updateQuestionSet: (id: string, data: Partial<Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<QuestionSet>;
  deleteQuestionSet: (id: string) => Promise<void>;
  addQuestion: (setId: string, question: Omit<MultipleChoiceQuestion, 'id'>) => Promise<MultipleChoiceQuestion>;
  updateQuestion: (setId: string, questionId: string, data: Partial<MultipleChoiceQuestion>) => Promise<MultipleChoiceQuestion>;
  deleteQuestion: (setId: string, questionId: string) => Promise<void>;
  submitQuizAttempt: (setId: string, answers: Record<string, string>, timeSpent?: number) => Promise<QuizAttempt>;
  getQuizAttempts: (setId?: string) => QuizAttempt[];
  getQuizStats: () => QuizStats;
  getQuestionSet: (id: string) => QuestionSet | undefined;
}

export const useMultipleChoice = (): UseMultipleChoiceReturn => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(sampleQuestionSets);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createQuestionSet = useCallback(async (data: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuestionSet> => {
    try {
      const newSet: QuestionSet = {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setQuestionSets(prev => [...prev, newSet]);

      toast({
        title: "Question Set Created",
        description: "New question set has been created successfully"
      });

      return newSet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create question set';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateQuestionSet = useCallback(async (
    id: string, 
    data: Partial<Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<QuestionSet> => {
    try {
      let updatedSet: QuestionSet | undefined;

      setQuestionSets(prev => {
        const newSets = prev.map(set => {
          if (set.id === id) {
            updatedSet = {
              ...set,
              ...data,
              updatedAt: new Date()
            };
            return updatedSet;
          }
          return set;
        });
        return newSets;
      });

      if (!updatedSet) {
        throw new Error('Question set not found');
      }

      toast({
        title: "Question Set Updated",
        description: "Question set has been updated successfully"
      });

      return updatedSet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update question set';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const deleteQuestionSet = useCallback(async (id: string): Promise<void> => {
    try {
      setQuestionSets(prev => prev.filter(set => set.id !== id));

      toast({
        title: "Question Set Deleted",
        description: "Question set has been deleted successfully"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question set';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const addQuestion = useCallback(async (
    setId: string, 
    question: Omit<MultipleChoiceQuestion, 'id'>
  ): Promise<MultipleChoiceQuestion> => {
    try {
      const newQuestion: MultipleChoiceQuestion = {
        ...question,
        id: uuidv4()
      };

      let updatedSet: QuestionSet | undefined;

      setQuestionSets(prev => {
        return prev.map(set => {
          if (set.id === setId) {
            updatedSet = {
              ...set,
              questions: [...set.questions, newQuestion],
              updatedAt: new Date()
            };
            return updatedSet;
          }
          return set;
        });
      });

      if (!updatedSet) {
        throw new Error('Question set not found');
      }

      toast({
        title: "Question Added",
        description: "New question has been added to the set"
      });

      return newQuestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add question';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateQuestion = useCallback(async (
    setId: string, 
    questionId: string, 
    data: Partial<MultipleChoiceQuestion>
  ): Promise<MultipleChoiceQuestion> => {
    try {
      let updatedQuestion: MultipleChoiceQuestion | undefined;

      setQuestionSets(prev => {
        return prev.map(set => {
          if (set.id === setId) {
            const updatedQuestions = set.questions.map(q => {
              if (q.id === questionId) {
                updatedQuestion = { ...q, ...data };
                return updatedQuestion;
              }
              return q;
            });

            return {
              ...set,
              questions: updatedQuestions,
              updatedAt: new Date()
            };
          }
          return set;
        });
      });

      if (!updatedQuestion) {
        throw new Error('Question not found');
      }

      toast({
        title: "Question Updated",
        description: "Question has been updated successfully"
      });

      return updatedQuestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update question';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const deleteQuestion = useCallback(async (setId: string, questionId: string): Promise<void> => {
    try {
      setQuestionSets(prev => {
        return prev.map(set => {
          if (set.id === setId) {
            return {
              ...set,
              questions: set.questions.filter(q => q.id !== questionId),
              updatedAt: new Date()
            };
          }
          return set;
        });
      });

      toast({
        title: "Question Deleted",
        description: "Question has been removed from the set"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const submitQuizAttempt = useCallback(async (
    setId: string, 
    answers: Record<string, string>, 
    timeSpent?: number
  ): Promise<QuizAttempt> => {
    try {
      const questionSet = questionSets.find(set => set.id === setId);
      if (!questionSet) {
        throw new Error('Question set not found');
      }

      let correctCount = 0;
      questionSet.questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });

      const attempt: QuizAttempt = {
        id: uuidv4(),
        userId: 'current-user', // In a real app, get from auth context
        questionSetId: setId,
        score: correctCount,
        totalQuestions: questionSet.questions.length,
        completedAt: new Date(),
        timeSpent
      };

      setQuizAttempts(prev => [...prev, attempt]);

      toast({
        title: "Quiz Completed",
        description: `You scored ${correctCount} out of ${questionSet.questions.length}`
      });

      return attempt;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz attempt';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [questionSets, toast]);

  const getQuizAttempts = useCallback((setId?: string): QuizAttempt[] => {
    if (setId) {
      return quizAttempts.filter(attempt => attempt.questionSetId === setId);
    }
    return quizAttempts;
  }, [quizAttempts]);

  const getQuizStats = useCallback((): QuizStats => {
    const totalAttempts = quizAttempts.length;
    
    // Calculate average score
    const totalScore = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const totalQuestions = quizAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const averageScore = totalAttempts > 0 ? totalScore / totalQuestions : 0;
    
    // Find best score
    const bestScore = quizAttempts.length > 0 
      ? Math.max(...quizAttempts.map(a => a.score / a.totalQuestions))
      : 0;
    
    // Calculate total time spent
    const totalTimeSpent = quizAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
    
    // Get stats per question set
    const questionSetMap = new Map<string, { attempts: number, bestScore: number, title: string }>();
    
    questionSets.forEach(set => {
      questionSetMap.set(set.id, { attempts: 0, bestScore: 0, title: set.title });
    });
    
    quizAttempts.forEach(attempt => {
      const setId = attempt.questionSetId;
      const current = questionSetMap.get(setId);
      
      if (current) {
        const score = attempt.score / attempt.totalQuestions;
        questionSetMap.set(setId, {
          attempts: current.attempts + 1,
          bestScore: Math.max(current.bestScore, score),
          title: current.title
        });
      }
    });
    
    const questionSetStats = Array.from(questionSetMap.entries()).map(([id, stats]) => ({
      id,
      title: stats.title,
      attempts: stats.attempts,
      bestScore: stats.bestScore
    }));
    
    return {
      totalAttempts,
      averageScore,
      bestScore,
      totalTimeSpent,
      questionSets: questionSetStats
    };
  }, [quizAttempts, questionSets]);

  const getQuestionSet = useCallback((id: string): QuestionSet | undefined => {
    return questionSets.find(set => set.id === id);
  }, [questionSets]);

  return {
    questionSets,
    quizAttempts,
    loading,
    error,
    createQuestionSet,
    updateQuestionSet,
    deleteQuestionSet,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    submitQuizAttempt,
    getQuizAttempts,
    getQuizStats,
    getQuestionSet
  };
};

export default useMultipleChoice;
