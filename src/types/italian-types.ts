
// Italian types definition file

export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';

export type ItalianTestSection = 
  | 'grammar' 
  | 'vocabulary' 
  | 'culture' 
  | 'listening' 
  | 'reading' 
  | 'writing' 
  | 'speaking'
  | 'citizenship';

export interface AIGeneratedQuestion {
  id: string;
  text?: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  isCitizenshipRelevant?: boolean;
  question?: string;
  questionType: 'multipleChoice' | 'flashcards' | 'writing' | 'speaking' | 'listening';
}

export interface ItalianQuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count?: number;
  isCitizenshipFocused?: boolean;
  language?: 'english' | 'italian' | 'both';
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

export interface AnswerResults {
  score: number;
  time: number;
}

export interface CitizenshipQuestionSet {
  id: string;
  title: string;
  description: string;
  questions: AIGeneratedQuestion[];
  difficulty: ItalianLevel;
  createdAt: Date;
  updatedAt: Date;
  category: string;
}

export interface ItalianPracticeResult {
  section: ItalianTestSection;
  score: number;
  timeSpent: number;
  date: Date;
  questionsAnswered: number;
  correctAnswers: number;
}

export interface CitizenshipReadinessScore {
  overall: number;
  sections: Record<ItalianTestSection, number>;
  lastUpdated: Date;
  recommendations: string[];
}

export interface ItalianProgressMetrics {
  totalExercises: number;
  totalTime: number;
  averageScore: number;
  sectionalScores: Record<ItalianTestSection, number>;
  strengths: ItalianTestSection[];
  weaknesses: ItalianTestSection[];
  streak: number;
  lastActivity: Date;
}
