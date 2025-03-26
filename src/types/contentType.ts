
export type ContentType = 
  | 'multiple-choice'
  | 'flashcards'
  | 'writing'
  | 'speaking'
  | 'listening';

export interface ContentFeatures {
  // Multiple choice features
  hasOptions?: boolean;
  optionCount?: number;
  hasCorrectAnswer?: boolean;
  
  // Flashcard features
  hasFrontAndBack?: boolean;
  isTermDefinition?: boolean;
  
  // Writing features
  textLength?: number;
  paragraphCount?: number;
  hasPrompt?: boolean;
  
  // Speaking features
  isDialogue?: boolean;
  hasPronunciation?: boolean;
  
  // Common features
  wordCount?: number;
  sentenceCount?: number;
  questionMarks?: number;
  language?: 'english' | 'italian' | 'mixed';
}
