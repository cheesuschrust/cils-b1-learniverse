
import { createClient } from '@supabase/supabase-js';

// Define mock database schema
export type Database = {
  Tables: {
    flashcard_sets: {
      Row: {
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
      };
      Insert: {
        id?: string;
        name: string;
        description?: string | null;
        language: string;
        category?: string | null;
        is_public?: boolean;
        is_favorite?: boolean;
        tags?: string[] | null;
        user_id?: string | null;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        name?: string;
        description?: string | null;
        language?: string;
        category?: string | null;
        is_public?: boolean;
        is_favorite?: boolean;
        tags?: string[] | null;
        user_id?: string | null;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: [
        {
          foreignKeyName: "flashcard_sets_user_id_fkey"
          columns: ["user_id"]
          isOneToOne: false
          referencedRelation: "user_profiles"
          referencedColumns: ["id"]
        }
      ]
    },
    flashcards: {
      Row: {
        id: string;
        set_id: string;
        front: string;
        back: string;
        hint: string | null;
        tags: string[] | null;
        difficulty: number;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        set_id: string;
        front: string;
        back: string;
        hint?: string | null;
        tags?: string[] | null;
        difficulty?: number;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        set_id?: string;
        front?: string;
        back?: string;
        hint?: string | null;
        tags?: string[] | null;
        difficulty?: number;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: [
        {
          foreignKeyName: "flashcards_set_id_fkey"
          columns: ["set_id"]
          isOneToOne: false
          referencedRelation: "flashcard_sets"
          referencedColumns: ["id"]
        }
      ]
    },
    user_flashcard_progress: {
      Row: {
        id: string;
        user_id: string;
        flashcard_id: string;
        confidence: number;
        last_reviewed: string;
        next_review: string;
        review_count: number;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        user_id: string;
        flashcard_id: string;
        confidence?: number;
        last_reviewed?: string;
        next_review?: string;
        review_count?: number;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        user_id?: string;
        flashcard_id?: string;
        confidence?: number;
        last_reviewed?: string;
        next_review?: string;
        review_count?: number;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: [
        {
          foreignKeyName: "user_flashcard_progress_flashcard_id_fkey"
          columns: ["flashcard_id"]
          isOneToOne: false
          referencedRelation: "flashcards"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "user_flashcard_progress_user_id_fkey"
          columns: ["user_id"]
          isOneToOne: false
          referencedRelation: "user_profiles"
          referencedColumns: ["id"]
        }
      ]
    },
    user_profiles: {
      Row: {
        id: string;
        auth_id: string;
        first_name: string | null;
        last_name: string | null;
        display_name: string | null;
        avatar_url: string | null;
        language_level: string | null;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        auth_id: string;
        first_name?: string | null;
        last_name?: string | null;
        display_name?: string | null;
        avatar_url?: string | null;
        language_level?: string | null;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        auth_id?: string;
        first_name?: string | null;
        last_name?: string | null;
        display_name?: string | null;
        avatar_url?: string | null;
        language_level?: string | null;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: []
    },
    user_stats: {
      Row: {
        id: string;
        user_id: string;
        cards_studied: number;
        study_streak: number;
        last_studied: string | null;
        total_study_time: number;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        user_id: string;
        cards_studied?: number;
        study_streak?: number;
        last_studied?: string | null;
        total_study_time?: number;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        user_id?: string;
        cards_studied?: number;
        study_streak?: number;
        last_studied?: string | null;
        total_study_time?: number;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: [
        {
          foreignKeyName: "user_stats_user_id_fkey"
          columns: ["user_id"]
          isOneToOne: true
          referencedRelation: "user_profiles"
          referencedColumns: ["id"]
        }
      ]
    },
    content: {
      Row: {
        id: string;
        title: string;
        description: string;
        content_type: string;
        difficulty: string;
        language: string;
        tags: string[];
        created_by: string;
        is_published: boolean;
        raw_content: string | null;
        file_url: string | null;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        title: string;
        description: string;
        content_type: string;
        difficulty: string;
        language: string;
        tags?: string[];
        created_by: string;
        is_published?: boolean;
        raw_content?: string | null;
        file_url?: string | null;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        title?: string;
        description?: string;
        content_type?: string;
        difficulty?: string;
        language?: string;
        tags?: string[];
        created_by?: string;
        is_published?: boolean;
        raw_content?: string | null;
        file_url?: string | null;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: [
        {
          foreignKeyName: "content_created_by_fkey"
          columns: ["created_by"]
          isOneToOne: false
          referencedRelation: "user_profiles"
          referencedColumns: ["id"]
        }
      ]
    },
    questions: {
      Row: {
        id: string;
        content_id: string;
        question: string;
        question_type: string;
        difficulty: string;
        language: string;
        created_by: string;
        options?: string[];
        correct_answer: string;
        explanation?: string;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        content_id: string;
        question: string;
        question_type: string;
        difficulty: string;
        language: string;
        created_by: string;
        options?: string[];
        correct_answer: string;
        explanation?: string;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        content_id?: string;
        question?: string;
        question_type?: string;
        difficulty?: string;
        language?: string;
        created_by?: string;
        options?: string[];
        correct_answer?: string;
        explanation?: string;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: [
        {
          foreignKeyName: "questions_content_id_fkey"
          columns: ["content_id"]
          isOneToOne: false
          referencedRelation: "content"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "questions_created_by_fkey"
          columns: ["created_by"]
          isOneToOne: false
          referencedRelation: "user_profiles"
          referencedColumns: ["id"]
        }
      ]
    }
  };
  Views: {};
  Functions: {};
  Enums: {};
  CompositeTypes: {};
};

// Default Supabase URL and key for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-api-key';

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
