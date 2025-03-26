
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { generateQuestionSet } from '@/services/questionService';

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'english' | 'italian';
  questions: MultipleChoiceQuestion[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  authorId?: string;
  authorName?: string;
  tags?: string[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  date: Date;
  score: number;
  questionCount: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  answeredQuestions: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeTaken?: number; // in seconds
  }[];
}

export function useMultipleChoice() {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const { toast } = useToast();

  // Load question sets from local storage
  useEffect(() => {
    try {
      const savedSets = localStorage.getItem('questionSets');
      if (savedSets) {
        setQuestionSets(JSON.parse(savedSets));
      }

      const savedAttempts = localStorage.getItem('quizAttempts');
      if (savedAttempts) {
        setQuizAttempts(JSON.parse(savedAttempts));
      }
    } catch (error) {
      console.error('Error loading question sets:', error);
    }
  }, []);

  // Save question sets to local storage when updated
  useEffect(() => {
    try {
      localStorage.setItem('questionSets', JSON.stringify(questionSets));
    } catch (error) {
      console.error('Error saving question sets:', error);
    }
  }, [questionSets]);

  // Save quiz attempts to local storage when updated
  useEffect(() => {
    try {
      localStorage.setItem('quizAttempts', JSON.stringify(quizAttempts));
    } catch (error) {
      console.error('Error saving quiz attempts:', error);
    }
  }, [quizAttempts]);

  const createQuestionSet = useCallback((
    title: string,
    description: string,
    category: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
    language: 'english' | 'italian',
    questions: MultipleChoiceQuestion[],
    isPublic: boolean = false,
    authorId?: string,
    authorName?: string,
    tags?: string[]
  ) => {
    const newSet: QuestionSet = {
      id: uuidv4(),
      title,
      description,
      category,
      difficulty,
      language,
      questions,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic,
      authorId,
      authorName,
      tags,
    };

    setQuestionSets((prevSets) => [...prevSets, newSet]);
    return newSet;
  }, []);

  const updateQuestionSet = useCallback((
    id: string,
    updates: Partial<Omit<QuestionSet, 'id' | 'createdAt'>>
  ) => {
    setQuestionSets((prevSets) => {
      const newSets = [...prevSets];
      const index = newSets.findIndex(set => set.id === id);
      
      if (index !== -1) {
        newSets[index] = {
          ...newSets[index],
          ...updates,
          updatedAt: new Date()
        };
      }
      
      return newSets;
    });
  }, []);

  const deleteQuestionSet = useCallback((id: string) => {
    setQuestionSets((prevSets) => 
      prevSets.filter(set => set.id !== id)
    );
    
    // Also delete associated quiz attempts
    setQuizAttempts((prevAttempts) => 
      prevAttempts.filter(attempt => attempt.quizId !== id)
    );
  }, []);

  const addQuestionToSet = useCallback((
    setId: string,
    question: Omit<MultipleChoiceQuestion, 'id'>
  ) => {
    const newQuestion: MultipleChoiceQuestion = {
      id: uuidv4(),
      ...question
    };

    setQuestionSets((prevSets) => {
      const newSets = [...prevSets];
      const index = newSets.findIndex(set => set.id === setId);
      
      if (index !== -1) {
        newSets[index] = {
          ...newSets[index],
          questions: [...newSets[index].questions, newQuestion],
          updatedAt: new Date()
        };
      }
      
      return newSets;
    });

    return newQuestion;
  }, []);

  const updateQuestion = useCallback((
    setId: string,
    questionId: string,
    updates: Partial<Omit<MultipleChoiceQuestion, 'id'>>
  ) => {
    setQuestionSets((prevSets) => {
      const newSets = [...prevSets];
      const setIndex = newSets.findIndex(set => set.id === setId);
      
      if (setIndex !== -1) {
        const questionIndex = newSets[setIndex].questions.findIndex(q => q.id === questionId);
        
        if (questionIndex !== -1) {
          const updatedQuestions = [...newSets[setIndex].questions];
          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            ...updates
          };
          
          newSets[setIndex] = {
            ...newSets[setIndex],
            questions: updatedQuestions,
            updatedAt: new Date()
          };
        }
      }
      
      return newSets;
    });
  }, []);

  const removeQuestion = useCallback((
    setId: string,
    questionId: string
  ) => {
    setQuestionSets((prevSets) => {
      const newSets = [...prevSets];
      const setIndex = newSets.findIndex(set => set.id === setId);
      
      if (setIndex !== -1) {
        newSets[setIndex] = {
          ...newSets[setIndex],
          questions: newSets[setIndex].questions.filter(q => q.id !== questionId),
          updatedAt: new Date()
        };
      }
      
      return newSets;
    });
  }, []);

  const generateQuestions = useCallback(async (
    category: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
    language: 'english' | 'italian' = 'english',
    count: number = 5
  ): Promise<MultipleChoiceQuestion[]> => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuestionSet(
        category,
        difficulty,
        language,
        count
      );
      
      const formattedQuestions: MultipleChoiceQuestion[] = generatedQuestions.map(q => ({
        id: uuidv4(),
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation
      }));
      
      setIsLoading(false);
      return formattedQuestions;
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate questions. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);

  const saveQuizAttempt = useCallback((
    quizId: string,
    score: number,
    questionCount: number,
    correctAnswers: number,
    timeSpent: number,
    answeredQuestions: {
      questionId: string;
      selectedAnswer: number;
      isCorrect: boolean;
      timeTaken?: number;
    }[]
  ) => {
    const newAttempt: QuizAttempt = {
      id: uuidv4(),
      quizId,
      date: new Date(),
      score,
      questionCount,
      correctAnswers,
      timeSpent,
      answeredQuestions
    };
    
    setQuizAttempts((prevAttempts) => [...prevAttempts, newAttempt]);
    
    toast({
      title: 'Quiz Completed',
      description: `You scored ${score.toFixed(1)}% (${correctAnswers}/${questionCount})`,
    });
    
    return newAttempt;
  }, [toast]);

  const getQuizAttemptsForSet = useCallback((setId: string) => {
    return quizAttempts.filter(attempt => attempt.quizId === setId);
  }, [quizAttempts]);

  return {
    questionSets,
    currentSet,
    setCurrentSet,
    isLoading,
    quizAttempts,
    createQuestionSet,
    updateQuestionSet,
    deleteQuestionSet,
    addQuestionToSet,
    updateQuestion,
    removeQuestion,
    generateQuestions,
    saveQuizAttempt,
    getQuizAttemptsForSet
  };
}
