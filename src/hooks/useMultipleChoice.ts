
import { useState, useEffect, useMemo } from 'react';
import { MultipleChoiceQuestion, QuestionSet, QuizAttempt, QuizStats, QuestionDifficulty, QuestionCategory } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_QUESTION_SETS: QuestionSet[] = [
  {
    id: '1',
    title: 'Italian Food Vocabulary',
    description: 'Basic food vocabulary for beginners',
    questions: [
      {
        id: '1-1',
        type: 'multiple-choice',
        question: 'What is "pasta" in Italian?',
        options: ['Pasta', 'Bread', 'Rice', 'Soup'],
        correctAnswer: 'Pasta',
        explanation: 'Pasta is a type of Italian food typically made from durum wheat flour.',
        difficulty: 'Beginner',
        category: 'Food',
        tags: ['food', 'basic', 'italian'],
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'italian'
      }
    ],
    category: 'Food',
    difficulty: 'Beginner',
    createdAt: new Date(),
    updatedAt: new Date(),
    language: 'italian'
  }
];

export interface UseMultipleChoiceReturn {
  questionSets: QuestionSet[];
  createQuestionSet: (data: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>) => QuestionSet;
  updateQuestionSet: (id: string, data: Partial<QuestionSet>) => QuestionSet | null;
  deleteQuestionSet: (id: string) => boolean;
  
  createQuestion: (setId: string, data: Omit<MultipleChoiceQuestion, 'id' | 'createdAt' | 'updatedAt'>) => MultipleChoiceQuestion | null;
  updateQuestion: (setId: string, questionId: string, data: Partial<MultipleChoiceQuestion>) => MultipleChoiceQuestion | null;
  deleteQuestion: (setId: string, questionId: string) => boolean;
  
  quizAttempts: QuizAttempt[];
  saveQuizAttempt: (data: Omit<QuizAttempt, 'createdAt'>) => QuizAttempt;
  getQuizStats: () => QuizStats;
  saveQuestionSet: (questionSet: QuestionSet) => void;
  getQuestionSetById: (id: string) => QuestionSet | undefined;
}

