
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }[];
  feedback?: {
    helpful: boolean;
    reason?: string;
  };
  context?: {
    previousMessageIds?: string[];
    relatedTopics?: string[];
    knowledgeSourceIds?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  context: {
    userType: 'free' | 'premium';
    language: string;
    [key: string]: any;
  };
  resolved: boolean;
  escalatedToHuman: boolean;
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  relevance: number;
  lastUpdated: Date;
  keywords: string[];
  version: string;
}

export interface ChatbotSettings {
  enabled: boolean;
  name: string;
  avatarUrl: string;
  welcomeMessage: string;
  fallbackMessage: string;
  maxContextLength: number;
  confidenceThreshold: number;
  suggestFeedback: boolean;
  suggestRelatedQuestions: boolean;
  escalationThreshold: number;
}

export interface ChatbotTrainingExample {
  id: string;
  query: string;
  response: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  approved: boolean;
  source: 'admin' | 'user-feedback' | 'auto-generated';
}

export interface ChatbotAnalytics {
  totalSessions: number;
  averageSessionLength: number;
  topQueries: {
    query: string;
    count: number;
  }[];
  topCategories: {
    category: string;
    count: number;
  }[];
  feedbackStats: {
    helpful: number;
    notHelpful: number;
    helpfulPercentage: number;
  };
  escalationRate: number;
  responseTimeAverage: number;
}
