
import { User } from '@/types/user';
import { Flashcard } from '@/types/flashcard';

/**
 * Normalizes user object properties to ensure compatibility across the codebase
 */
export function normalizeUser(user: any): User {
  if (!user) return null as any;
  
  return {
    id: user.id || user.uid,
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
    },
    uid: user.uid
  };
}

/**
 * Normalizes user records, ensuring consistent property naming
 */
export function normalizeUserRecords(users: any[]): User[] {
  if (!users || !Array.isArray(users)) return [];
  return users.map(user => normalizeUser(user));
}

/**
 * Normalizes flashcard data to ensure consistency
 */
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) return null as any;
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    level: card.level || 0,
    tags: card.tags || [],
    nextReview: card.nextReview || card.dueDate || new Date(),
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    mastered: card.mastered || false,
    italian: card.italian,
    english: card.english
  };
}

/**
 * Convert legacy user format to current User format
 */
export function convertLegacyUser(user: any): User {
  return normalizeUser(user);
}

export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  convertLegacyUser
};
