
export interface ContentType {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIProcessingOptions {
  language?: string;
  contentType?: string;
  difficulty?: string;
  confidence?: number;
  maxLength?: number;
  includeMetadata?: boolean;
}

export interface ItalianQuestionGenerationParams {
  contentTypes: string[];
  difficulty: string;
  count?: number;
  topic?: string;
  includeImages?: boolean;
  isCitizenshipFocused?: boolean;
}

export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: string;
  difficulty: string;
  isCitizenshipRelevant?: boolean;
  question: string;
  questionType: string;
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface TTSOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
}
