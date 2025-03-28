
import { User } from '@/types/user';

/**
 * Normalizes user object properties between camelCase and snake_case
 * to ensure compatibility across the codebase
 */
export function normalizeUser(user: any): User {
  if (!user) return null as any;
  
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName || user.first_name,
    lastName: user.lastName || user.last_name,
    displayName: user.displayName || user.display_name || user.name,
    photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage,
    role: user.role || 'user',
    isVerified: user.isVerified || user.is_verified || false,
    createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
    updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
    lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
    lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
    status: user.status || 'active',
    subscription: user.subscription || 'free',
    phoneNumber: user.phoneNumber || user.phone_number,
    address: user.address,
    preferences: user.preferences || {},
    preferredLanguage: user.preferredLanguage || user.preferred_language || 'english',
    language: user.language || user.preferredLanguage || user.preferred_language || 'english',
    metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
    dailyQuestionCounts: user.dailyQuestionCounts || { 
      flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
    }
  };
}

/**
 * Normalizes user records, ensuring both camelCase and snake_case properties are available
 */
export function normalizeUserRecords(users: any[]): User[] {
  if (!users || !Array.isArray(users)) return [];
  return users.map(user => normalizeUser(user));
}

export default {
  normalizeUser,
  normalizeUserRecords
};
