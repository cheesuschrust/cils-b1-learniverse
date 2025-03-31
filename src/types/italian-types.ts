
// Define Italian-specific types

export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';
export type ItalianTestSection = 'grammar' | 'vocabulary' | 'culture' | 'listening' | 'reading' | 'writing' | 'speaking' | 'citizenship';

// CILS exam types
export type CILSExamType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Question generation parameters
export interface ItalianQuestionGenerationParams {
  italianLevel?: ItalianLevel;
  testSection?: ItalianTestSection;
  isCitizenshipFocused?: boolean;
  includeListening?: boolean;
  includeWriting?: boolean;
  includeReading?: boolean;
  includeSpeaking?: boolean;
  examType?: CILSExamType;
}

// AI-generated questions format
export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  isCitizenshipRelevant?: boolean;
}

// AI generation result
export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

// User profile for Italian learning
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profileImage?: string;
  bio?: string;
  learningLevel?: ItalianLevel;
  goals?: string[];
  interests?: string[];
  createdAt: Date;
  lastLogin?: Date;
  preferredLanguage?: string;
  completedLessons?: string[];
  testScores?: Record<ItalianTestSection, number>;
  certificateProgress?: Record<CILSExamType, number>;
}

// Citizenship test profile
export interface CitizenshipProfile {
  userId: string;
  readinessScore: number;
  lastAssessmentDate?: Date;
  requiredScore: number;
  sectionScores: Record<ItalianTestSection, number>;
  passedSections: ItalianTestSection[];
  completedSections: ItalianTestSection[];
  isEligible: boolean;
}

// Helper function to map app types to Italian types
export function mapToItalianTypes(type: string): ItalianTestSection {
  const mapping: Record<string, ItalianTestSection> = {
    'grammar': 'grammar',
    'vocabulary': 'vocabulary',
    'culture': 'culture',
    'listening': 'listening',
    'reading': 'reading',
    'writing': 'writing',
    'speaking': 'speaking',
    'citizenship': 'citizenship'
  };

  return mapping[type.toLowerCase()] || 'grammar';
}
