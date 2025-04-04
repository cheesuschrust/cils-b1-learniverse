
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
  lastLogin?: Date;
  isPremiumUser?: boolean;
}

export interface UserSettings {
  theme: string;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  studyReminders: boolean;
  showConfidence: boolean;
  showPronunciation: boolean;
}

export interface UserRole {
  id: string;
  userId: string;
  role: 'user' | 'admin' | 'moderator' | 'teacher';
  createdAt: Date;
}

export interface UserPerformance {
  userId: string;
  totalXp: number;
  level: number;
  streak: number;
  lastActive: Date;
  skillScores: Record<string, number>;
}

export interface LegacyFields {
  uid?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  display_name?: string;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  last_active?: Date;
  preferred_language?: string;
}

export function normalizeUser(user: any): User {
  if (!user) return null as any;
  
  return {
    id: user.id || user.uid || '',
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    displayName: user.displayName || user.display_name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    photoURL: user.photoURL || user.photo_url || '',
    createdAt: user.createdAt || user.created_at || new Date(),
    lastLogin: user.lastLogin || user.last_login || null,
    isPremiumUser: user.isPremiumUser || user.is_premium || false
  };
}

export function normalizeUserRecords(users: any[]): User[] {
  if (!users || !Array.isArray(users)) return [];
  return users.map(normalizeUser);
}

export function convertLegacyUser(legacyUser: LegacyFields): User {
  return {
    id: legacyUser.uid || '',
    email: '',
    firstName: legacyUser.first_name,
    lastName: legacyUser.last_name,
    displayName: legacyUser.display_name,
    photoURL: legacyUser.photo_url,
    createdAt: legacyUser.created_at,
    lastLogin: legacyUser.last_login
  };
}
