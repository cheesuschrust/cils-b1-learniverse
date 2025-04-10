
// AI Model types and interfaces

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  accuracy: number;
  confidenceScore: number;
  isActive: boolean;
  lastTrainedAt?: Date;
  version: string;
}

export interface AIProcessingOptions {
  language?: string;
  confidenceThreshold?: number;
  maxResults?: number;
  processingMode?: 'fast' | 'accurate';
  filterProfanity?: boolean;
}

export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export type TTSOptions = string | {
  voice?: string;
  speed?: number;
  pitch?: number;
};

export interface ItalianQuestionGenerationParams {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics?: string[];
  numberOfQuestions?: number;
  includeExplanations?: boolean;
  format?: 'multiple-choice' | 'fill-in-blank' | 'true-false';
}

export interface AIGeneratedQuestion {
  id: string;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
  confidenceScore: number;
  topic: string;
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  metadata: {
    model: string;
    generationTime: number;
    confidence: number;
  };
}

export interface AIPerformanceMetrics {
  accuracy: number;
  responseTime: number;
  userSatisfaction: number;
  errorRate: number;
  queryVolume: number;
}

export interface AITrainingData {
  id: string;
  content: string;
  label: string;
  source: string;
  languageLevel: string;
  dateAdded: Date;
  isVerified: boolean;
}

export interface AIConfidenceScore {
  overall: number;
  breakdown: {
    [key: string]: number;
  };
  lastUpdated: Date;
}
