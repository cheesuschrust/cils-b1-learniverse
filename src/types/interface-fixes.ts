
import { User } from './unified-user';
import { Flashcard, FlashcardSet } from './flashcard-unified';

export interface AnalyticsReportProps {
  userId: string;
  period?: 'week' | 'month' | 'year' | 'all';
  showDetails?: boolean;
}

export interface FlashcardComponentProps {
  flashcard: Flashcard;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: 'known' | 'unknown') => void;
  showControls?: boolean;
  showHint?: boolean;
  animateFlip?: boolean;
}

export type ImportFormat = 'csv' | 'json' | 'anki' | 'quizlet' | 'excel';

export interface SupportTicketExtension {
  assignedTo?: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  responseTime?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface LearningPreferencesStepProps {
  studyPreferences: string[];
  onChangeStudyPreferences: (prefs: string[]) => void;
  studyTime: string;
  onChangeStudyTime: (time: string) => void;
  areasToImprove: string[];
  onChangeAreasToImprove: (areas: string[]) => void;
  interestedTopics: string[];
  onChangeInterestedTopics: (topics: string[]) => void;
}

export interface PersonalizationStepProps {
  difficultyPreference: 'easy' | 'balanced' | 'challenging';
  onChangeDifficultyPreference: (pref: 'easy' | 'balanced' | 'challenging') => void;
  voiceEnabled: boolean;
  onChangeVoiceEnabled: (enabled: boolean) => void;
  themePreference: 'light' | 'dark' | 'system';
  onChangeThemePreference: (theme: 'light' | 'dark' | 'system') => void;
}

export interface AIContentProcessorProps {
  content: string;
  contentType: string;
  onQuestionsGenerated: (questions: any[]) => void;
}

export interface SupportTicketProps {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  priority: string;
  assignedTo?: string;
}

export interface EmailSettings {
  provider: string;
  fromEmail: string;
  fromName: string;
  templates: Record<string, any>;
  config: Record<string, any>;
  temporaryInboxDuration: number;
}

export interface SkillScore {
  name: string;
  score: number;
  passingScore: number;
  lastImprovement?: string | null;
  icon?: React.ReactNode;
  color: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
  points: number;
}
