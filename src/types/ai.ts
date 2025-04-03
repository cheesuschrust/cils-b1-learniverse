
export interface AIServiceOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
  language?: 'italian' | 'english' | 'both';
  streaming?: boolean;
  confidenceThreshold?: number;
}

export interface AIServiceInterface {
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  classifyText: (text: string) => Promise<Array<{ label: string; score: number }>>;
  getConfidenceScore: (contentType: string) => number;
  addTrainingExamples: (contentType: string, examples: any[]) => number;
  generateFlashcards: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
  generateQuestions: (content: string, count?: number, type?: string) => Promise<any[]>;
  abortRequest: (requestId: string) => void;
  abortAllRequests: () => void;
}

export interface AIContentProcessingResult {
  contentType: string;
  confidence: number;
  language: 'italian' | 'english' | 'mixed' | 'unknown';
  topics: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  questions?: AIGeneratedQuestion[];
  summary?: string;
  keyPoints?: string[];
  error?: string;
}

export interface AIGeneratedQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  confidence: number;
}

export interface AITranslationResult {
  originalText: string;
  translatedText: string;
  language: {
    source: string;
    target: string;
  };
  confidence: number;
}

export interface AIFeedbackResult {
  score: number;
  feedback: string;
  grammarIssues?: Array<{
    text: string;
    explanation: string;
    suggestion: string;
    severity: 'minor' | 'major';
  }>;
  vocabularyFeedback?: string;
  structureFeedback?: string;
  overallScore?: number;
}

export interface AISpeechRecognitionResult {
  text: string;
  confidence: number;
  wordLevelAnalysis?: Array<{
    word: string;
    confidence: number;
    startTime: number;
    endTime: number;
  }>;
  languageDetected?: string;
}

export interface AITrainingData {
  id?: string;
  inputText: string;
  expectedOutput: string;
  contentType: string;
  difficulty: string;
  language: string;
  createdAt?: Date;
  createdBy?: string;
  source?: string;
}

export interface AIModelPerformance {
  modelName: string;
  version: string;
  accuracy: number;
  confidenceScore: number;
  metrics: Record<string, number>;
  trainingDate?: Date;
}
