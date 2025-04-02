
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription?: string;
  status?: string;
  preferences?: UserPreferences;
  isPremiumUser?: boolean;
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  difficulty: string;
  onboardingCompleted: boolean;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_premium: boolean;
  premium_until: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface UserStats {
  id: string;
  user_id: string;
  questions_answered: number;
  correct_answers: number;
  streak_days: number;
  last_activity_date: string | null;
  reading_score: number | null;
  writing_score: number | null;
  listening_score: number | null;
  speaking_score: number | null;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  achieved_at: string;
  metadata?: any;
}

export interface DailyQuestion {
  id: string;
  question_date: string;
  question_text: string;
  options: any;
  correct_answer: string;
  explanation: string | null;
  category: string;
  difficulty: string;
  is_premium: boolean;
  created_at: string;
}
