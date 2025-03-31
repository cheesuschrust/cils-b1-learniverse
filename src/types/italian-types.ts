
// Italian-specific type definitions
import { AIQuestion } from './app-types';

export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

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

// Utilities for converting between CILS exam types and Italian levels
export function cilsToLevel(cilsLevel: CILSExamType): ItalianLevel {
  const mapping: Record<CILSExamType, ItalianLevel> = {
    'A1': 'beginner',
    'A2': 'beginner',
    'B1': 'intermediate',
    'B2': 'intermediate',
    'C1': 'advanced',
    'C2': 'advanced'
  };
  
  return mapping[cilsLevel] || 'intermediate';
}

export function levelToCils(level: ItalianLevel): CILSExamType[] {
  switch(level) {
    case 'beginner':
      return ['A1', 'A2'];
    case 'intermediate':
      return ['B1', 'B2'];
    case 'advanced':
      return ['C1', 'C2'];
    default:
      // If the level is already a CILS level
      if (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) {
        return [level as CILSExamType];
      }
      return ['B1'];
  }
}
