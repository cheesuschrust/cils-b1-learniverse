
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  language: 'english' | 'italian' | 'both';
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  timeLimit?: number;
  points: number;
  nextReviewDate?: Date;
  difficultyFactor?: number;
  reviewCount?: number;
  lastReviewedAt?: Date;
  question?: string; // Added for compatibility
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  timeLimit?: number;
  passingScore: number;
  questions: Question[];
  language: 'english' | 'italian' | 'both';
  instructions?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionSetId: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  timeSpent: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  createdAt: Date;
  completed: boolean;
  passed: boolean;
  isReview?: boolean;
}

export interface QuizProgress {
  questionSetId: string;
  completed: number;
  total: number;
  percentage: number;
  bestScore: number;
  lastAttemptDate?: Date;
  attempts: number;
}

export interface QuestionStats {
  totalAnswers: number;
  correctAnswers: number;
  incorrectAnswers: number;
  avgTimeSpent: number;
  difficultyScore: number;
}

export interface QuizSessionState {
  questionSetId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: Date;
  endTime?: Date;
  timeSpentPerQuestion: Record<string, number>;
  score?: number;
  isComplete: boolean;
}

export interface ReviewSchedule {
  dueToday: number;
  dueThisWeek: number;
  dueNextWeek: number;
  dueByDate: Record<string, number>;
}

export interface ReviewPerformance {
  totalReviews: number;
  correctReviews: number;
  efficiency: number;
  streakDays: number;
  reviewsByCategory: Record<string, number>;
}

// For backward compatibility with older code
export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  language: 'english' | 'italian';
}
