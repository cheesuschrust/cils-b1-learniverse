
export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher';

export type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  language?: 'en' | 'it';
  frequency?: 'daily' | 'weekly' | 'monthly';
  [key: string]: any;
};

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  avatar?: string;
  preferences?: UserPreferences;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'trial' | 'expired';
  subscriptionExpiry?: Date;
  verifiedEmail?: boolean;
}
