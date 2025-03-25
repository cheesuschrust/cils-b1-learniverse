
// Type definitions for chatbot management and training

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
  };
  resolved: boolean;
  escalatedToHuman: boolean; // Required field that was missing
}

export interface ChatbotTrainingExample {
  id: string;
  prompt: string; // Using prompt instead of question
  response: string; // Using response instead of answer
  alternativePrompts?: string[]; // Using alternativePrompts instead of alternatives
  category: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
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
