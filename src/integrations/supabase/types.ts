export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_providers: {
        Row: {
          capabilities: string[] | null
          configuration: Json
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          provider_type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          capabilities?: string[] | null
          configuration: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          provider_type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          capabilities?: string[] | null
          configuration?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          provider_type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_providers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_providers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_training_data: {
        Row: {
          content_type: string
          created_at: string
          created_by: string | null
          difficulty: string
          expected_output: string
          id: string
          input_text: string
          language: string
          source: string | null
        }
        Insert: {
          content_type: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          expected_output: string
          id?: string
          input_text: string
          language?: string
          source?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          expected_output?: string
          id?: string
          input_text?: string
          language?: string
          source?: string | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          exam_section: string | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          exam_section?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          exam_section?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_questions: {
        Row: {
          category: string
          correct_answer: string
          created_at: string
          difficulty: string
          explanation: string | null
          id: string
          is_premium: boolean
          options: Json
          question_date: string
          question_text: string
        }
        Insert: {
          category: string
          correct_answer: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          is_premium?: boolean
          options: Json
          question_date: string
          question_text: string
        }
        Update: {
          category?: string
          correct_answer?: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          is_premium?: boolean
          options?: Json
          question_date?: string
          question_text?: string
        }
        Relationships: []
      }
      data_requests: {
        Row: {
          completed_at: string | null
          handled_by: string | null
          id: string
          notes: string | null
          request_details: string | null
          request_type: string
          requested_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          request_details?: string | null
          request_type: string
          requested_at?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          request_details?: string | null
          request_type?: string
          requested_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_requests_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: []
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
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_content: {
        Row: {
          category_id: string | null
          content: Json
          content_type: string
          created_at: string | null
          created_by: string | null
          difficulty: string | null
          id: string
          premium: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category_id?: string | null
          content: Json
          content_type: string
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          id?: string
          premium?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category_id?: string | null
          content?: Json
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          id?: string
          premium?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          occurred_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          occurred_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          occurred_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_id_monthly: string | null
          price_id_yearly: string | null
          price_monthly: number | null
          price_yearly: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_id_monthly?: string | null
          price_id_yearly?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_id_monthly?: string | null
          price_id_yearly?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_name: string
          achievement_type: string
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_name: string
          achievement_type: string
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_name?: string
          achievement_type?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
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
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          data_retention_policy: string | null
          difficulty_level: string | null
          notification_settings: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string
          voice_enabled: boolean | null
          voice_speed: number | null
        }
        Insert: {
          created_at?: string | null
          data_retention_policy?: string | null
          difficulty_level?: string | null
          notification_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
          voice_enabled?: boolean | null
          voice_speed?: number | null
        }
        Update: {
          created_at?: string | null
          data_retention_policy?: string | null
          difficulty_level?: string | null
          notification_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
          voice_enabled?: boolean | null
          voice_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
        Relationships: []
      }
      user_progress: {
        Row: {
          answers: Json | null
          completed: boolean | null
          content_id: string | null
          created_at: string | null
          id: string
          last_activity: string | null
          progress_percentage: number | null
          score: number | null
          time_spent: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          completed?: boolean | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          progress_percentage?: number | null
          score?: number | null
          time_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          completed?: boolean | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          progress_percentage?: number | null
          score?: number | null
          time_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "learning_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
        Relationships: []
      }
      users: {
        Row: {
          account_verified: boolean | null
          auth_provider: string | null
          avatar_url: string | null
          consent_timestamp: string | null
          consent_version: string | null
          created_at: string | null
          data_processing_consent: boolean | null
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          login_count: number | null
          marketing_consent: boolean | null
          preferences: Json | null
          role: string | null
          subscription_expiry: string | null
          subscription_tier: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          account_verified?: boolean | null
          auth_provider?: string | null
          avatar_url?: string | null
          consent_timestamp?: string | null
          consent_version?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          email: string
          full_name?: string | null
          id: string
          last_login?: string | null
          login_count?: number | null
          marketing_consent?: boolean | null
          preferences?: Json | null
          role?: string | null
          subscription_expiry?: string | null
          subscription_tier?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          account_verified?: boolean | null
          auth_provider?: string | null
          avatar_url?: string | null
          consent_timestamp?: string | null
          consent_version?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          login_count?: number | null
          marketing_consent?: boolean | null
          preferences?: Json | null
          role?: string | null
          subscription_expiry?: string | null
          subscription_tier?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
