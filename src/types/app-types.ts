
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
  settings?: any;
  updateSettings?: (settings: any) => void;
  generateContent?: (prompt: string, options?: any) => Promise<string>;
  processAudioStream?: (stream: MediaStream) => Promise<string>;
  stopAudioProcessing?: () => void;
  isTranscribing?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
  resetCredits?: () => Promise<void>;
}

export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';

export type ContentType = 
  | 'flashcards'
  | 'multiple-choice'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'pdf'
  | 'unknown'
  | 'json';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warning';

export interface QuestionGenerationParams {
  language?: string;
  difficulty?: DifficultyLevel;
  contentTypes?: string[];
  focusAreas?: string[];
  count?: number;
  isCitizenshipFocused?: boolean;
  context?: string;
  italianLevel?: DifficultyLevel;
  testSection?: string;
  topics?: string[];
}

export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: string;
  difficulty: string;
  isCitizenshipRelevant?: boolean;
}

export interface AIGenerationResult {
  questions: AIQuestion[];
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferredLanguage?: string;
  italianLevel?: DifficultyLevel;
  learningGoals?: string[];
  completedLessons?: number;
  citizenshipFocus?: boolean;
  examDate?: Date;
}

export interface EnhancedErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

// Content processing props
export interface AIContentProcessorProps {
  settings: {
    language: string;
    difficulty: string;
    contentTypes: string[];
    focusAreas?: string[];
  };
  onContentGenerated?: (content: any[]) => void;
  onError?: (error: string) => void;
}

export interface ProcessContentOptions {
  maxLength?: number;
  format?: string;
  temperature?: number;
  count?: number;
  difficulty?: string;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  model?: string;
}

export interface ConfidenceIndicatorProps {
  contentType?: ContentType;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface LevelBadgeProps {
  level: number;
  showInfo?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
