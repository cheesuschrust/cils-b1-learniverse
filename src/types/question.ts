
export interface QuestionBase {
  id: string;
  type: 'multiple-choice' | 'text-input' | 'matching' | 'true-false';
  question: string;
  explanation?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  language: 'english' | 'italian';
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

export interface TextInputQuestion extends QuestionBase {
  type: 'text-input';
  correctAnswers: string[];
  caseSensitive: boolean;
}

export interface MatchingQuestion extends QuestionBase {
  type: 'matching';
  pairs: { left: string; right: string }[];
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true-false';
  correctAnswer: boolean;
}

export type Question = 
  | MultipleChoiceQuestion 
  | TextInputQuestion 
  | MatchingQuestion 
  | TrueFalseQuestion;

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'english' | 'italian';
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionSetId: string;
  answers: Record<string, string | boolean | number>;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  completed: boolean;
  timeSpent: number; // In seconds
  createdAt: Date;
}
