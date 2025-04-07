
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'suspended';
  subscription: 'free' | 'premium';
  preferredLanguage: 'english' | 'italian' | 'both';
  dailyQuestionCounts: {
    [key: string]: number;
    flashcards: number;
    multipleChoice: number;
    listening: number;
    writing: number;
    speaking: number;
  };
  metrics: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
  };
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  language: 'en' | 'it';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  fontSize?: number;
  notificationsEnabled: boolean;
  animationsEnabled: boolean;
  voiceSpeed?: number;
  autoPlayAudio: boolean;
  showProgressMetrics: boolean;
  aiEnabled: boolean;
  aiModelSize?: string;
  aiProcessingOnDevice: boolean;
  confidenceScoreVisible: boolean;
}
