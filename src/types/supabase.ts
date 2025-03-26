
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
          subscription: string
          is_verified: boolean
          created_at: string
          last_login: string | null
          last_active: string | null
          preferred_language: string
          status: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          subscription?: string
          is_verified?: boolean
          created_at?: string
          last_login?: string | null
          last_active?: string | null
          preferred_language?: string
          status?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          subscription?: string
          is_verified?: boolean
          created_at?: string
          last_login?: string | null
          last_active?: string | null
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
      content: {
        Row: {
          id: string
          title: string
          description: string
          content_type: string
          difficulty: string
          created_by: string
          created_at: string
          updated_at: string
          published: boolean
          tags: string[] | null
          language: string
          file_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          content_type: string
          difficulty: string
          created_by: string
          created_at?: string
          updated_at?: string
          published?: boolean
          tags?: string[] | null
          language?: string
          file_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content_type?: string
          difficulty?: string
          created_by?: string
          created_at?: string
          updated_at?: string
          published?: boolean
          tags?: string[] | null
          language?: string
          file_url?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          text: string
          options: string[]
          correct_answer: string
          explanation: string | null
          difficulty: string
          category: string
          tags: string[] | null
          created_at: string
          updated_at: string
          language: string
          type: string
          time_limit: number | null
          points: number
          content_id: string | null
        }
        Insert: {
          id?: string
          text: string
          options: string[]
          correct_answer: string
          explanation?: string | null
          difficulty: string
          category: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          language?: string
          type?: string
          time_limit?: number | null
          points?: number
          content_id?: string | null
        }
        Update: {
          id?: string
          text?: string
          options?: string[]
          correct_answer?: string
          explanation?: string | null
          difficulty?: string
          category?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          language?: string
          type?: string
          time_limit?: number | null
          points?: number
          content_id?: string | null
        }
      }
      question_sets: {
        Row: {
          id: string
          title: string
          description: string
          difficulty: string
          category: string
          tags: string[] | null
          created_at: string
          updated_at: string
          created_by: string
          is_public: boolean
          time_limit: number | null
          passing_score: number
          language: string
          instructions: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          difficulty: string
          category: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by: string
          is_public?: boolean
          time_limit?: number | null
          passing_score?: number
          language?: string
          instructions?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          difficulty?: string
          category?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string
          is_public?: boolean
          time_limit?: number | null
          passing_score?: number
          language?: string
          instructions?: string | null
        }
      }
      question_set_questions: {
        Row: {
          id: string
          question_set_id: string
          question_id: string
          order: number
        }
        Insert: {
          id?: string
          question_set_id: string
          question_id: string
          order?: number
        }
        Update: {
          id?: string
          question_set_id?: string
          question_id?: string
          order?: number
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          question_set_id: string
          started_at: string
          completed_at: string | null
          score: number
          time_spent: number
          created_at: string
          completed: boolean
          passed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          question_set_id: string
          started_at?: string
          completed_at?: string | null
          score?: number
          time_spent?: number
          created_at?: string
          completed?: boolean
          passed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          question_set_id?: string
          started_at?: string
          completed_at?: string | null
          score?: number
          time_spent?: number
          created_at?: string
          completed?: boolean
          passed?: boolean
        }
      }
      quiz_answers: {
        Row: {
          id: string
          quiz_attempt_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          time_spent: number
        }
        Insert: {
          id?: string
          quiz_attempt_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          time_spent: number
        }
        Update: {
          id?: string
          quiz_attempt_id?: string
          question_id?: string
          selected_answer?: string
          is_correct?: boolean
          time_spent?: number
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
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
