
// Question Types
export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'Beginner' | 'Intermediate' | 'Advanced';
export type QuestionLanguage = 'italian' | 'english' | 'both';
export type QuestionCategory = 
  | 'vocabulary' 
  | 'grammar' 
  | 'conversation' 
  | 'culture' 
  | 'mixed'
  | 'Greetings'
  | 'Food'
  | 'Basics';

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
  language?: 'english' | 'italian';
}

export interface MultipleChoiceQuestion extends Question {
  type: 'multiple-choice';
}

export interface QuestionSet {
  id: string;
  name: string;
  title?: string; // Added for compatibility
  description?: string;
  language: QuestionLanguage;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  isPublic: boolean;
  attempts?: number; // Added for compatibility
  bestScore?: number; // Added for compatibility
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
  questionSets?: QuestionSet[]; // Added for compatibility
}
