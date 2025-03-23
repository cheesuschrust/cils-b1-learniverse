
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  username?: string;
  role: 'user' | 'admin' | 'teacher';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  phoneNumber?: string;
  address?: string;
  isVerified?: boolean;
  status?: 'active' | 'suspended' | 'pending';
  subscription?: 'free' | 'basic' | 'premium';
  preferredLanguage: 'english' | 'italian' | 'both';
  profileImage?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  dailyQuestionCounts: {
    grammar: number;
    vocabulary: number;
    listening: number;
    reading: number;
    writing: number;
  };
  metrics: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    accuracy: number;
    streak: number;
  };
  lastActive: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  emailNotifications: boolean;
  dailyReminders: boolean;
  soundEffects: boolean;
  autoPlayAudio: boolean;
  contentDifficulty: 'beginner' | 'intermediate' | 'advanced';
  bio?: string;
}

export interface EmailSettings {
  provider: 'smtp' | 'sendgrid' | 'mailgun';
  fromEmail: string;
  fromName: string;
  config: {
    enableSsl: boolean;
    host: string;
    port: number;
    username: string;
    password: string;
  };
  templates: {
    verification: {
      subject: string;
      body: string;
    };
    passwordReset: {
      subject: string;
      body: string;
    };
    welcome: {
      subject: string;
      body: string;
    };
  };
  dailyDigest: boolean;
  notifications: boolean;
  marketing: boolean;
  newFeatures: boolean;
}

export type LogCategory = 
  | 'auth' 
  | 'user' 
  | 'content' 
  | 'system' 
  | 'admin' 
  | 'question';

export interface LogEntry {
  id: string;
  timestamp: string;
  category: LogCategory;
  action: string;
  details?: string;
  level: 'info' | 'warning' | 'error';
  userId?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'lesson' | 'exercise' | 'quiz';
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

export interface MockDatabase {
  users: User[];
  logs: LogEntry[];
  content: ContentItem[];
}

export interface AdConfiguration {
  enabled: boolean;
  provider: 'google' | 'facebook' | 'custom';
  adUnits: {
    id: string;
    name: string;
    type: 'banner' | 'interstitial' | 'native';
    placement: 'header' | 'footer' | 'sidebar' | 'content';
    active: boolean;
  }[];
  settings: {
    frequency: number;
    showToFreeUsers: boolean;
    showToPremiumUsers: boolean;
  };
}

export interface SEOConfiguration {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  siteMap: {
    enabled: boolean;
    lastGenerated: string;
  };
  robotsTxt: {
    enabled: boolean;
    content: string;
  };
  analytics: {
    provider: 'google' | 'matomo' | 'custom';
    trackingId: string;
    enabled: boolean;
  };
}

export interface SalesConfiguration {
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    type: 'subscription' | 'one-time';
    features: string[];
    active: boolean;
  }[];
  discounts: {
    id: string;
    name: string;
    code: string;
    amount: number;
    type: 'percentage' | 'fixed';
    validFrom: string;
    validTo: string;
    active: boolean;
  }[];
  paymentProviders: {
    name: 'stripe' | 'paypal' | 'other';
    enabled: boolean;
    testMode: boolean;
  }[];
}
