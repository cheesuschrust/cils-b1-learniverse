
export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  language: 'english' | 'italian';
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  questions: MultipleChoiceQuestion[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'english' | 'italian';
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionSetId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  questionSets: {
    id: string;
    title: string;
    attempts: number;
    bestScore: number;
  }[];
}
