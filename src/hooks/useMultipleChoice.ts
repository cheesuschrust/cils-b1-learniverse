
import { useState, useEffect, useCallback } from 'react';
import { Question, QuestionSet, QuizAttempt } from '@/types/question';
import questionService from '@/services/questionService';

export const useMultipleChoice = () => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('current-user'); // In a real app, this would come from auth system
  
  // Load question sets and quiz attempts
  useEffect(() => {
    try {
      const loadedSets = questionService.getQuestionSets();
      setQuestionSets(loadedSets);
      
      const loadedAttempts = questionService.getQuizAttempts(currentUserId);
      setQuizAttempts(loadedAttempts);
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load question data'));
      setIsLoading(false);
    }
  }, [currentUserId]);
  
  // Create a new question set
  const createQuestionSet = useCallback((set: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): QuestionSet => {
    const newSet = questionService.createQuestionSet(set);
    setQuestionSets(prev => [...prev, newSet]);
    return newSet;
  }, []);
  
  // Update a question set
  const updateQuestionSet = useCallback((id: string, updates: Partial<QuestionSet>): QuestionSet | null => {
    const updatedSet = questionService.updateQuestionSet(id, updates);
    
    if (updatedSet) {
      setQuestionSets(prev => prev.map(set => set.id === id ? updatedSet : set));
    }
    
    return updatedSet;
  }, []);
  
  // Delete a question set
  const deleteQuestionSet = useCallback((id: string): boolean => {
    const deleted = questionService.deleteQuestionSet(id);
    
    if (deleted) {
      setQuestionSets(prev => prev.filter(set => set.id !== id));
    }
    
    return deleted;
  }, []);
  
  // Get a question set by ID
  const getQuestionSetById = useCallback((id: string): QuestionSet | null => {
    return questionService.getQuestionSetById(id);
  }, []);
  
  // Add a question to a set
  const addQuestion = useCallback((setId: string, question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question | null => {
    const newQuestion = questionService.createQuestion(setId, question);
    
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
    }
    
    return newQuestion;
  }, []);
  
  // Update a question
  const updateQuestion = useCallback((setId: string, questionId: string, updates: Partial<Question>): Question | null => {
    const updatedQuestion = questionService.updateQuestion(setId, questionId, updates);
    
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
    }
    
    return updatedQuestion;
  }, []);
  
  // Delete a question
  const deleteQuestion = useCallback((setId: string, questionId: string): boolean => {
    const deleted = questionService.deleteQuestion(setId, questionId);
    
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
    }
    
    return deleted;
  }, []);
  
  // Save a quiz attempt
  const saveQuizAttempt = useCallback((attempt: Omit<QuizAttempt, 'createdAt'>): QuizAttempt => {
    const newAttempt = questionService.saveQuizAttempt(attempt);
    setQuizAttempts(prev => [...prev, newAttempt]);
    return newAttempt;
  }, []);
  
  // Get quiz attempts for a specific question set
  const getQuizAttemptsForSet = useCallback((setId: string): QuizAttempt[] => {
    return questionService.getQuizAttemptsForSet(setId, currentUserId);
  }, [currentUserId]);
  
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
