
// Italian-specific type definitions
import { AIQuestion } from './app-types';

export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';

export type ItalianTestSection = 
  | 'grammar'
  | 'vocabulary'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'citizenship'
  | 'culture';

export type CILSExamType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface ItalianQuestionGenerationParams {
  italianLevel: ItalianLevel;
  testSection: ItalianTestSection;
  isCitizenshipFocused: boolean;
  topics?: string[];
  count?: number;
  language?: string;
  contentTypes?: ItalianTestSection[];
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

export interface AIGeneratedQuestion extends AIQuestion {
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  isCitizenshipRelevant: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: ItalianLevel;
  interests: string[];
  goals: string[];
  certifications: CILSExamType[];
  isItalianCitizen: boolean;
  hasCompletedOnboarding: boolean;
  createdAt: Date;
  lastActive?: Date;
}

// Type mapping utilities for converting between Italian types and app types
export function mapToAppTypes(italianParams: ItalianQuestionGenerationParams) {
  return {
    difficulty: italianParams.italianLevel,
    contentTypes: italianParams.contentTypes || [italianParams.testSection],
    focusAreas: italianParams.topics,
    count: italianParams.count || 5,
    isCitizenshipFocused: italianParams.isCitizenshipFocused,
    language: italianParams.language || 'italian',
    italianLevel: italianParams.italianLevel,
    testSection: italianParams.testSection
  };
}

export function mapToItalianTypes(appParams: any): ItalianQuestionGenerationParams {
  return {
    italianLevel: appParams.italianLevel || appParams.difficulty || 'intermediate',
    testSection: appParams.testSection || (appParams.contentTypes && appParams.contentTypes[0]) || 'grammar',
    isCitizenshipFocused: appParams.isCitizenshipFocused || false,
    topics: appParams.topics || appParams.focusAreas,
    count: appParams.count || 5,
    language: appParams.language,
    contentTypes: appParams.contentTypes
  };
}
