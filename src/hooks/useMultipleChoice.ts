
import { useState, useEffect, useCallback } from 'react';
import { Question, QuestionSet, QuizAttempt } from '@/types/question';
import questionService from '@/services/questionService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useMultipleChoice = () => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, incrementDailyQuestionCount } = useAuth();
  const { toast } = useToast();
  const currentUserId = user?.id || 'guest';
  
  // Load question sets and quiz attempts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const loadedSets = await questionService.getQuestionSets();
        setQuestionSets(loadedSets);
        
        if (currentUserId !== 'guest') {
          const loadedAttempts = await questionService.getQuizAttempts(currentUserId);
          setQuizAttempts(loadedAttempts);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load question data'));
        toast({
          title: "Error loading questions",
          description: "Could not load questions. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUserId, toast]);
  
  // Create a new question set
  const createQuestionSet = useCallback(async (set: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuestionSet> => {
    try {
      const newSet = await questionService.createQuestionSet(set);
      setQuestionSets(prev => [...prev, newSet]);
      toast({
        title: "Question set created",
        description: `Successfully created "${newSet.title}" question set`,
      });
      return newSet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create question set';
      toast({
        title: "Error creating question set",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);
  
  // Update a question set
  const updateQuestionSet = useCallback(async (id: string, updates: Partial<QuestionSet>): Promise<QuestionSet | null> => {
    try {
      const updatedSet = await questionService.updateQuestionSet(id, updates);
      
      if (updatedSet) {
        setQuestionSets(prev => prev.map(set => set.id === id ? updatedSet : set));
        toast({
          title: "Question set updated",
          description: `Successfully updated "${updatedSet.title}" question set`,
        });
      }
      
      return updatedSet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update question set';
      toast({
        title: "Error updating question set",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);
  
  // Delete a question set
  const deleteQuestionSet = useCallback(async (id: string): Promise<boolean> => {
    try {
      const deleted = await questionService.deleteQuestionSet(id);
      
      if (deleted) {
        setQuestionSets(prev => prev.filter(set => set.id !== id));
        toast({
          title: "Question set deleted",
          description: "Question set was successfully deleted",
        });
      }
      
      return deleted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question set';
      toast({
        title: "Error deleting question set",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);
  
  // Get a question set by ID
  const getQuestionSetById = useCallback((id: string): QuestionSet | null => {
    return questionSets.find(set => set.id === id) || null;
  }, [questionSets]);
  
  // Add a question to a set
  const addQuestion = useCallback(async (setId: string, question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question | null> => {
    try {
      const newQuestion = await questionService.createQuestion(setId, question);
      
      if (newQuestion) {
        setQuestionSets(prev => prev.map(set => {
          if (set.id === setId) {
            return {
              ...set,
              questions: [...set.questions, newQuestion],
              updatedAt: new Date()
            };
          }
          return set;
        }));
        toast({
          title: "Question added",
          description: "Question was successfully added to the set",
        });
      }
      
      return newQuestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add question';
      toast({
        title: "Error adding question",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);
  
  // Update a question
  const updateQuestion = useCallback(async (setId: string, questionId: string, updates: Partial<Question>): Promise<Question | null> => {
    try {
      const updatedQuestion = await questionService.updateQuestion(setId, questionId, updates);
      
      if (updatedQuestion) {
        setQuestionSets(prev => prev.map(set => {
          if (set.id === setId) {
            return {
              ...set,
              questions: set.questions.map(q => q.id === questionId ? updatedQuestion : q),
              updatedAt: new Date()
            };
          }
          return set;
        }));
        toast({
          title: "Question updated",
          description: "Question was successfully updated",
        });
      }
      
      return updatedQuestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update question';
      toast({
        title: "Error updating question",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);
  
  // Delete a question
  const deleteQuestion = useCallback(async (setId: string, questionId: string): Promise<boolean> => {
    try {
      const deleted = await questionService.deleteQuestion(setId, questionId);
      
      if (deleted) {
        setQuestionSets(prev => prev.map(set => {
          if (set.id === setId) {
            return {
              ...set,
              questions: set.questions.filter(q => q.id !== questionId),
              updatedAt: new Date()
            };
          }
          return set;
        }));
        toast({
          title: "Question deleted",
          description: "Question was successfully deleted",
        });
      }
      
      return deleted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question';
      toast({
        title: "Error deleting question",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);
  
  // Save a quiz attempt and increment daily question count
  const saveQuizAttempt = useCallback(async (attempt: Omit<QuizAttempt, 'createdAt'>): Promise<QuizAttempt> => {
    try {
      if (user) {
        await incrementDailyQuestionCount('multipleChoice');
      }
      
      const newAttempt = await questionService.saveQuizAttempt({...attempt, userId: currentUserId});
      setQuizAttempts(prev => [...prev, newAttempt]);
      
      return newAttempt;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save quiz attempt';
      toast({
        title: "Error saving attempt",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [currentUserId, incrementDailyQuestionCount, toast, user]);
  
  // Get quiz attempts for a specific question set
  const getQuizAttemptsForSet = useCallback((setId: string): QuizAttempt[] => {
    return quizAttempts.filter(attempt => attempt.questionSetId === setId);
  }, [quizAttempts]);
  
  // Get the user's progress on a question set
  const getSetProgress = useCallback((setId: string): { completed: number; total: number; percentage: number } => {
    const attempts = getQuizAttemptsForSet(setId);
    const completedAttempts = attempts.filter(a => a.completed);
    const set = questionSets.find(s => s.id === setId);
    const total = set?.questions.length || 0;
    
    return {
      completed: completedAttempts.length,
      total,
      percentage: total > 0 ? (completedAttempts.length / total) * 100 : 0
    };
  }, [getQuizAttemptsForSet, questionSets]);
  
  return {
    questionSets,
    quizAttempts,
    isLoading,
    error,
    createQuestionSet,
    updateQuestionSet,
    deleteQuestionSet,
    getQuestionSetById,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    saveQuizAttempt,
    getQuizAttemptsForSet,
    getSetProgress
  };
};

export default useMultipleChoice;
