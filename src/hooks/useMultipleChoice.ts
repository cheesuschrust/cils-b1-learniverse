
import { useState, useCallback, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { v4 as uuidv4 } from 'uuid';
import { MultipleChoiceQuestion, QuestionSet, QuizAttempt } from '@/types/question.d';
import { useToast } from '@/components/ui/use-toast';

// Mock data for question sets
const mockQuestionSets: QuestionSet[] = [
  {
    id: "set1",
    title: "Basic Italian Greetings",
    description: "Test your knowledge of common Italian greetings and phrases",
    questions: [
      {
        id: "q1",
        question: "What is the Italian word for 'hello'?",
        options: ['Ciao', 'Grazie', 'Arrivederci', 'Scusa'],
        correctAnswer: 'Ciao',
        explanation: 'Ciao is an informal greeting in Italian, similar to "hi" or "hello" in English.',
        difficulty: 'Beginner',
        category: 'Greetings',
        language: 'english'
      },
      {
        id: "q2",
        question: "Which of these is the correct translation of 'good morning' in Italian?",
        options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'],
        correctAnswer: 'Buongiorno',
        explanation: 'Buongiorno literally means "good day" and is used as "good morning" in Italian.',
        difficulty: 'Beginner',
        category: 'Greetings',
        language: 'english'
      },
      {
        id: "q3",
        question: "What is the Italian word for 'goodbye'?",
        options: ['Arrivederci', 'Grazie', 'Prego', 'Scusa'],
        correctAnswer: 'Arrivederci',
        explanation: 'Arrivederci is a formal way to say goodbye in Italian.',
        difficulty: 'Beginner',
        category: 'Greetings',
        language: 'english'
      },
      {
        id: "q4",
        question: "Which of these means 'please' in Italian?",
        options: ['Prego', 'Grazie', 'Scusa', 'Ciao'],
        correctAnswer: 'Prego',
        explanation: 'Prego can mean "please", "you\'re welcome", or "after you" depending on context.',
        difficulty: 'Beginner',
        category: 'Common Phrases',
        language: 'english'
      },
      {
        id: "q5",
        question: "What is the Italian word for 'thank you'?",
        options: ['Grazie', 'Prego', 'Scusa', 'Per favore'],
        correctAnswer: 'Grazie',
        explanation: 'Grazie is the Italian word for "thank you".',
        difficulty: 'Beginner',
        category: 'Common Phrases',
        language: 'english'
      }
    ],
    category: 'Basics',
    difficulty: 'Beginner',
    language: 'english',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: "set2",
    title: "Italian Numbers 1-10",
    description: "Learn to count from 1 to 10 in Italian",
    questions: [
      {
        id: "q6",
        question: "What is the Italian word for 'one'?",
        options: ['Uno', 'Due', 'Tre', 'Quattro'],
        correctAnswer: 'Uno',
        explanation: 'Uno is the Italian word for "one".',
        difficulty: 'Beginner',
        category: 'Numbers',
        language: 'english'
      },
      {
        id: "q7",
        question: "What is the Italian word for 'five'?",
        options: ['Cinque', 'Sei', 'Sette', 'Otto'],
        correctAnswer: 'Cinque',
        explanation: 'Cinque is the Italian word for "five".',
        difficulty: 'Beginner',
        category: 'Numbers',
        language: 'english'
      },
      {
        id: "q8",
        question: "What is the Italian word for 'ten'?",
        options: ['Dieci', 'Nove', 'Otto', 'Sette'],
        correctAnswer: 'Dieci',
        explanation: 'Dieci is the Italian word for "ten".',
        difficulty: 'Beginner',
        category: 'Numbers',
        language: 'english'
      }
    ],
    category: 'Numbers',
    difficulty: 'Beginner',
    language: 'english',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-12')
  },
  {
    id: "set3",
    title: "Italian Food and Dining",
    description: "Learn essential vocabulary for ordering food in Italian",
    questions: [
      {
        id: "q9",
        question: "What does 'il ristorante' mean?",
        options: ['The restaurant', 'The menu', 'The waiter', 'The bill'],
        correctAnswer: 'The restaurant',
        explanation: 'Il ristorante is the Italian word for "the restaurant".',
        difficulty: 'Intermediate',
        category: 'Food',
        language: 'english'
      },
      {
        id: "q10",
        question: "What is 'pasta' in Italian?",
        options: ['Pasta', 'Pane', 'Pizza', 'Pesce'],
        correctAnswer: 'Pasta',
        explanation: 'Pasta in Italian is the same as in English, though the pronunciation differs slightly.',
        difficulty: 'Beginner',
        category: 'Food',
        language: 'english'
      },
      {
        id: "q11",
        question: "How would you ask for the bill in Italian?",
        options: ['Il conto, per favore', 'Il menu, per favore', 'Buon appetito', 'Mi scusi'],
        correctAnswer: 'Il conto, per favore',
        explanation: '"Il conto, per favore" means "The bill, please" in Italian.',
        difficulty: 'Intermediate',
        category: 'Restaurant Phrases',
        language: 'english'
      }
    ],
    category: 'Food',
    difficulty: 'Intermediate',
    language: 'english',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-25')
  }
];

// Mock data for quiz attempts
const mockAttempts: QuizAttempt[] = [
  {
    id: "attempt1",
    userId: "user123",
    questionSetId: "set1",
    score: 4,
    totalQuestions: 5,
    completedAt: new Date('2023-05-10'),
    timeSpent: 120 // in seconds
  },
  {
    id: "attempt2",
    userId: "user123",
    questionSetId: "set2",
    score: 3,
    totalQuestions: 3,
    completedAt: new Date('2023-05-15'),
    timeSpent: 90 // in seconds
  }
];

export const useMultipleChoice = () => {
  const [availableSets, setAvailableSets] = useState<QuestionSet[]>(mockQuestionSets);
  const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(mockAttempts);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { language, difficulty, preferredLanguage } = useUserPreferences();
  const { isAIEnabled } = useAIUtils();

  const currentQuestion = currentSet && currentSet.questions[currentQuestionIndex];

  // Start a quiz from a specific question set
  const startQuiz = useCallback((setId: string) => {
    const selectedSet = availableSets.find(set => set.id === setId);
    if (selectedSet) {
      setCurrentSet(selectedSet);
      setCurrentQuestionIndex(0);
      setCorrectAnswers(0);
      setIncorrectAnswers(0);
      setQuizFinished(false);
      setIsSubmitted(false);
      setSelectedOption('');
      setShowExplanation(false);
    } else {
      toast({
        title: "Error",
        description: `Question set with ID ${setId} not found.`,
        variant: "destructive"
      });
    }
  }, [availableSets, toast]);

  // Handle selection of an option
  const handleOptionSelect = useCallback((option: string) => {
    if (!isSubmitted) {
      setSelectedOption(option);
    }
  }, [isSubmitted]);

  // Submit an answer
  const handleSubmit = useCallback(() => {
    if (!selectedOption || isSubmitted || !currentQuestion) return;

    setIsSubmitted(true);

    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
        variant: "default"
      });
    } else {
      setIncorrectAnswers(prev => prev + 1);
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentQuestion.correctAnswer}`,
        variant: "destructive"
      });
    }
  }, [selectedOption, isSubmitted, currentQuestion, toast]);

  // Move to the next question
  const handleNext = useCallback(() => {
    if (!currentSet) return;

    if (currentQuestionIndex < currentSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsSubmitted(false);
      setSelectedOption('');
      setShowExplanation(false);
    } else {
      // Quiz finished
      setQuizFinished(true);

      // Save the attempt
      const newAttempt: QuizAttempt = {
        id: uuidv4(),
        userId: "user123", // This would come from authentication in a real app
        questionSetId: currentSet.id,
        score: correctAnswers,
        totalQuestions: currentSet.questions.length,
        completedAt: new Date(),
        timeSpent: 0 // Would track actual time in a real app
      };

      setAttempts(prev => [...prev, newAttempt]);
    }
  }, [currentSet, currentQuestionIndex, correctAnswers]);

  // Toggle explanation visibility
  const toggleExplanation = useCallback(() => {
    setShowExplanation(prev => !prev);
  }, []);

  // Restart the current quiz
  const restartQuiz = useCallback(() => {
    if (currentSet) {
      startQuiz(currentSet.id);
    }
  }, [currentSet, startQuiz]);

  // Generate questions using AI (for the default implementation without AI)
  const generateQuestions = useCallback(async (topic: string, count: number = 5) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isAIEnabled) {
        throw new Error('AI features are disabled. Enable them in settings to generate questions.');
      }
      
      // In a real app, this would call an AI service to generate questions
      // For now, we'll simulate a delay and return mock questions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock questions based on language preference
      const filteredSets = mockQuestionSets.filter(set => {
        if (preferredLanguage === 'english') return set.language === 'english';
        if (preferredLanguage === 'italian') return set.language === 'italian';
        return true; // 'both'
      });
      
      if (filteredSets.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredSets.length);
        startQuiz(filteredSets[randomIndex].id);
        toast({
          title: "Questions Generated",
          description: `Generated ${filteredSets[randomIndex].questions.length} questions about ${filteredSets[randomIndex].title}`,
        });
      } else {
        throw new Error(`No question sets available for language: ${preferredLanguage}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate questions';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAIEnabled, preferredLanguage, startQuiz, toast]);

  // Get current progress information
  const progress = {
    current: currentQuestionIndex + 1,
    total: currentSet?.questions.length || 0,
    percentage: currentSet?.questions.length ? 
      ((currentQuestionIndex + 1) / currentSet.questions.length) * 100 : 0
  };

  // Check if the quiz is complete
  const isComplete = quizFinished;

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    return currentSet?.questions[currentQuestionIndex];
  }, [currentSet, currentQuestionIndex]);

  // Get quiz results
  const getResults = useCallback(() => {
    if (!currentSet) return null;
    
    return {
      totalQuestions: currentSet.questions.length,
      correctAnswers: correctAnswers,
      incorrectAnswers: incorrectAnswers,
      score: (correctAnswers / currentSet.questions.length) * 100,
      setPassed: (correctAnswers / currentSet.questions.length) >= 0.7 // 70% pass threshold
    };
  }, [currentSet, correctAnswers, incorrectAnswers]);

  return {
    questions: currentSet?.questions || [],
    currentQuestionIndex,
    userAnswers: [], // We're using selectedOption instead
    isLoading,
    error,
    generateQuestions,
    submitAnswer: handleSubmit,
    getCurrentQuestion,
    getResults,
    reset: restartQuiz,
    progress,
    isComplete,
    // Additional properties needed by the MultipleChoice.tsx component
    availableSets,
    currentSet,
    selectedOption,
    isSubmitted,
    correctAnswers,
    incorrectAnswers,
    quizFinished,
    showExplanation,
    attempts,
    startQuiz,
    handleOptionSelect,
    handleSubmit,
    handleNext,
    restartQuiz,
    toggleExplanation,
    currentQuestion
  };
};

export default useMultipleChoice;
