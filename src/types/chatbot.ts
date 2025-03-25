
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: {
    id: string;
    type: 'image' | 'file' | 'audio';
    url: string;
    name: string;
  }[];
  feedback?: {
    helpful: boolean;
    reason?: string;
  };
  context?: {
    page?: string;
    feature?: string;
    previousMessageIds?: string[];
  };
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  context?: {
    userType: 'free' | 'premium';
    language: string;
    referringPage?: string;
    userLevel?: string;
  };
  resolved?: boolean;
  escalatedToHuman?: boolean;
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

export interface ChatbotTrainingExample {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approved: boolean;
  alternatives?: string[]; // Alternative phrasings of the question
}

export interface ChatbotSettings {
  enabled: boolean;
  name: string;
  avatarUrl?: string;
  welcomeMessage: string;
  fallbackMessage: string;
  maxContextLength: number;
  confidenceThreshold: number; // Minimum confidence score to provide an answer
  suggestFeedback: boolean;
  suggestRelatedQuestions: boolean;
  escalationThreshold: number; // Number of low-confidence responses before suggesting human help
  operatingHours?: {
    timezone: string;
    schedule: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      start: string; // HH:MM format
      end: string; // HH:MM format
    }[];
  };
}
