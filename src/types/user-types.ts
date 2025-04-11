
export interface UserSettings {
  theme: string;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  streak: number;
  lastLogin: Date;
  firstLogin: Date;
  prefersDarkMode: boolean;
  contentFilters: string[];
}

export interface UserPerformance {
  totalQuestions: number;
  correctAnswers: number;
  quizzesTaken: number;
  averageScore: number;
  totalTimeSpent: number;
  lastActivityDate: Date;
  streakDays: number;
  topicScores: Record<string, number>;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  PREMIUM = 'premium'
}

export interface LegacyFields {
  username?: string;
  avatar?: string;
  lastActive?: Date;
  loginCount?: number;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isPremiumUser: boolean;
  settings?: UserSettings;
  performance?: UserPerformance;
  metadata?: Record<string, any>;
  legacy?: LegacyFields;
}

export function normalizeUser(user: any): User {
  return {
    id: user.id,
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    displayName: user.displayName || user.display_name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    photoURL: user.photoURL || user.photo_url || user.avatar || '',
    role: user.role || UserRole.USER,
    createdAt: user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt || Date.now()),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt : new Date(user.updatedAt || Date.now()),
    isVerified: user.isVerified || user.is_verified || false,
    isPremiumUser: user.isPremiumUser || user.is_premium_user || false,
    settings: user.settings || {},
    performance: user.performance || {},
    metadata: user.metadata || {},
    legacy: {
      username: user.username,
      avatar: user.avatar,
      lastActive: user.lastActive instanceof Date ? user.lastActive : 
                  user.lastActive ? new Date(user.lastActive) : undefined,
      loginCount: user.loginCount || 0
    }
  };
}

export function normalizeUserRecords(users: any[]): User[] {
  return users.map(user => normalizeUser(user));
}

export function convertLegacyUser(legacyUser: any): User {
  return {
    id: legacyUser.id || '',
    email: legacyUser.email || '',
    firstName: legacyUser.firstName || legacyUser.first_name || '',
    lastName: legacyUser.lastName || legacyUser.last_name || '',
    displayName: legacyUser.displayName || legacyUser.display_name || 
                legacyUser.username || `${legacyUser.firstName || ''} ${legacyUser.lastName || ''}`.trim(),
    photoURL: legacyUser.photoURL || legacyUser.photo_url || legacyUser.avatar || '',
    role: legacyUser.role || UserRole.USER,
    createdAt: legacyUser.createdAt instanceof Date ? legacyUser.createdAt : 
              new Date(legacyUser.createdAt || legacyUser.created_at || Date.now()),
    updatedAt: legacyUser.updatedAt instanceof Date ? legacyUser.updatedAt :
              new Date(legacyUser.updatedAt || legacyUser.updated_at || Date.now()),
    isVerified: legacyUser.isVerified || legacyUser.is_verified || false,
    isPremiumUser: legacyUser.isPremiumUser || legacyUser.is_premium_user || false,
    settings: {
      theme: legacyUser.theme || 'light',
      language: legacyUser.language || 'en',
      notifications: legacyUser.notifications !== undefined ? legacyUser.notifications : true,
      emailNotifications: legacyUser.emailNotifications !== undefined ? legacyUser.emailNotifications : true,
      streak: legacyUser.streak || 0,
      lastLogin: legacyUser.lastLogin instanceof Date ? legacyUser.lastLogin : 
                new Date(legacyUser.lastLogin || legacyUser.last_login || Date.now()),
      firstLogin: legacyUser.firstLogin instanceof Date ? legacyUser.firstLogin :
                new Date(legacyUser.firstLogin || legacyUser.first_login || Date.now()),
      prefersDarkMode: legacyUser.prefersDarkMode || legacyUser.prefers_dark_mode || false,
      contentFilters: legacyUser.contentFilters || legacyUser.content_filters || []
    },
    performance: {
      totalQuestions: legacyUser.totalQuestions || 0,
      correctAnswers: legacyUser.correctAnswers || 0,
      quizzesTaken: legacyUser.quizzesTaken || 0,
      averageScore: legacyUser.averageScore || 0,
      totalTimeSpent: legacyUser.totalTimeSpent || 0,
      lastActivityDate: legacyUser.lastActivityDate instanceof Date ? legacyUser.lastActivityDate :
                      new Date(legacyUser.lastActivityDate || legacyUser.last_activity_date || Date.now()),
      streakDays: legacyUser.streakDays || 0,
      topicScores: legacyUser.topicScores || {}
    },
    metadata: legacyUser.metadata || {},
    legacy: {
      username: legacyUser.username,
      avatar: legacyUser.avatar,
      lastActive: legacyUser.lastActive instanceof Date ? legacyUser.lastActive : 
                legacyUser.lastActive ? new Date(legacyUser.lastActive) : undefined,
      loginCount: legacyUser.loginCount || 0
    }
  };
}
