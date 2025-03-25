
// Question Types
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionLanguage = 'italian' | 'english' | 'both';
export type QuestionCategory = 'vocabulary' | 'grammar' | 'conversation' | 'culture' | 'mixed';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  audio?: string;
  image?: string;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MultipleChoiceQuestion extends Question {
  type: 'multiple-choice';
}

export interface QuestionSet {
  id: string;
  name: string;
  description?: string;
  language: QuestionLanguage;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  isPublic: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionSetId: string;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface QuizStats {
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  completionRate: number;
  questionAccuracy: Record<string, number>;
  categoryAccuracy: Record<QuestionCategory, number>;
  progressOverTime: {
    date: Date;
    score: number;
  }[];
}
