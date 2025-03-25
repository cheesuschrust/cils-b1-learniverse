
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  explanation?: string;
  example?: string;
  level: number;
  dueDate: Date;
  mastered: boolean;
  setId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportOptions {
  format: 'csv' | 'txt' | 'json' | 'anki';
  separator: string;
  hasHeader: boolean;
  italianColumn: number;
  englishColumn: number;
  setName?: string;
}

export interface ImportResult {
  imported: number;
  failed: number;
  errors: { line: string; reason: string }[];
}
