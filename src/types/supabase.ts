
export interface Database {
  public: {
    Tables: {
      flashcard_sets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string | null;
          tags: string[] | null;
          language: string;
          is_public: boolean;
          is_favorite: boolean;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category?: string | null;
          tags?: string[] | null;
          language: string;
          is_public?: boolean;
          is_favorite?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          tags?: string[] | null;
          language?: string;
          is_public?: boolean;
          is_favorite?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      flashcards: {
        Row: {
          id: string;
          front: string;
          back: string;
          set_id: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          front: string;
          back: string;
          set_id: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          front?: string;
          back?: string;
          set_id?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_flashcard_progress: {
        Row: {
          id: string;
          user_id: string;
          flashcard_id: string;
          status: string;
          ease_factor: number;
          interval: number;
          due_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          flashcard_id: string;
          status?: string;
          ease_factor?: number;
          interval?: number;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          flashcard_id?: string;
          status?: string;
          ease_factor?: number;
          interval?: number;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          xp_total: number;
          streak_current: number;
          streak_longest: number;
          cards_studied: number;
          cards_mastered: number;
          minutes_studied: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          xp_total?: number;
          streak_current?: number;
          streak_longest?: number;
          cards_studied?: number;
          cards_mastered?: number;
          minutes_studied?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          xp_total?: number;
          streak_current?: number;
          streak_longest?: number;
          cards_studied?: number;
          cards_mastered?: number;
          minutes_studied?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
