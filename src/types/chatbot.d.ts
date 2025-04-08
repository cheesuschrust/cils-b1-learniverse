
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'document' | 'audio';
    url: string;
    name: string;
  }[];
  context?: {
    previousMessageIds?: string[];
    relatedContent?: string[];
    confidence?: number;
    metadata?: Record<string, any>;
  };
  feedback?: 'positive' | 'negative' | 'neutral';
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  context: {
    userType?: 'student' | 'teacher' | 'parent' | 'admin';
    language?: string;
    topic?: string;
    level?: string;
    metadata?: Record<string, any>;
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
  language: 'italian' | 'english' | 'both';
}

export interface ChatbotSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  responseTime: 'fast' | 'balanced' | 'thorough';
  personality: 'educational' | 'conversational' | 'playful' | 'professional';
  defaultLanguage: 'italian' | 'english' | 'auto-detect';
  escalationThreshold: number;
  feedbackEnabled: boolean;
  learningEnabled: boolean;
  enabled: boolean;
  name: string;
  avatarUrl: string;
  welcomeMessage: string;
  fallbackMessage: string;
  maxContextLength: number;
  confidenceThreshold: number;
  suggestFeedback: boolean;
  suggestRelatedQuestions: boolean;
}

export interface ChatbotTrainingExample {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  language: 'italian' | 'english' | 'both';
  importance: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}
