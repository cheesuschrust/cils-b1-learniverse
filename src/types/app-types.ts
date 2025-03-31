
// Core application types for consistent usage across the app
import { ReactNode } from 'react';
import { AISettings } from './ai';

// Basic UI types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'reading' | 'writing' | 'listening' | 'speaking' | 'culture' | 'vocabulary' | 'grammar';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'success';

// AI-related types
export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  type: string;
  difficulty: string | number;
}

// Error boundary props
export interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  errorMonitoringService?: any;
  additionalInfo?: Record<string, any>;
  severity?: string;
  category?: string;
  showDetails?: boolean;
  reportErrors?: boolean;
}

// AI Content processor props
export interface AIContentProcessorProps {
  content?: string;
  contentType?: ContentType;
  onQuestionsGenerated?: (questions: any[]) => void;
  settings?: AIContentSettings;
  onContentGenerated?: (content: any) => void;
  onError?: (error: string) => void;
}

// AI Content settings
export interface AIContentSettings {
  language: string;
  difficulty: string;
  contentTypes: string[];
  focusAreas?: string[];
  count?: number;
}

// Process content options
export interface ProcessContentOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  model?: string;
}

// Confidence indicator props
export interface ConfidenceIndicatorProps {
  score: number;
  value?: number;  // For backward compatibility
  contentType?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indicatorClassName?: string;
}

// Level badge props
export interface LevelBadgeProps {
  level: string;
  showInfo?: boolean;
  size?: string;
}

// Question generation params
export interface QuestionGenerationParams {
  italianLevel?: string;
  testSection?: string;
  difficulty?: string;
  contentTypes?: string[];
  focusAreas?: string[];
  topics?: string[];
  count?: number;
  isCitizenshipFocused?: boolean;
  language?: string;
}

// AI generation result
export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

// AI generated question
export interface AIGeneratedQuestion extends AIQuestion {
  isCitizenshipRelevant?: boolean;
}

// User profile
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profileImage?: string;
  bio?: string;
  learningLevel?: string;
  goals?: string[];
  interests?: string[];
  createdAt: Date;
  lastLogin?: Date;
  preferredLanguage?: string;
  notificationSettings?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

// AI Settings Props
export interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
  availableModels: string[];
  isLoading?: boolean;
}

// Citizenship Readiness Props
export interface CitizenshipReadinessProps {
  level: string;
  readinessScore: number;
  assessmentAvailable: boolean;
  onStartAssessment: () => void;
  lastAssessmentDate?: Date;
}

// Analytics Report Props
export interface AnalyticsReportProps {
  data: {
    userActivity: {
      totalSessions: number;
      averageSessionLength: number;
      averageQuestionsPerSession: number;
      averageScorePercentage: number;
      optimalTimeOfDay: string;
      completionRate: number;
      timePerQuestion: number;
    };
    progressBySection: Record<string, {
      attempts: number;
      correctAnswers: number;
      percentageCorrect: number;
      timeSpent: number;
    }>;
    weeklyProgress: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
      }[];
    };
  };
  period: 'week' | 'month' | 'year';
  onPeriodChange: (period: 'week' | 'month' | 'year') => void;
}

// AI Utils Context Type
export interface AIUtilsContextType {
  processContent: (prompt: string, options?: any) => Promise<string>;
  settings: AISettings;
  updateSettings: (newSettings: AISettings) => void;
  generateContent: (prompt: string, options?: any) => Promise<string>;
  speakText: (text: string, language?: string, onComplete?: () => void) => void;
  isSpeaking: boolean;
  processAudioStream: (stream: MediaStream) => Promise<string>;
  stopAudioProcessing: () => void;
  isTranscribing: boolean;
  hasActiveMicrophone: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
  generateQuestions: (params: any) => Promise<any>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  resetCredits: () => Promise<void>;
  speak: (text: string, language?: string) => Promise<void>;
  recognizeSpeech: (audioBlob: Blob) => Promise<string>;
  compareTexts: (text1: string, text2: string) => Promise<number>;
  isProcessing: boolean;
  isAIEnabled: boolean;
}

