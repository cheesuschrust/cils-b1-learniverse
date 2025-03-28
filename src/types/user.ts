
// Define user role types
export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher' | 'editor';

export type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  language?: 'en' | 'it';
  frequency?: 'daily' | 'weekly' | 'monthly';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted?: boolean;
  [key: string]: any;
};

// Define a standardized User interface to be used throughout the application
export interface User {
  id: string;
  email: string;
  uid?: string;
  
  // Name properties with consistent naming
  username?: string;
  firstName?: string; 
  lastName?: string;
  displayName?: string;
  name?: string;
  
  // Profile image properties - using photoURL as the standard
  photoURL?: string;
  profileImage?: string;
  avatar?: string;
  
  // User type & permissions
  role: UserRole;
  isVerified?: boolean;
  isAdmin?: boolean;
  
  // Date properties
  createdAt?: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastActive?: Date;
  
  // Status and subscription
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: 'free' | 'premium' | 'trial';
  
  // Contact info
  phoneNumber?: string;
  address?: string;
  
  // User preferences
  preferences?: UserPreferences;
  
  // Language preferences
  preferredLanguage?: 'english' | 'italian' | 'both';
  language?: 'english' | 'italian' | 'both' | 'en' | 'it';
  
  // User metrics
  metrics?: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
    [key: string]: any;
  };
  
  // Daily activity tracking
  dailyQuestionCounts?: {
    flashcards: number;
    multipleChoice: number;
    listening: number;
    writing: number;
    speaking: number;
    [key: string]: number;
  };
}

// Helper functions for user properties
export function getUserFirstName(user: User): string | undefined {
  return user.firstName;
}

export function getUserLastName(user: User): string | undefined {
  return user.lastName;
}

export function getUserDisplayName(user: User): string | undefined {
  return user.displayName || user.name || 
    (getUserFirstName(user) && getUserLastName(user) 
      ? `${getUserFirstName(user)} ${getUserLastName(user)}`.trim() 
      : undefined);
}

export function getUserPreferredLanguage(user: User): string | undefined {
  if (user.preferredLanguage) return user.preferredLanguage;
  if (user.language === 'en') return 'english';
  if (user.language === 'it') return 'italian';
  return user.language;
}

export function getUserCreatedDate(user: User): Date | undefined {
  return user.createdAt;
}

export function getUserLastLogin(user: User): Date | undefined {
  return user.lastLogin;
}

export function getUserLastActive(user: User): Date | undefined {
  return user.lastActive;
}
