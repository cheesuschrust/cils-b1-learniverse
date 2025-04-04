
import { User } from './user-types';
import { AIProcessingOptions } from './ai';

export interface ContentProcessorProps {
  content: string;
  language?: string;
  options?: AIProcessingOptions;
  showConfidence?: boolean;
  isInteractive?: boolean;
  onProcessed?: (result: any) => void;
}

export interface FeedbackData {
  score: number;
  feedback: string;
  corrections: {
    original: string;
    suggestion: string;
    explanation: string;
  }[];
  strengths: string[];
  weaknesses: string[];
}

export interface AISettings {
  modelSize: 'small' | 'medium' | 'large';
  useGPU: boolean;
  voiceEnabled: boolean;
  autoTranslate: boolean;
  feedbackLevel: 'basic' | 'detailed' | 'expert';
  confidenceDisplay: boolean;
  language: 'italian' | 'english' | 'both';
  pronunciation: boolean;
  grammar: boolean;
  vocabulary: boolean;
}

export interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
}

export type NotificationType = 'success' | 'warning' | 'error' | 'default';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
  actions?: NotificationAction[];
  expires?: Date | null;
  link?: string;
  category?: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'text' | 'audio' | 'video' | 'image' | 'quiz' | 'flashcard' | 'conversation';
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export interface AIQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: string;
  difficulty: DifficultyLevel;
}

export interface AIGenerationResult {
  text: string;
  confidence: number;
  metadata?: {
    tokens: number;
    duration: number;
    model: string;
  };
}

export interface EnhancedErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: any[];
  children: React.ReactNode;
}
