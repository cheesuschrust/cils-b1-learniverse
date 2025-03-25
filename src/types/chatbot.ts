
// Type definitions for chatbot management and training

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
  feedback?: {
    helpful: boolean;
    reason?: string;
  };
  context?: {
    previousMessageIds?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  context: {
    userLevel?: string;
    currentLesson?: string;
    recentTopics?: string[];
    language?: string;
    userType?: string;
  };
  resolved: boolean;
  escalatedToHuman: boolean;
}

export interface ChatbotTrainingExample {
  id: string;
  prompt: string;
  response: string;
  alternativePrompts?: string[];
  category: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional properties
  question?: string; // alias for prompt
  answer?: string; // alias for response
  alternatives?: string[]; // alias for alternativePrompts
  approved?: boolean; // approval status
  tags?: string[]; // categorization tags
}

export interface ChatbotConfig {
  enabled: boolean;
  name: string;
  personality: string;
  defaultLanguage: string;
  model: string;
  temperature: number;
  maxResponseTokens: number;
  welcomeMessage: string;
}

export interface ChatbotAnalytics {
  totalSessions: number;
  averageMessagesPerSession: number;
  mostCommonQueries: {
    query: string;
    count: number;
  }[];
  resolutionRate: number;
  escalationRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
}

export interface ChatbotFeedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
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
  matchScore?: number;
}
