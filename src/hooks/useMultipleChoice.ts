
import { useState, useEffect } from 'react';
import { QuestionSet, MultipleChoiceQuestion, QuizAttempt } from '@/types/question';
import { useAuth } from '@/contexts/AuthContext';

// Sample data for demonstration
const sampleQuestionSets: QuestionSet[] = [
  {
    id: "italian-basics",
    title: "Italian Basics Quiz",
    description: "Test your knowledge of basic Italian vocabulary and phrases.",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the Italian word for 'hello'?",
        options: ["Ciao", "Arrivederci", "Grazie", "Prego"],
        correctAnswer: "Ciao",
        explanation: "Ciao is a casual greeting in Italian, equivalent to 'hello' or 'hi' in English.",
        difficulty: "Beginner",
        category: "Vocabulary",
        tags: ["greeting", "basic"],
        createdAt: new Date(),
        updatedAt: new Date(),
        language: "english"
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Which of these is NOT an Italian word for a type of pasta?",
        options: ["Spaghetti", "Penne", "Panini", "Linguine"],
        correctAnswer: "Panini",
        explanation: "Panini is actually the Italian word for sandwiches. The other options are all types of pasta.",
        difficulty: "Beginner",
        category: "Food",
        tags: ["food", "pasta"],
        createdAt: new Date(),
        updatedAt: new Date(),
        language: "english"
      }
    ],
    category: "Vocabulary",
    difficulty: "Beginner",
    language: "english",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "italian-grammar",
    title: "Italian Grammar Quiz",
    description: "Test your knowledge of Italian grammar rules.",
    questions: [
      {
        id: "q3",
        type: "multiple-choice",
        question: "Which article would you use with the feminine noun 'casa'?",
        options: ["Il", "Lo", "La", "I"],
        correctAnswer: "La",
        explanation: "'La' is the feminine definite article used before singular feminine nouns.",
        difficulty: "Beginner",
        category: "Grammar",
        tags: ["articles", "grammar"],
        createdAt: new Date(),
        updatedAt: new Date(),
        language: "english"
      }
    ],
    category: "Grammar",
    difficulty: "Beginner",
    language: "english",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample quiz attempts
const sampleQuizAttempts: QuizAttempt[] = [];

const useMultipleChoice = () => {
  const { user } = useAuth();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(sampleQuestionSets);
  const [currentSet, setCurrentSet] = useState<QuestionSet>(sampleQuestionSets[0]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(sampleQuizAttempts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load question sets
  useEffect(() => {
    // In a real app, this would fetch from an API
    setQuestionSets(sampleQuestionSets);
  }, []);

  // Get a question set by ID
  const getQuestionSetById = (id: string): QuestionSet | undefined => {
    return questionSets.find(set => set.id === id);
  };

  // Save a quiz attempt
  const saveQuizAttempt = (attempt: Omit<QuizAttempt, 'createdAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      createdAt: new Date()
    };
    
    setQuizAttempts(prev => [newAttempt, ...prev]);
    return newAttempt;
  };

  // Get quiz attempts for the current user
  const getUserQuizAttempts = (): QuizAttempt[] => {
    if (!user) return [];
    return quizAttempts.filter(attempt => attempt.userId === user.id);
  };

  // Get quiz attempts for a specific set
  const getQuizAttemptsForSet = (setId: string): QuizAttempt[] => {
    return quizAttempts.filter(attempt => attempt.questionSetId === setId);
  };

  // Generate a new question set
  const generateQuestionSet = async (
    category: string, 
    difficulty: "Beginner" | "Intermediate" | "Advanced",
    count: number = 5
  ): Promise<QuestionSet> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would call an API to generate questions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a simple mock question set
      const newQuestions: MultipleChoiceQuestion[] = Array.from({ length: count }, (_, i) => ({
        id: `gen-q-${Date.now()}-${i}`,
        type: "multiple-choice",
        question: `Generated question ${i + 1} about ${category}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "This is a generated explanation.",
        difficulty,
        category,
        tags: [category.toLowerCase(), difficulty.toLowerCase()],
        createdAt: new Date(),
        updatedAt: new Date(),
        language: "english"
      }));
      
      const newSet: QuestionSet = {
        id: `gen-${Date.now()}`,
        title: `${category} ${difficulty} Quiz`,
        description: `Generated quiz about ${category} for ${difficulty} level students.`,
        questions: newQuestions,
        category,
        difficulty,
        language: "english",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to the question sets
      setQuestionSets(prev => [...prev, newSet]);
      
      return newSet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate question set';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questionSets,
    currentSet,
    setCurrentSet,
    quizAttempts,
    isLoading,
    error,
    getQuestionSetById,
    saveQuizAttempt,
    getUserQuizAttempts,
    getQuizAttemptsForSet,
    generateQuestionSet
  };
};

export { useMultipleChoice };
