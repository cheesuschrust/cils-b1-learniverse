
export interface User {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string; // Added to fix EnhancedChatbot error
  role: 'user' | 'admin' | 'teacher';
  createdAt: Date;
  lastLogin?: Date;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
    language?: 'en' | 'it';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'institutional';
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'canceled' | 'expired' | 'pending';
    features?: string[];
  };
  progress?: {
    level: number;
    totalPoints: number;
    streakDays: number;
    lastActivity?: Date;
  };
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // Added to fix main.tsx error
}