export const useMultipleChoice = (): UseMultipleChoiceReturn => {
  const [questionSets, setQuestionSets] = useLocalStorage<QuestionSet[]>('multiple-choice-sets', DEFAULT_QUESTION_SETS);
  const [quizAttempts, setQuizAttempts] = useLocalStorage<QuizAttempt[]>('quiz-attempts', []);
  
  // Create a new question set
  const createQuestionSet = (data: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): QuestionSet => {
    const now = new Date();
    const newSet: QuestionSet = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setQuestionSets(prev => [...prev, newSet]);
    return newSet;
  };
  
  // Update an existing question set
  const updateQuestionSet = (id: string, data: Partial<QuestionSet>): QuestionSet | null => {
    let updatedSet: QuestionSet | null = null;
    
    setQuestionSets(prev => {
      const index = prev.findIndex(set => set.id === id);
      if (index === -1) return prev;
      
      const updatedSets = [...prev];
      updatedSets[index] = {
        ...updatedSets[index],
        ...data,
        updatedAt: new Date()
      };
      
      updatedSet = updatedSets[index];
      return updatedSets;
    });
    
    return updatedSet;
  };
  
  // Delete a question set
  const deleteQuestionSet = (id: string): boolean => {
    let success = false;
    
    setQuestionSets(prev => {
      const index = prev.findIndex(set => set.id === id);
      if (index === -1) return prev;
      
      success = true;
      const updatedSets = [...prev];
      updatedSets.splice(index, 1);
      return updatedSets;
    });
    
    return success;
  };
  
  // Create a new question in a set
  const createQuestion = (setId: string, data: Omit<MultipleChoiceQuestion, 'id' | 'createdAt' | 'updatedAt'>): MultipleChoiceQuestion | null => {
    let newQuestion: MultipleChoiceQuestion | null = null;
    
    setQuestionSets(prev => {
      const setIndex = prev.findIndex(set => set.id === setId);
      if (setIndex === -1) return prev;
      
      const now = new Date();
      newQuestion = {
        ...data,
        id: uuidv4(),
        type: 'multiple-choice',
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now
      };
      
      const updatedSets = [...prev];
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        questions: [...updatedSets[setIndex].questions, newQuestion],
        updatedAt: now
      };
      
      return updatedSets;
    });
    
    return newQuestion;
  };
  
  // Update an existing question
  const updateQuestion = (setId: string, questionId: string, data: Partial<MultipleChoiceQuestion>): MultipleChoiceQuestion | null => {
    let updatedQuestion: MultipleChoiceQuestion | null = null;
    
    setQuestionSets(prev => {
      const setIndex = prev.findIndex(set => set.id === setId);
      if (setIndex === -1) return prev;
      
      const questionIndex = prev[setIndex].questions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) return prev;
      
      const updatedSets = [...prev];
      updatedQuestion = {
        ...updatedSets[setIndex].questions[questionIndex],
        ...data,
        updatedAt: new Date()
      };
      
      const updatedQuestions = [...updatedSets[setIndex].questions];
      updatedQuestions[questionIndex] = updatedQuestion;
      
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        questions: updatedQuestions,
        updatedAt: new Date()
      };
      
      return updatedSets;
    });
    
    return updatedQuestion;
  };
  
  // Delete a question
  const deleteQuestion = (setId: string, questionId: string): boolean => {
    let success = false;
    
    setQuestionSets(prev => {
      const setIndex = prev.findIndex(set => set.id === setId);
      if (setIndex === -1) return prev;
      
      const questionIndex = prev[setIndex].questions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) return prev;
      
      success = true;
      const updatedSets = [...prev];
      const updatedQuestions = [...updatedSets[setIndex].questions];
      updatedQuestions.splice(questionIndex, 1);
      
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        questions: updatedQuestions,
        updatedAt: new Date()
      };
      
      return updatedSets;
    });
    
    return success;
  };
  
  // Save a quiz attempt
  const saveQuizAttempt = (data: Omit<QuizAttempt, 'createdAt'>): QuizAttempt => {
    const newAttempt: QuizAttempt = {
      ...data,
      answers: data.answers || {},
      completed: true,
      createdAt: new Date()
    };
    
    setQuizAttempts(prev => [...prev, newAttempt]);
    return newAttempt;
  };
  
  // Save a question set (for imported/generated sets)
  const saveQuestionSet = (questionSet: QuestionSet): void => {
    setQuestionSets(prev => {
      // Check if it already exists
      const existingIndex = prev.findIndex(set => set.id === questionSet.id);
      if (existingIndex >= 0) {
        // Update existing
        const updatedSets = [...prev];
        updatedSets[existingIndex] = {
          ...questionSet,
          updatedAt: new Date()
        };
        return updatedSets;
      } else {
        // Add new
        return [...prev, questionSet];
      }
    });
  };
  
  // Get a question set by ID
  const getQuestionSetById = (id: string): QuestionSet | undefined => {
    return questionSets.find(set => set.id === id);
  };
  
  // Calculate quiz statistics
  const getQuizStats = (): QuizStats => {
    if (quizAttempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        questionSets: []
      };
    }
    
    const totalAttempts = quizAttempts.length;
    const totalScore = quizAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.totalQuestions, 0);
    const averageScore = totalScore / totalAttempts;
    const bestScore = Math.max(...quizAttempts.map(attempt => attempt.score / attempt.totalQuestions));
    const totalTime = quizAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
    
    // Group attempts by question set
    const setAttempts: Record<string, {
      id: string;
      title: string;
      attempts: number;
      bestScore: number;
      totalScore: number;
    }> = {};
    
    quizAttempts.forEach(attempt => {
      const setId = attempt.questionSetId;
      const set = questionSets.find(s => s.id === setId);
      if (!set) return;
      
      if (!setAttempts[setId]) {
        setAttempts[setId] = {
          id: setId,
          title: set.title,
          attempts: 0,
          bestScore: 0,
          totalScore: 0
        };
      }
      
      const score = attempt.score / attempt.totalQuestions;
      setAttempts[setId].attempts++;
      setAttempts[setId].totalScore += score;
      setAttempts[setId].bestScore = Math.max(setAttempts[setId].bestScore, score);
    });
    
    const questionSetStats = Object.values(setAttempts).map(set => ({
      id: set.id,
      title: set.title,
      attempts: set.attempts,
      bestScore: set.bestScore,
      averageScore: set.totalScore / set.attempts
    }));
    
    return {
      totalAttempts,
      averageScore,
      bestScore,
      totalTime,
      questionSets: questionSetStats
    };
  };
  
  return {
    questionSets,
    createQuestionSet,
    updateQuestionSet,
    deleteQuestionSet,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    quizAttempts,
    saveQuizAttempt,
    getQuizStats,
    saveQuestionSet,
    getQuestionSetById
  };
};
