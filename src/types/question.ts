
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  category?: string;
  points?: number;
  audio?: string;
  image?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionSet {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in seconds
  passingScore?: number; // percentage
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionSetId: string;
  score: number;
  maxScore: number;
  percentageScore: number;
  startedAt: Date;
  completedAt: Date;
  answers: {
    questionId: string;
    answerId: string;
    isCorrect: boolean;
    timeSpent?: number; // in seconds
  }[];
}
