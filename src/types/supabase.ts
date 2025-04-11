
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
          id: string
          name: string
          description: string | null
          user_id: string | null
          is_public: boolean
          is_favorite: boolean
          created_at: string
          updated_at: string
          category: string | null
          language: string
          tags: string[] | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id?: string | null
          is_public?: boolean
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
          category?: string | null
          language?: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string | null
          is_public?: boolean
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
          category?: string | null
          language?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_sets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      flashcards: {
        Row: {
          id: string
          front: string
          back: string
          user_id: string | null
          set_id: string | null
          created_at: string
          updated_at: string | null
          difficulty: number | null
          italian: string
          english: string
          tags: string[] | null
          category_id: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          front: string
          back: string
          user_id?: string | null
          set_id?: string | null
          created_at?: string
          updated_at?: string | null
          difficulty?: number | null
          italian: string
          english: string
          tags?: string[] | null
          category_id?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          front?: string
          back?: string
          user_id?: string | null
          set_id?: string | null
          created_at?: string
          updated_at?: string | null
          difficulty?: number | null
          italian?: string
          english?: string
          tags?: string[] | null
          category_id?: string | null
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          question_type: string
          date: string
          count: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          question_type: string
          date: string
          count: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_type?: string
          date?: string
          count?: number
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_flashcard_progress: {
        Row: {
          id: string
          user_id: string | null
          flashcard_id: string | null
          status: string | null
          ease_factor: number | null
          interval_days: number | null
          review_count: number | null
          next_review: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          flashcard_id?: string | null
          status?: string | null
          ease_factor?: number | null
          interval_days?: number | null
          review_count?: number | null
          next_review?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          flashcard_id?: string | null
          status?: string | null
          ease_factor?: number | null
          interval_days?: number | null
          review_count?: number | null
          next_review?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          created_at: string
          updated_at: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          is_premium: boolean
          premium_until: string | null
          last_login_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_premium?: boolean
          premium_until?: string | null
          last_login_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_premium?: boolean
          premium_until?: string | null
          last_login_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          questions_answered: number
          correct_answers: number
          streak_days: number
          updated_at: string
          last_activity_date: string | null
          reading_score: number | null
          writing_score: number | null
          listening_score: number | null
          speaking_score: number | null
        }
        Insert: {
          id?: string
          user_id: string
          questions_answered?: number
          correct_answers?: number
          streak_days?: number
          updated_at?: string
          last_activity_date?: string | null
          reading_score?: number | null
          writing_score?: number | null
          listening_score?: number | null
          speaking_score?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          questions_answered?: number
          correct_answers?: number
          streak_days?: number
          updated_at?: string
          last_activity_date?: string | null
          reading_score?: number | null
          writing_score?: number | null
          listening_score?: number | null
          speaking_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
