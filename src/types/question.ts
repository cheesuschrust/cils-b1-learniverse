
// Type definitions for questions across the app

export type QuestionType = 'multiple-choice' | 'text' | 'audio' | 'image' | 'matching' | 'fill-in-blank' | 'true-false';
export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type QuestionCategory = 
  | 'Vocabulary' 
  | 'Grammar' 
  | 'Reading' 
  | 'Listening' 
  | 'Speaking' 
  | 'Writing'
  | 'Culture'
  | 'Food'
  | 'Travel'
  | 'Business'
  | 'Medicine'
  | 'Technology'
  | string; // Allow custom categories

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
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
  options: string[];
  correctAnswer: string;
}

export interface TextQuestion extends Question {
  type: 'text';
  correctAnswer: string;
  acceptableAnswers?: string[];
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  questions: MultipleChoiceQuestion[];
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  language?: 'english' | 'italian';
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionSetId: string;
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  completed: boolean;
  timeSpent: number;
  createdAt: Date;
}

export interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTime: number;
  questionSets: {
    id: string;
    title: string;
    attempts: number;
    bestScore: number;
    averageScore: number;
  }[];
}

export interface QuestionProgress {
  userId: string;
  questionId: string;
  correctAttempts: number;
  totalAttempts: number;
  lastAttempt: Date;
  mastered: boolean;
  nextReviewDate?: Date;
}
