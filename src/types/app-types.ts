
import { Session, User } from '@supabase/supabase-js';  

// Core Types  
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';  
export type ContentType = 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'culture';  
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';  

// Fixed parameter type for generateQuestions  
export interface QuestionGenerationParams {  
  language: string;  
  difficulty: DifficultyLevel;  
  contentTypes: ContentType[];  
  focusAreas?: string[];  
  count?: number;  
  context?: string;  
  isCitizenshipFocused?: boolean;  
}  

export interface AIQuestion {  
  id: string;  
  text: string;  
  options?: string[];  
  correctAnswer: string;  
  explanation?: string;  
  type: ContentType;  
  difficulty: DifficultyLevel;  
  isCitizenshipRelevant?: boolean;  
}  

export interface AIGenerationResult {  
  questions: AIQuestion[];  
  error?: string;  
}  

// User related types  
export interface UserProfile {  
  id: string;  
  email: string;  
  username?: string;  
  avatar_url?: string;  
  created_at: string;  
  italian_level?: DifficultyLevel;  
}  

// Context Types  
export interface AuthContextType {  
  session: Session | null;  
  user: User | null;  
  profile: UserProfile | null;  
  isLoading: boolean;  
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;  
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;  
  signOut: () => Promise<void>;  
  refreshProfile: () => Promise<void>;  
}  

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

// Component Props  
export interface EnhancedErrorBoundaryProps {  
  fallback?: React.ReactNode;  
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;  
  children: React.ReactNode;  
}  

export interface AIContentProcessorProps {  
  settings: {  
    language: string;  
    difficulty: DifficultyLevel;  
    contentTypes: ContentType[];  
    focusAreas?: string[];  
  };  
  onContentGenerated?: (content: AIQuestion[]) => void;  
  onError?: (error: string) => void;  
}  

export interface CitizenshipContentProps {  
  settings: {  
    italianLevel: DifficultyLevel;  
    testSection: ContentType;  
    isCitizenshipFocused: boolean;  
    topics: string[];  
  };  
  onContentGenerated?: (content: AIQuestion[]) => void;  
  onError?: (error: string) => void;  
}  

export interface FlashcardComponentProps {  
  card: Flashcard;  
  onUpdate?: (card: Flashcard) => void;  
  onDelete?: (id: string) => void;  
  showActions?: boolean;
}  

export interface ItalianPracticeProps {  
  testSection: ContentType;  
  level: DifficultyLevel;  
  isCitizenshipMode: boolean;  
  onComplete?: (results: {score: number; time: number}) => void;  
}  

export interface DocumentUploaderProps {  
  onUpload?: (file: File) => void;  
  allowedTypes?: string[];  
  maxSize?: number;  
  isLoading?: boolean;
  onUploadComplete?: (documentId: string, questions: any[]) => void;
}  

export interface AISettingsProps {  
  initialSettings?: {  
    difficulty: DifficultyLevel;  
    contentTypes: ContentType[];  
    focusAreas: string[];  
    isCitizenshipFocused: boolean;  
  };  
  onSave?: (settings: any) => void;  
}

export interface SpeakableWordProps {
  word: string;
  language?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: string;
  onClick?: () => void;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian?: string;
  english?: string;
  difficulty: number;
  tags: string[];
  lastReviewed: Date | null;
  nextReview: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  reviewHistory?: any[];
  level?: number;
  mastered?: boolean;
  explanation?: string;
  examples?: string[];
}

// Fix duplicate ContentType references
export type ExtendedContentType = ContentType | 'pdf' | 'json' | 'multiple-choice' | 'flashcards';

// Fix for ConfidenceIndicatorProps
export interface ConfidenceIndicatorProps {
  contentType?: ExtendedContentType;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// Re-export these types to fix common missing types
export type ItalianTestSection = ContentType;
export type ItalianLevel = DifficultyLevel;
export type AIGeneratedQuestion = AIQuestion;

export interface CitizenshipReadinessProps {  
  userId: string;  
  onStatusChange?: (readiness: number) => void;  
}
