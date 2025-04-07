
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role?: 'user' | 'admin' | 'moderator';
  isVerified?: boolean;
  createdAt?: Date | string;
  lastLogin?: Date | string;
  avatar?: string;
  isActive?: boolean;
  isPremium?: boolean;
  subscriptionTier?: 'free' | 'premium' | 'enterprise';
  subscriptionExpiry?: Date | string;
  preferences?: UserPreferences;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'it' | 'en';
  notifications?: boolean;
  emailNotifications?: boolean;
  studyReminders?: boolean;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  [key: string]: any;
}
