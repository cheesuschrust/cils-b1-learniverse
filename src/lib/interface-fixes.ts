
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
  }  
  
  export interface FlashcardComponentProps {  
    card: Flashcard;  
    onUpdate?: (card: Flashcard) => void;  
    onDelete?: (id: string) => void;  
    showActions?: boolean;  
  }  
  
  export interface ReviewSchedule {  
    interval: number;  
    dueDate: Date;  
    difficulty: number;  
  }  
  
  export interface ReviewPerformance {  
    score: number;  
    time: number;  
    date: Date;  
  }  
  
  export interface User {  
    id: string;  
    email: string;  
    firstName?: string;  
    lastName?: string;  
    isPremiumUser: boolean;  
  }  
  
  export interface AISettings {  
    model: string;  
    temperature: number;  
    maxTokens: number;  
    topP: number;  
    frequencyPenalty: number;  
    presencePenalty: number;  
    showFeedback?: boolean;  
  }  
