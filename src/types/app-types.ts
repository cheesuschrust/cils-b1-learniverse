
import { ReactNode } from 'react';

// AI Settings
export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  showFeedback?: boolean;
}

export interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
  onSave?: () => void;
  onReset?: () => void;
}

// Notification Types
export type NotificationType = 
  'achievement' | 'streak' | 'milestone' | 'reminder' | 'system' |
  'info' | 'success' | 'warning' | 'error' | 'speaking' | 'listening';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'link' | 'success' | 'warning';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAt: Date;
  read: boolean;
  link?: string;
  actionLabel?: string;
  actionHandler?: () => void;
  expires?: Date;
  metadata?: Record<string, any>;
}

// AI Processing options
export interface AIProcessingOptions {
  includeInTraining?: boolean;
  returnRawResponse?: boolean;
  language?: 'english' | 'italian' | 'both';
  contentType?: string;
}

// AI Content processor props
export interface AIContentProcessorProps {
  settings?: AISettings;
  onContentProcessed?: (result: any) => void;
  onError?: (error: Error) => void;
  defaultLanguage?: string;
  contentType?: string;
}

// Feedback data
export interface FeedbackData {
  rating: number;
  comment?: string;
  category: string;
  userId?: string;
  context?: Record<string, any>;
}

// Question generation params
export interface QuestionGenerationParams {
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count: number;
  contentTypes: string[];
  isCitizenshipFocused?: boolean;
}

// Italian specific question generation params
export interface ItalianQuestionGenerationParams extends QuestionGenerationParams {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type ContentType = 
  'flashcards' | 
  'multiple-choice' | 
  'listening' | 
  'writing' | 
  'speaking' |
  'pdf' |
  'document' |
  'video' |
  'audio' |
  'image' |
  'unknown';

export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: string;
  difficulty: string;
  questionType: string;
  isCitizenshipRelevant: boolean;
}

export type AIGeneratedQuestion = AIQuestion;

// Answer results for citizenship test
export interface AnswerResults {
  score: number;
  section: string;
  timeSpent?: number;
}
