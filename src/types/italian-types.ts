
// Italian Language Learning Types

/**
 * Italian proficiency levels following CEFR standard
 */
export type ItalianLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/**
 * Test sections for Italian language assessments
 */
export type ItalianTestSection = 'grammar' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'speaking' | 'culture';

/**
 * CILS (Certificazione di Italiano come Lingua Straniera) exam types
 */
export type CILSExamType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'citizenship';

/**
 * Parameters for generating Italian language questions
 */
export interface QuestionGenerationParams {
  italianLevel?: ItalianLevel;
  testSection?: ItalianTestSection;
  topics?: string[];
  count?: number;
  isCitizenshipFocused?: boolean;
}

/**
 * AI-generated question for Italian language learning
 */
export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel | number;
  isCitizenshipRelevant?: boolean;
}

/**
 * Result from AI generation process
 */
export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

/**
 * User profile with Italian-specific attributes
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  italianLevel?: ItalianLevel;
  learningGoals?: string[];
  interests?: string[];
  isCitizenshipFocused?: boolean;
  preferredTestSections?: ItalianTestSection[];
  studyMinutesPerDay?: number;
  studyDaysPerWeek?: number;
  createdAt: Date;
  lastActive?: Date;
}
