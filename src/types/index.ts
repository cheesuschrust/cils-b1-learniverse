
import { ReactNode } from 'react';

// Shared type definitions
export type ExtendedAlertVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'destructive' | 'success' | 'info' | 'outline';

export interface User {
  id: string;
  name?: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  avatar?: string;
  profileImage?: string;
  dateJoined?: Date;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  lastActive?: Date;
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: 'free' | 'premium' | 'trial';
  isVerified?: boolean;
  isPremium?: boolean;
  isPremiumUser?: boolean;
  isAdmin?: boolean;
  preferences: UserPreferences;
  usageMetrics?: {
    usedQuestions: number;
    totalQuestions: number;
    completedLessons: number;
  };
  dailyQuestionCounts: {
    flashcards: number;
    multipleChoice: number;
    speaking: number;
    writing: number;
    listening: number;
    [key: string]: number;
  };
  metrics?: UserMetrics;
}

export interface UserMetrics {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  [key: string]: any;
}

export type UserRole = 'user' | 'admin' | 'teacher' | 'moderator' | 'editor';

export type ThemeOption = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeOption;
  language: string;
  notifications: boolean;
  onboardingCompleted: boolean;
  emailNotifications?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  fontSize?: number;
  notificationsEnabled?: boolean;
  animationsEnabled?: boolean;
  preferredLanguage?: string;
  voiceSpeed?: number;
  autoPlayAudio?: boolean;
  showProgressMetrics?: boolean;
  aiEnabled?: boolean;
  aiModelSize?: string;
  aiProcessingOnDevice?: boolean;
  confidenceScoreVisible?: boolean;
  bio?: string;
}

export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stop?: string[];
  showFeedback?: boolean;
  defaultModelSize?: string;
  voiceRate?: number;
  voicePitch?: number;
  englishVoiceURI?: string;
  italianVoiceURI?: string;
  assistantName?: string;
}

// Context types
export interface AuthContextType {
  currentUser: User | null;
  user?: User | null;
  showMessage: (message: string) => void;
  getAllUsers: () => Promise<User[]>;
  createUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  signup: (email: string, password: string, userData?: Partial<User>) => Promise<User>;
  socialLogin: (provider: string) => Promise<User>;
  getEmailSettings: () => Promise<any>;
  updateEmailSettings: (settings: any) => Promise<void>;
  getSystemLogs: () => Promise<any[]>;
  updateSystemLog: (logId: string, data: any) => Promise<void>;
  addSystemLog: (data: any) => Promise<void>;
  isPremium: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error?: any;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export interface AIUtilsContextType {
  processContent: (prompt: string, options?: ProcessContentOptions) => Promise<string>;
  settings: AISettings;
  updateSettings: (settings: AISettings) => void;
  generateContent?: (prompt: string, options?: ProcessContentOptions) => Promise<string>;
  speakText?: (text: string, language?: string, onComplete?: () => void) => void;
  isSpeaking?: boolean;
  processAudioStream?: (stream: MediaStream) => Promise<string>;
  stopAudioProcessing?: () => void;
  isTranscribing?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
}

// Content Type
export type ContentType = 
  | 'flashcards'
  | 'multiple-choice'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'pdf'
  | 'unknown';

// Helper interfaces
export interface ProcessContentOptions {
  maxLength?: number;
  format?: string;
  temperature?: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface SpeakableWordProps {
  word: string;
  language?: string;
  autoPlay?: boolean;
  className?: string;
  onPlayComplete?: () => void;
  size?: string;
  onClick?: () => void;
  showTooltip?: boolean;
  tooltipContent?: string;
}

export interface LevelBadgeProps {
  level: number;
  showInfo?: boolean;
  size?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
}

export interface ReviewSchedule {
  interval: number;
  dueDate: Date;
  difficulty: number;
  overdue?: number;
  upcoming?: number;
  totalDue?: number;
  nextWeekCount?: number;
  dueToday?: number;
  dueThisWeek?: number;
  dueNextWeek?: number;
  dueByDate?: Record<string, number>;
}

export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
  totalReviews?: number;
  correctReviews?: number;
  efficiency?: number;
  streakDays?: number;
  reviewsByCategory?: Record<string, number>;
  accuracy?: number;
  speed?: number;
  consistency?: number;
  retention?: number;
  overall?: number;
}

export interface QuestionLimit {
  dailyLimit: number;
  usedToday: number;
  remaining: number;
  isPremium: boolean;
  hasReachedLimit: boolean;
  isLoading: boolean;
  lastUpdated: Date;
  useQuestion: () => Promise<boolean>;
  canUseQuestion: () => boolean;
  loadUsageData: () => Promise<any>;
  usedQuestions?: Record<string, number>;
  canAccessContent?: (contentType: string) => boolean;
  trackQuestionUsage?: (contentType: string) => Promise<void>;
  remainingQuestions?: number;
}
