
// Italian language proficiency levels
export type ItalianLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'beginner' | 'intermediate' | 'advanced';

// Italian test sections
export type ItalianTestSection = 
  | 'vocabulary' 
  | 'grammar' 
  | 'reading' 
  | 'writing' 
  | 'speaking' 
  | 'listening' 
  | 'culture' 
  | 'citizenship';

// Question types for CILS exams
export type QuestionType = 'multipleChoice' | 'freeText' | 'audio' | 'matching' | 'trueFalse' | 'gap' | 'speaking';

// CILS Exam types
export type CILSExamType = 'A1' | 'A2' | 'ONE-B1' | 'TWO-B2' | 'THREE-C1' | 'FOUR-C2' | 'B1-Citizenship';

// Parameters for generating Italian questions
export interface ItalianQuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  isCitizenshipFocused?: boolean;
  count?: number;
  topics?: string[];
}

// Generated question structure
export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  questionType: QuestionType;
  isCitizenshipRelevant: boolean;
}

// Result of AI generation
export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

// User profile with Italian-specific fields
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  italianLevel?: ItalianLevel;
  learningGoals?: string[];
  preferredTopics?: string[];
  focusAreas?: ItalianTestSection[];
  citizenshipExam?: boolean;
  examDate?: Date;
  completedExercises?: {
    [key in ItalianTestSection]?: number;
  };
  studyTime?: number; // in minutes
  streak?: number;
  lastActive?: Date;
}

// Italian language exercises
export interface ItalianExercise {
  id: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  title: string;
  content: any;
  citizenshipRelevant: boolean;
  tags?: string[];
  estimatedTime?: number; // in minutes
  aiGenerated?: boolean;
  aiConfidence?: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

// Italian vocabulary item
export interface VocabularyItem {
  italian: string;
  english: string;
  pronunciation?: string;
  context?: string;
  examples?: string[];
  level: ItalianLevel;
  tags?: string[];
  citizenshipRelevant?: boolean;
}

// Grammar rule
export interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
  level: ItalianLevel;
  relatedRules?: string[];
  citizenshipRelevant?: boolean;
}
