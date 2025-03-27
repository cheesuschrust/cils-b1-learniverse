
export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher';

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
  username?: string;
  firstName?: string; 
  lastName?: string;
  first_name?: string; // Including snake case properties for backward compatibility
  last_name?: string;
  displayName?: string;
  name?: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt: Date;
  created_at?: Date; // Snake case property for backward compatibility
  updatedAt: Date; // Required property
  updated_at?: Date; // Snake case property for backward compatibility
  lastLogin?: Date;
  last_login?: Date; // Snake case property for backward compatibility 
  lastActive?: Date;
  last_active?: Date; // Snake case property for backward compatibility
  avatar?: string;
  photoURL?: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
  isAdmin?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: 'free' | 'premium' | 'trial';
  preferences: UserPreferences;
  preferred_language?: 'english' | 'italian' | 'both';
  preferredLanguage?: 'english' | 'italian' | 'both';
  dailyQuestionCounts?: {
    flashcards: number;
    multipleChoice: number;
    listening: number;
    writing: number;
    speaking: number;
    [key: string]: number;
  };
  metrics: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
    [key: string]: any;
  };
}

// Helper functions for backward compatibility
export function getUserFirstName(user: User): string | undefined {
  return user.firstName || user.first_name;
}

export function getUserLastName(user: User): string | undefined {
  return user.lastName || user.last_name;
}

export function getUserDisplayName(user: User): string | undefined {
  return user.displayName || user.name || 
    (getUserFirstName(user) && getUserLastName(user) 
      ? `${getUserFirstName(user)} ${getUserLastName(user)}`.trim() 
      : undefined);
}

export function getUserPreferredLanguage(user: User): string | undefined {
  return user.preferredLanguage || user.preferred_language;
}

export function getUserCreatedDate(user: User): Date | undefined {
  return user.createdAt || user.created_at;
}

export function getUserLastLogin(user: User): Date | undefined {
  return user.lastLogin || user.last_login;
}

export function getUserLastActive(user: User): Date | undefined {
  return user.lastActive || user.last_active;
}
