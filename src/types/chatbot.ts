
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
    lessonId?: string;
    topic?: string;
    learningLevel?: string;
    referrer?: string;
  };
  resolved: boolean;
  escalatedToHuman: boolean;
}

export interface ChatbotTrainingExample {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: Date;
  approved: boolean;
  language: 'english' | 'italian' | 'both';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
