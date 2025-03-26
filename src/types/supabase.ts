
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
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: string
          is_verified: boolean
          created_at: string
          last_login: string | null
          last_active: string | null
          subscription: string
          preferred_language: string
          status: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          is_verified?: boolean
          created_at?: string
          last_login?: string | null
          last_active?: string | null
          subscription?: string
          preferred_language?: string
          status?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          is_verified?: boolean
          created_at?: string
          last_login?: string | null
          last_active?: string | null
          subscription?: string
          preferred_language?: string
          status?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          email_notifications: boolean
          language: string
          difficulty: string
          font_size: number | null
          notifications_enabled: boolean
          animations_enabled: boolean
          voice_speed: number | null
          auto_play_audio: boolean
          show_progress_metrics: boolean
          ai_enabled: boolean
          ai_model_size: string | null
          ai_processing_on_device: boolean
          confidence_score_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          email_notifications?: boolean
          language?: string
          difficulty?: string
          font_size?: number | null
          notifications_enabled?: boolean
          animations_enabled?: boolean
          voice_speed?: number | null
          auto_play_audio?: boolean
          show_progress_metrics?: boolean
          ai_enabled?: boolean
          ai_model_size?: string | null
          ai_processing_on_device?: boolean
          confidence_score_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          email_notifications?: boolean
          language?: string
          difficulty?: string
          font_size?: number | null
          notifications_enabled?: boolean
          animations_enabled?: boolean
          voice_speed?: number | null
          auto_play_audio?: boolean
          show_progress_metrics?: boolean
          ai_enabled?: boolean
          ai_model_size?: string | null
          ai_processing_on_device?: boolean
          confidence_score_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_metrics: {
        Row: {
          id: string
          user_id: string
          total_questions: number
          correct_answers: number
          streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_questions?: number
          correct_answers?: number
          streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_questions?: number
          correct_answers?: number
          streak?: number
          created_at?: string
          updated_at?: string
        }
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
          last_updated: string
        }
        Update: {
          id?: string
          user_id?: string
          question_type?: string
          date?: string
          count?: number
          last_updated?: string
        }
      }
      content: {
        Row: {
          id: string
          title: string
          description: string
          content_type: string
          difficulty: string
          language: string
          tags: string[] | null
          created_at: string
          updated_at: string
          created_by: string
          is_published: boolean
          raw_content: string | null
          file_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string
          content_type: string
          difficulty?: string
          language?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by: string
          is_published?: boolean
          raw_content?: string | null
          file_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content_type?: string
          difficulty?: string
          language?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string
          is_published?: boolean
          raw_content?: string | null
          file_url?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          content_id: string | null
          question: string
          question_type: string
          options: Json | null
          correct_answer: string
          explanation: string | null
          difficulty: string
          tags: string[] | null
          created_at: string
          updated_at: string
          created_by: string
          language: string
        }
        Insert: {
          id?: string
          content_id?: string | null
          question: string
          question_type: string
          options?: Json | null
          correct_answer: string
          explanation?: string | null
          difficulty?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by: string
          language?: string
        }
        Update: {
          id?: string
          content_id?: string | null
          question?: string
          question_type?: string
          options?: Json | null
          correct_answer?: string
          explanation?: string | null
          difficulty?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string
          language?: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
