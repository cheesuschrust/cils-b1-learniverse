
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MultipleChoiceQuestion, QuestionSet, QuizAttempt, QuizStats } from '@/types/question';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { v4 as uuidv4 } from 'uuid';

export interface UseMultipleChoiceReturn {
  questionSets: QuestionSet[];
  saveQuestionSet: (set: QuestionSet) => QuestionSet;
  deleteQuestionSet: (id: string) => void;
  updateQuestionSet: (id: string, updates: Partial<QuestionSet>) => void;
  getQuestionSetById: (id: string) => QuestionSet | undefined;
  
  quizAttempts: QuizAttempt[];
  saveQuizAttempt: (attempt: QuizAttempt) => QuizAttempt;
  deleteQuizAttempt: (id: string) => void;
  
  getQuizStats: () => QuizStats;
  getQuestionSetStats: (setId: string) => {
    attempts: number;
    bestScore: number;
    averageScore: number;
    lastAttempt?: Date;
  };
}

export const useMultipleChoice = (): UseMultipleChoiceReturn => {
  const { toast } = useToast();
  const { isAIEnabled } = useAIUtils();
  
  // State for question sets and quiz attempts
  const [questionSets, setQuestionSets] = useLocalStorage<QuestionSet[]>('question-sets', []);
  const [quizAttempts, setQuizAttempts] = useLocalStorage<QuizAttempt[]>('quiz-attempts', []);
  
  // Save a question set
  const saveQuestionSet = useCallback((set: QuestionSet): QuestionSet => {
    try {
      const newSet = {
        ...set,
        id: set.id || uuidv4(),
        createdAt: set.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      setQuestionSets(prev => {
        const existing = prev.findIndex(s => s.id === newSet.id);
        if (existing >= 0) {
          // Update existing set
          const updated = [...prev];
          updated[existing] = newSet;
          return updated;
        } else {
          // Add new set
          return [...prev, newSet];
        }
      });
      
      toast({
        title: "Question Set Saved",
        description: `Successfully saved "${set.title}"`,
      });
      
      return newSet;
    } catch (error) {
      console.error("Error saving question set:", error);
      toast({
        title: "Error Saving Question Set",
        description: "There was a problem saving the question set.",
        variant: "destructive"
      });
      throw error;
    }
  }, [setQuestionSets, toast]);
  
  // Delete a question set
  const deleteQuestionSet = useCallback((id: string) => {
    try {
      setQuestionSets(prev => prev.filter(set => set.id !== id));
      
      toast({
        title: "Question Set Deleted",
        description: "The question set has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting question set:", error);
      toast({
        title: "Error Deleting Question Set",
        description: "There was a problem deleting the question set.",
        variant: "destructive"
      });
    }
  }, [setQuestionSets, toast]);
  
  // Update a question set
  const updateQuestionSet = useCallback((id: string, updates: Partial<QuestionSet>) => {
    try {
      setQuestionSets(prev => prev.map(set => 
        set.id === id
          ? { ...set, ...updates, updatedAt: new Date() }
          : set
      ));
    } catch (error) {
      console.error("Error updating question set:", error);
      toast({
        title: "Error Updating Question Set",
        description: "There was a problem updating the question set.",
        variant: "destructive"
      });
    }
  }, [setQuestionSets, toast]);
  
  // Get a question set by ID
  const getQuestionSetById = useCallback((id: string) => {
    return questionSets.find(set => set.id === id);
  }, [questionSets]);
  
  // Save a quiz attempt
  const saveQuizAttempt = useCallback((attempt: QuizAttempt): QuizAttempt => {
    try {
      const newAttempt = {
        ...attempt,
        id: attempt.id || uuidv4(),
        completedAt: attempt.completedAt || new Date()
      };
      
      setQuizAttempts(prev => [...prev, newAttempt]);
      
      toast({
        title: "Quiz Attempt Saved",
        description: `Your score: ${attempt.score} out of ${attempt.totalQuestions}`,
      });
      
      return newAttempt;
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      toast({
        title: "Error Saving Quiz Attempt",
        description: "There was a problem saving your quiz attempt.",
        variant: "destructive"
      });
      throw error;
    }
  }, [setQuizAttempts, toast]);
  
  // Delete a quiz attempt
  const deleteQuizAttempt = useCallback((id: string) => {
    try {
      setQuizAttempts(prev => prev.filter(attempt => attempt.id !== id));
      
      toast({
        title: "Quiz Attempt Deleted",
        description: "The quiz attempt has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting quiz attempt:", error);
      toast({
        title: "Error Deleting Quiz Attempt",
        description: "There was a problem deleting the quiz attempt.",
        variant: "destructive"
      });
    }
  }, [setQuizAttempts, toast]);
  
  // Calculate quiz statistics
  const getQuizStats = useCallback((): QuizStats => {
    try {
      if (quizAttempts.length === 0) {
        return {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalTimeSpent: 0,
          questionSets: []
        };
      }
      
      // Total attempts
      const totalAttempts = quizAttempts.length;
      
      // Calculate average score (as a decimal from 0-1)
      const totalScorePercentage = quizAttempts.reduce((acc, attempt) => {
        return acc + (attempt.score / attempt.totalQuestions);
      }, 0);
      const averageScore = totalScorePercentage / totalAttempts;
      
      // Best score (as a decimal from 0-1)
      const bestScore = Math.max(...quizAttempts.map(attempt => attempt.score / attempt.totalQuestions));
      
      // Total time spent in seconds
      const totalTimeSpent = quizAttempts.reduce((acc, attempt) => acc + (attempt.timeSpent || 0), 0);
      
      // Group attempts by question set and calculate stats
      const setStats: Record<string, { 
        attempts: number;
        bestScore: number;
        averageScore: number;
        title: string;
      }> = {};
      
      quizAttempts.forEach(attempt => {
        const set = questionSets.find(s => s.id === attempt.questionSetId);
        
        if (set) {
          if (!setStats[set.id]) {
            setStats[set.id] = {
              attempts: 0,
              bestScore: 0,
              averageScore: 0,
              title: set.title
            };
          }
          
          const stats = setStats[set.id];
          stats.attempts += 1;
          stats.bestScore = Math.max(stats.bestScore, attempt.score / attempt.totalQuestions);
          stats.averageScore += attempt.score / attempt.totalQuestions;
        }
      });
      
      // Calculate averages for each set
      Object.values(setStats).forEach(stats => {
        stats.averageScore /= stats.attempts;
      });
      
      // Format data for return
      const questionSetStats = Object.entries(setStats).map(([id, stats]) => ({
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
    } catch (error) {
      console.error("Error calculating quiz stats:", error);
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        questionSets: []
      };
    }
  }, [quizAttempts, questionSets]);
  
  // Get statistics for a specific question set
  const getQuestionSetStats = useCallback((setId: string) => {
    try {
      const setAttempts = quizAttempts.filter(attempt => attempt.questionSetId === setId);
      
      if (setAttempts.length === 0) {
        return {
          attempts: 0,
          bestScore: 0,
          averageScore: 0
        };
      }
      
      const attempts = setAttempts.length;
      
      const bestScore = Math.max(...setAttempts.map(attempt => attempt.score / attempt.totalQuestions));
      
      const totalScorePercentage = setAttempts.reduce((acc, attempt) => {
        return acc + (attempt.score / attempt.totalQuestions);
      }, 0);
      
      const averageScore = totalScorePercentage / attempts;
      
      const lastAttempt = new Date(Math.max(...setAttempts.map(a => new Date(a.completedAt).getTime())));
      
      return {
        attempts,
        bestScore,
        averageScore,
        lastAttempt
      };
    } catch (error) {
      console.error("Error calculating question set stats:", error);
      return {
        attempts: 0,
        bestScore: 0,
        averageScore: 0
      };
    }
  }, [quizAttempts]);
  
  // Initialize with sample data if needed
  useEffect(() => {
    if (questionSets.length === 0) {
      // Create a sample question set
      const sampleSet: QuestionSet = {
        id: uuidv4(),
        title: "Italian Basics",
        description: "Basic vocabulary and common phrases",
        questions: [
          {
            id: uuidv4(),
            question: "How do you say 'hello' in Italian?",
            options: ["Ciao", "Grazie", "Arrivederci", "Prego"],
            correctAnswer: "Ciao",
            explanation: "'Ciao' means 'hello' or 'goodbye' in Italian.",
            difficulty: "Beginner",
            category: "Greetings",
            language: "english"
          },
          {
            id: uuidv4(),
            question: "How do you say 'thank you' in Italian?",
            options: ["Ciao", "Grazie", "Arrivederci", "Prego"],
            correctAnswer: "Grazie",
            explanation: "'Grazie' means 'thank you' in Italian.",
            difficulty: "Beginner",
            category: "Greetings",
            language: "english"
          },
          {
            id: uuidv4(),
            question: "How do you say 'goodbye' in Italian?",
            options: ["Ciao", "Grazie", "Arrivederci", "Prego"],
            correctAnswer: "Arrivederci",
            explanation: "'Arrivederci' means 'goodbye' in Italian. 'Ciao' can also be used for 'goodbye' in informal situations.",
            difficulty: "Beginner",
            category: "Greetings",
            language: "english"
          }
        ],
        category: "Vocabulary",
        difficulty: "Beginner",
        language: "english",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      saveQuestionSet(sampleSet);
    }
  }, [questionSets.length, saveQuestionSet]);
  
  return {
    questionSets,
    saveQuestionSet,
    deleteQuestionSet,
    updateQuestionSet,
    getQuestionSetById,
    
    quizAttempts,
    saveQuizAttempt,
    deleteQuizAttempt,
    
    getQuizStats,
    getQuestionSetStats
  };
};

export default useMultipleChoice;
