
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint: string | null;
  tags: string[];
  difficulty: number;
  created_at: string;
  updated_at: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string | null;
  language: string;
  category: string | null;
  is_public: boolean;
  is_favorite: boolean;
  tags: string[] | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  flashcards?: Flashcard[];
}

export interface UserFlashcardProgress {
  id: string;
  user_id: string;
  flashcard_id: string;
  confidence: number;
  last_reviewed: string;
  next_review: string;
  review_count: number;
  created_at: string;
  updated_at: string;
}
