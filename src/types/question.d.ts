
export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
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
  userId?: string;
  questionSetId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent?: number; // in seconds
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

export interface LearningProgress {
  userId: string;
  date: Date;
  questionsAnswered: number;
  questionsCorrect: number;
  timeSpent: number;
  categories: Record<string, number>;
}

export interface StudySession {
  id: string;
  userId: string;
  contentType: 'flashcards' | 'multiple-choice' | 'speaking' | 'listening' | 'writing';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  itemsStudied: number;
  correct: number;
  incorrect: number;
  setId?: string;
}

export interface DailyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: Date;
  streakStartDate: Date;
}

export interface UserGoal {
  userId: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  progress: number;
  contentType: 'flashcards' | 'multiple-choice' | 'speaking' | 'listening' | 'writing' | 'all';
  startDate: Date;
  endDate?: Date;
  completed: boolean;
}

export interface SpeakingExercise {
  id: string;
  prompt: string;
  expectedResponse?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  language: 'english' | 'italian';
}

export interface WritingExercise {
  id: string;
  prompt: string;
  sampleResponse?: string;
  minWords?: number;
  maxWords?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  language: 'english' | 'italian';
}

export interface ListeningExercise {
  id: string;
  audioUrl: string;
  transcript: string;
  translation?: string;
  questions: ListeningQuestion[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  language: 'english' | 'italian';
}

export interface ListeningQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
}
