
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'positive' | 'negative' | 'neutral';
  attachments?: string[];
  context?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  context: {
    lessonId?: string;
    topic?: string;
    learningLevel?: string;
    referrer?: string;
    userType?: 'student' | 'teacher' | 'parent' | 'admin';
    language?: 'english' | 'italian' | 'both';
  };
  resolved: boolean;
  escalatedToHuman: boolean;
}

export interface ChatbotTrainingExample {
  id: string;
  question: string;
  answer: string;
  alternatives?: string[];
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  approved: boolean;
  language: 'english' | 'italian' | 'both';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdBy?: string;
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  language: 'english' | 'italian' | 'both';
  relevance?: number;
  keywords?: string[];
  version?: string;
}

export interface ChatbotSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  responseTime: 'fast' | 'balanced' | 'thorough';
  personality: 'formal' | 'friendly' | 'educational';
  defaultLanguage: 'english' | 'italian' | 'auto-detect';
  escalationThreshold: number;
  feedbackEnabled: boolean;
  learningEnabled: boolean;
  enabled?: boolean;
  name?: string;
  avatarUrl?: string;
  welcomeMessage?: string;
  fallbackMessage?: string;
  confidenceThreshold?: number;
  maxContextLength?: number;
  suggestFeedback?: boolean;
  suggestRelatedQuestions?: boolean;
}
