
// Auth related type definitions 

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: any;
  token?: string;
}

export interface EmailSettings {
  provider: string;
  fromEmail: string;
  fromName: string;
  templates: Record<string, any>;
  replyToEmail?: string;
  apiKey?: string;
  region?: string;
  config?: any;
  temporaryInboxDuration?: number; // In hours
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  variables: string[];
  lastUpdated: Date;
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  USER_NOT_FOUND = 'auth/user-not-found',
  EMAIL_ALREADY_EXISTS = 'auth/email-already-exists',
  WEAK_PASSWORD = 'auth/weak-password',
  EXPIRED_TOKEN = 'auth/expired-token',
  INVALID_TOKEN = 'auth/invalid-token',
  REQUIRES_RECENT_LOGIN = 'auth/requires-recent-login',
  NETWORK_ERROR = 'auth/network-error',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  INTERNAL_ERROR = 'auth/internal-error',
  ACCOUNT_SUSPENDED = 'auth/account-suspended',
  EMAIL_NOT_VERIFIED = 'auth/email-not-verified'
}
