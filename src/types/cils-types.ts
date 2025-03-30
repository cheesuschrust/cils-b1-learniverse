
/**
 * CILS B1 Exam types and interfaces
 */

// Possible exam sections in CILS B1
export type ExamSectionType = 
  | 'reading' 
  | 'writing' 
  | 'listening' 
  | 'speaking' 
  | 'grammar' 
  | 'vocabulary';

// Exam difficulty levels
export type ExamDifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// CILS B1 specific content types
export interface CILSExamSection {
  id: string;
  title: string;
  description: string;
  type: ExamSectionType;
  timeAllowed: number; // in minutes
  questionCount: number;
  passingScore: number;
}

// CILS exam structure
export interface CILSExam {
  id: string;
  title: string;
  description: string;
  level: ExamDifficultyLevel;
  sections: CILSExamSection[];
  totalTime: number; // in minutes
  passingScore: number;
}

// User progress for a specific exam section
export interface ExamSectionProgress {
  sectionId: string;
  completed: boolean;
  score?: number;
  timeSpent?: number;
  lastAttempt?: Date;
  attemptsCount: number;
  correctAnswers?: number;
  totalQuestions?: number;
}

// Overall user progress for an exam
export interface ExamProgress {
  examId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  overallScore?: number;
  sectionProgress: Record<string, ExamSectionProgress>;
  isPractice: boolean;
}

// Study plan structure
export interface StudyPlan {
  id: string;
  userId: string;
  targetExamDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  weeklyGoals: {
    readingMinutes: number;
    writingMinutes: number;
    listeningMinutes: number;
    speakingMinutes: number;
    grammarMinutes: number;
    vocabularyMinutes: number;
  };
  focusAreas: ExamSectionType[];
}

// Question models for different question types
export interface BaseQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'ordering' | 'speaking' | 'writing';
  difficulty: 'easy' | 'medium' | 'hard';
  sectionType: ExamSectionType;
  examLevel: ExamDifficultyLevel;
  explanation?: string;
  tags?: string[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctOption: number;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  blanks: {
    position: number;
    acceptableAnswers: string[];
  }[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  items: {
    left: string;
    right: string;
  }[];
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: string[];
  correctOrder: number[];
}

export interface SpeakingQuestion extends BaseQuestion {
  type: 'speaking';
  audioPrompt?: string;
  imagePrompt?: string;
  evaluationCriteria: string[];
}

export interface WritingQuestion extends BaseQuestion {
  type: 'writing';
  wordLimit?: number;
  evaluationCriteria: string[];
}

// Union type for all question types
export type Question = 
  | MultipleChoiceQuestion 
  | FillBlankQuestion 
  | MatchingQuestion 
  | OrderingQuestion 
  | SpeakingQuestion 
  | WritingQuestion;
