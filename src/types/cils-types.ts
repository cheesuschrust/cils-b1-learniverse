
// Types for the CILS exam

export type CILSExamLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type CILSExamSectionType = 'reading' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'vocabulary';

export interface CILSExamSection {
  id: string;
  title: string;
  description: string;
  type: CILSExamSectionType;
  timeAllowed: number; // in minutes
  questionCount: number;
  questions?: CILSQuestion[];
}

export interface CILSExam {
  id: string;
  title: string;
  level: CILSExamLevel;
  description: string;
  totalTime: number; // in minutes
  sections: CILSExamSection[];
  createdAt: string;
  updatedAt: string;
}

export type CILSQuestionType = 
  | 'multiple-choice' 
  | 'fill-in-blank' 
  | 'matching' 
  | 'ordering' 
  | 'true-false' 
  | 'short-answer' 
  | 'essay' 
  | 'listening-comprehension' 
  | 'speaking-prompt';

export interface CILSQuestion {
  id: string;
  questionText: string;
  questionType: CILSQuestionType;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  attachments?: {
    type: 'image' | 'audio' | 'video';
    url: string;
  }[];
}

export interface ExamProgress {
  id: string;
  userId: string;
  examId: string;
  startedAt: string;
  completedAt?: string;
  currentSectionId?: string;
  sectionsProgress: {
    [sectionId: string]: {
      completed: boolean;
      score?: number;
      answers?: {
        [questionId: string]: string | string[];
      };
      startedAt?: string;
      completedAt?: string;
    };
  };
  overallScore?: number;
  isPassed?: boolean;
}

export interface CILSExamResult {
  id: string;
  userId: string;
  examId: string;
  completedAt: string;
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  isPassed: boolean;
  sectionScores: {
    [sectionId: string]: {
      score: number;
      maxPossibleScore: number;
      percentageScore: number;
      isPassed: boolean;
    };
  };
  certificateUrl?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  targetExamDate?: string;
  createdAt: string;
  updatedAt: string;
  weeks: StudyWeek[];
}

export interface StudyWeek {
  id: number;
  title: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  days: StudyDay[];
}

export interface StudyDay {
  id: number;
  title: string;
  activities: StudyActivity[];
}

export interface StudyActivity {
  id: number;
  type: string;
  title: string;
  duration: number;
  isCompleted: boolean;
}
