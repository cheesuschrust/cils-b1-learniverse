
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: number;
}

export const getDailyQuestion = async (): Promise<Question> => {
  // This would typically fetch from your backend
  // For now, return a mock question
  return {
    id: '1',
    text: 'What is the correct form of "to be" for "io" (I) in Italian?',
    options: ['sono', 'sei', 'è', 'siamo'],
    correctAnswer: 'sono',
    category: 'Grammar',
    difficulty: 1
  };
};

export const submitAnswer = async (questionId: string, answer: string) => {
  // This would typically send to your backend
  return {
    correct: answer === 'sono',
    xpEarned: 10,
    streakMaintained: true
  };
};

export const getDailyLimit = async (): Promise<boolean> => {
  // Check if user has reached their daily limit
  return false;
};
