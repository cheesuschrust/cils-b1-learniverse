
// We need to create this file since it has an error but doesn't exist in the files provided
import { useState, useCallback } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAIUtils } from '@/contexts/AIUtilsContext';

interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export const useMultipleChoice = () => {
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use language preference from UserPreferencesContext
  const { language, difficulty, preferredLanguage } = useUserPreferences();
  const { isAIEnabled } = useAIUtils();
  
  const generateQuestions = useCallback(async (topic: string, count: number = 5) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isAIEnabled) {
        throw new Error('AI features are disabled. Enable them in settings to generate questions.');
      }
      
      // In a real app, this would call an AI service to generate questions
      // For now, we'll create mock questions
      const mockQuestions: MultipleChoiceQuestion[] = [
        {
          question: 'What is the Italian word for "hello"?',
          options: ['Ciao', 'Grazie', 'Arrivederci', 'Scusa'],
          correctAnswer: 'Ciao',
          explanation: 'Ciao is an informal greeting in Italian, similar to "hi" or "hello" in English.'
        },
        {
          question: 'Which of these is the correct translation of "good morning" in Italian?',
          options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'],
          correctAnswer: 'Buongiorno',
          explanation: 'Buongiorno literally means "good day" and is used as "good morning" in Italian.'
        },
        {
          question: 'What is the Italian word for "goodbye"?',
          options: ['Arrivederci', 'Grazie', 'Prego', 'Scusa'],
          correctAnswer: 'Arrivederci',
          explanation: 'Arrivederci is a formal way to say goodbye in Italian.'
        },
        {
          question: 'Which of these means "please" in Italian?',
          options: ['Prego', 'Grazie', 'Scusa', 'Ciao'],
          correctAnswer: 'Prego',
          explanation: 'Prego can mean "please", "you\'re welcome", or "after you" depending on context.'
        },
        {
          question: 'What is the Italian word for "thank you"?',
          options: ['Grazie', 'Prego', 'Scusa', 'Per favore'],
          correctAnswer: 'Grazie',
          explanation: 'Grazie is the Italian word for "thank you".'
        }
      ];
      
      // Adjust language of questions based on user preference
      const finalQuestions = preferredLanguage === 'english' 
        ? mockQuestions 
        : preferredLanguage === 'italian'
          ? mockQuestions.map(q => ({
              ...q,
              question: `[Italian translation of: "${q.question}"]`,
              explanation: q.explanation ? `[Italian translation of: "${q.explanation}"]` : undefined
            }))
          : mockQuestions;
      
      setQuestions(finalQuestions.slice(0, count));
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate questions');
      console.error('Error generating questions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAIEnabled, preferredLanguage]);
  
  const submitAnswer = useCallback((answer: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1000);
  }, [currentQuestionIndex, questions.length]);
  
  const getCurrentQuestion = useCallback(() => {
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);
  
  const getResults = useCallback(() => {
    let correct = 0;
    
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return {
      totalQuestions: questions.length,
      correctAnswers: correct,
      percentage: questions.length > 0 ? (correct / questions.length) * 100 : 0,
      answers: questions.map((question, index) => ({
        question: question.question,
        userAnswer: userAnswers[index] || '',
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswers[index] === question.correctAnswer,
        explanation: question.explanation
      }))
    };
  }, [questions, userAnswers]);
  
  const reset = useCallback(() => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setError(null);
  }, []);
  
  return {
    questions,
    currentQuestionIndex,
    userAnswers,
    isLoading,
    error,
    generateQuestions,
    submitAnswer,
    getCurrentQuestion,
    getResults,
    reset,
    progress: {
      current: currentQuestionIndex + 1,
      total: questions.length,
      percentage: questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
    },
    isComplete: userAnswers.length === questions.length && questions.length > 0
  };
};

export default useMultipleChoice;
