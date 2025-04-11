
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flashcard_sets: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean
          is_public: boolean
          language: string
          name: string
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          is_public?: boolean
          language?: string
          name: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          is_public?: boolean
          language?: string
          name?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_sets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      flashcards: {
        Row: {
          back: string
          category_id: string | null
          created_at: string | null
          created_by: string | null
          difficulty: number | null
          english: string
          front: string
          id: string
          italian: string
          set_id: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          back: string
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: number | null
          english: string
          front: string
          id?: string
          italian: string
          set_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          back?: string
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: number | null
          english?: string
          front?: string
          id?: string
          italian?: string
          set_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_set_id_fkey"
            columns: ["set_id"]
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_flashcard_progress: {
        Row: {
          created_at: string | null
          ease_factor: number | null
          flashcard_id: string | null
          id: string
          interval_days: number | null
          next_review: string | null
          review_count: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          ease_factor?: number | null
          flashcard_id?: string | null
          id?: string
          interval_days?: number | null
          next_review?: string | null
          review_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          ease_factor?: number | null
          flashcard_id?: string | null
          id?: string
          interval_days?: number | null
          next_review?: string | null
          review_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_flashcard_progress_flashcard_id_fkey"
            columns: ["flashcard_id"]
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_flashcard_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          is_premium: boolean
          last_login_at: string | null
          last_name: string | null
          premium_until: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id: string
          is_premium?: boolean
          last_login_at?: string | null
          last_name?: string | null
          premium_until?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          is_premium?: boolean
          last_login_at?: string | null
          last_name?: string | null
          premium_until?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          correct_answers: number
          id: string
          last_activity_date: string | null
          listening_score: number | null
          questions_answered: number
          reading_score: number | null
          speaking_score: number | null
          streak_days: number
          updated_at: string
          user_id: string
          writing_score: number | null
        }
        Insert: {
          correct_answers?: number
          id?: string
          last_activity_date?: string | null
          listening_score?: number | null
          questions_answered?: number
          reading_score?: number | null
          speaking_score?: number | null
          streak_days?: number
          updated_at?: string
          user_id: string
          writing_score?: number | null
        }
        Update: {
          correct_answers?: number
          id?: string
          last_activity_date?: string | null
          listening_score?: number | null
          questions_answered?: number
          reading_score?: number | null
          speaking_score?: number | null
          streak_days?: number
          updated_at?: string
          user_id?: string
          writing_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_premium_user: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
