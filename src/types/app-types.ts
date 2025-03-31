
// Context Types  
export interface AIUtilsContextType {  
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;  
  isGenerating: boolean;  
  remainingCredits: number;  
  usageLimit: number;
  speak?: (text: string, language?: string) => Promise<void>;
  recognizeSpeech?: (audioBlob: Blob) => Promise<string>;
  compareTexts?: (text1: string, text2: string) => Promise<number>;
  processContent?: (prompt: string, options?: any) => Promise<string>;
  isProcessing?: boolean;
  isAIEnabled?: boolean;
  speakText?: (text: string, language?: string, onComplete?: () => void) => void;
  isSpeaking?: boolean;
}
