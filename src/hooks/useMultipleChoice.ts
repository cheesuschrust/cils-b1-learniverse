
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { serviceFactory } from '@/services/ServiceFactory';
import { QuestionService } from '@/services/questionService';
import { useToast } from '@/hooks/use-toast';
import { Question, QuestionSet } from '@/types/question';

export function useMultipleChoice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const questionService = serviceFactory.get<QuestionService>('questionService');

  // Load question sets
  useEffect(() => {
    async function loadQuestionSets() {
      try {
        setLoading(true);
        const sets = await questionService.getQuestions();
        setQuestionSets(sets as QuestionSet[]);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load question sets'));
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load question sets",
          variant: "destructive",
        });
      }
    }
    
    if (user) {
      loadQuestionSets();
    }
  }, [user, toast]);
  
  // Create a new question set
  const createQuestionSet = async (set: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newSet = await questionService.createQuestion({ 
        ...set, 
        createdAt: new Date(),
        updatedAt: new Date(),
      } as QuestionSet);
      
      setQuestionSets(prev => [...prev, {
        ...newSet,
        questions: Array.isArray(newSet.questions) ? newSet.questions : [],
        updatedAt: new Date(),
      } as QuestionSet]);
      
      toast({
        title: "Success",
        description: "Question set created successfully",
        variant: "default",
      });
      
      setLoading(false);
      return newSet;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create question set'));
      toast({
        title: "Error",
        description: "Failed to create question set",
        variant: "destructive",
      });
      setLoading(false);
      throw err;
    }
  };
  
  // Update an existing question set
  const updateQuestionSet = async (id: string, updates: Partial<QuestionSet>) => {
    try {
      setLoading(true);
      const updatedSet = await questionService.updateQuestion(id, {
        ...updates,
        updatedAt: new Date(),
      });
      
      setQuestionSets(prev => prev.map(set => 
        set.id === id ? {
          ...set,
          ...updatedSet,
          questions: Array.isArray(updatedSet.questions) ? updatedSet.questions : set.questions,
          updatedAt: new Date(),
        } as QuestionSet : set
      ));
      
      toast({
        title: "Success",
        description: "Question set updated successfully",
        variant: "default",
      });
      
      setLoading(false);
      return updatedSet;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update question set'));
      toast({
        title: "Error",
        description: "Failed to update question set",
        variant: "destructive",
      });
      setLoading(false);
      throw err;
    }
  };
  
  // Delete a question set
  const deleteQuestionSet = async (id: string) => {
    try {
      setLoading(true);
      await questionService.deleteQuestion(id);
      
      setQuestionSets(prev => prev.filter(set => set.id !== id));
      
      toast({
        title: "Success",
        description: "Question set deleted successfully",
        variant: "default",
      });
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete question set'));
      toast({
        title: "Error",
        description: "Failed to delete question set",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };
  
  // Add questions to a set
  const addQuestionsToSet = async (setId: string, newQuestions: Question[]) => {
    try {
      const existingSet = questionSets.find(set => set.id === setId);
      if (!existingSet) {
        throw new Error("Question set not found");
      }
      
      const updatedSet = await questionService.addQuestionsToSet(setId, newQuestions);
      
      setQuestionSets(prev => prev.map(set => 
        set.id === setId ? {
          ...set,
          questions: [...set.questions, ...newQuestions] as Question[],
          updatedAt: new Date(),
        } as QuestionSet : set
      ));
      
      toast({
        title: "Success",
        description: "Questions added successfully",
        variant: "default",
      });
      
      return updatedSet;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add questions'));
      toast({
        title: "Error",
        description: "Failed to add questions to set",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Update questions in a set
  const updateQuestionsInSet = async (setId: string, updatedQuestions: Question[]) => {
    try {
      const existingSet = questionSets.find(set => set.id === setId);
      if (!existingSet) {
        throw new Error("Question set not found");
      }
      
      const updatedSet = await questionService.updateQuestionsInSet(setId, updatedQuestions);
      
      setQuestionSets(prev => prev.map(set => 
        set.id === setId ? {
          ...set,
          questions: updatedQuestions as Question[],
          updatedAt: new Date(),
        } as QuestionSet : set
      ));
      
      toast({
        title: "Success",
        description: "Questions updated successfully",
        variant: "default",
      });
      
      return updatedSet;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update questions'));
      toast({
        title: "Error",
        description: "Failed to update questions in set",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Remove questions from a set
  const removeQuestionsFromSet = async (setId: string, questionIds: string[]) => {
    try {
      const existingSet = questionSets.find(set => set.id === setId);
      if (!existingSet) {
        throw new Error("Question set not found");
      }
      
      await questionService.removeQuestionsFromSet(setId, questionIds);
      
      setQuestionSets(prev => prev.map(set => 
        set.id === setId ? {
          ...set,
          questions: set.questions.filter(q => !questionIds.includes(q.id)) as Question[],
          updatedAt: new Date(),
        } as QuestionSet : set
      ));
      
      toast({
        title: "Success",
        description: "Questions removed successfully",
        variant: "default",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove questions'));
      toast({
        title: "Error",
        description: "Failed to remove questions from set",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Save quiz attempt
  const saveQuizAttempt = async (quizData: any) => {
    try {
      const result = await questionService.saveQuizAttempt(quizData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save quiz attempt'));
      toast({
        title: "Error",
        description: "Failed to save quiz attempt",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Load user's quiz attempts
  const loadQuizAttempts = async () => {
    try {
      if (user) {
        const attempts = await questionService.getQuestionAttempts(user.id);
        return attempts;
      }
      return [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load quiz attempts'));
      toast({
        title: "Error", 
        description: "Failed to load quiz attempts",
        variant: "destructive",
      });
      return [];
    }
  };
  
  return {
    questions,
    questionSets,
    selectedSet,
    currentQuestion,
    answers,
    score,
    loading,
    error,
    setSelectedSet,
    setCurrentQuestion,
    setAnswers,
    setScore,
    createQuestionSet,
    updateQuestionSet,
    deleteQuestionSet,
    addQuestionsToSet,
    updateQuestionsInSet,
    removeQuestionsFromSet,
    saveQuizAttempt,
    loadQuizAttempts
  };
}

export default useMultipleChoice;
