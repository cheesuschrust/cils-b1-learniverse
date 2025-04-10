
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  lastActive?: Date;
  preferredLanguage?: string;
}

export interface UserSession {
  user: User | null;
  isLoggedIn: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

// Helper function to normalize user data from different sources
export function normalizeUser(user: any): User {
  if (!user) return {} as User;
  
  return {
    id: user.id || user.uid || '',
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    displayName: user.displayName || user.display_name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || '',
    photoURL: user.photoURL || user.photo_url || user.avatar_url || '',
    isVerified: user.isVerified || user.is_verified || false,
    createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : undefined,
    updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : undefined,
    lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
    lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
    preferredLanguage: user.preferredLanguage || user.preferred_language || 'en',
  };
}

// Helper function to convert array of user records
export function normalizeUserRecords(users: any[]): User[] {
  if (!users || !Array.isArray(users)) return [];
  return users.map(normalizeUser);
}

// Handle legacy user format conversion
export function convertLegacyUser(legacyUser: any): User {
  return normalizeUser({
    id: legacyUser.uid,
    first_name: legacyUser.first_name,
    last_name: legacyUser.last_name,
    photo_url: legacyUser.photo_url,
    display_name: legacyUser.display_name,
    is_verified: legacyUser.is_verified,
    created_at: legacyUser.created_at,
    updated_at: legacyUser.updated_at,
    last_login: legacyUser.last_login,
    last_active: legacyUser.last_active,
    preferred_language: legacyUser.preferred_language,
  });
}
