
export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
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

export interface ItalianQuestionGenerationParams {
  contentTypes: string[];
  difficulty: string;
  count?: number;
  topic?: string;
  includeImages?: boolean;
  isCitizenshipFocused?: boolean;
}

export interface UseAIReturn {
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  loadModel: (modelName: string) => Promise<boolean>;
  speak: (text: string, language?: string) => Promise<void>;
  recognizeSpeech: (audio: Blob) => Promise<string>;
  compareTexts: (text1: string, text2: string) => Promise<number>;
  processContent: (content: string, options?: any) => Promise<any>;
  isAIEnabled: boolean;
  status: string;
  isModelLoaded: boolean;
}
