export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_results: {
        Row: {
          answers: Json | null
          assessment_id: string
          created_at: string
          follow_up_prompts: Json | null
          id: string
          result_narrative: string | null
          saved_to_memory: boolean | null
          scores: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          assessment_id: string
          created_at?: string
          follow_up_prompts?: Json | null
          id?: string
          result_narrative?: string | null
          saved_to_memory?: boolean | null
          scores?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          assessment_id?: string
          created_at?: string
          follow_up_prompts?: Json | null
          id?: string
          result_narrative?: string | null
          saved_to_memory?: boolean | null
          scores?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          questions: Json | null
          questions_count: number | null
          result_narratives: Json | null
          scoring_logic: Json | null
          short_description: string | null
          tags: string[] | null
          title: string
          updated_at: string
          visibility:
            | Database["public"]["Enums"]["assessment_visibility"]
            | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json | null
          questions_count?: number | null
          result_narratives?: Json | null
          scoring_logic?: Json | null
          short_description?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          visibility?:
            | Database["public"]["Enums"]["assessment_visibility"]
            | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json | null
          questions_count?: number | null
          result_narratives?: Json | null
          scoring_logic?: Json | null
          short_description?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          visibility?:
            | Database["public"]["Enums"]["assessment_visibility"]
            | null
        }
        Relationships: []
      }
      couples_challenges: {
        Row: {
          compatibility_result: Json | null
          completed_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          invite_code: string
          inviter_assessment_id: string | null
          inviter_user_id: string
          partner_assessment_id: string | null
          partner_email: string | null
          partner_user_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          compatibility_result?: Json | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_code: string
          inviter_assessment_id?: string | null
          inviter_user_id: string
          partner_assessment_id?: string | null
          partner_email?: string | null
          partner_user_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          compatibility_result?: Json | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_code?: string
          inviter_assessment_id?: string | null
          inviter_user_id?: string
          partner_assessment_id?: string | null
          partner_email?: string | null
          partner_user_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couples_challenges_inviter_user_id_fkey"
            columns: ["inviter_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couples_challenges_partner_user_id_fkey"
            columns: ["partner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_bookings: {
        Row: {
          amount_paid: number | null
          created_at: string
          event_id: string
          expires_at: string | null
          id: string
          is_member_access: boolean | null
          payment_id: string | null
          payment_status: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          ticket_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          event_id: string
          expires_at?: string | null
          id?: string
          is_member_access?: boolean | null
          payment_id?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          ticket_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          event_id?: string
          expires_at?: string | null
          id?: string
          is_member_access?: boolean | null
          payment_id?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          ticket_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string | null
          currency: string | null
          date: string
          description: string | null
          end_date: string | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          is_online: boolean | null
          location: string | null
          member_free_access: boolean | null
          price: number | null
          short_description: string | null
          spots_taken: number | null
          status: Database["public"]["Enums"]["event_status"] | null
          tags: string[] | null
          title: string
          transformation_only: boolean | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          date: string
          description?: string | null
          end_date?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_online?: boolean | null
          location?: string | null
          member_free_access?: boolean | null
          price?: number | null
          short_description?: string | null
          spots_taken?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          title: string
          transformation_only?: boolean | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          date?: string
          description?: string | null
          end_date?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_online?: boolean | null
          location?: string | null
          member_free_access?: boolean | null
          price?: number | null
          short_description?: string | null
          spots_taken?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          title?: string
          transformation_only?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      membership_leads: {
        Row: {
          created_at: string
          event_id: string | null
          full_name: string
          id: string
          notes: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          full_name: string
          id?: string
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_leads_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          metadata: Json | null
          role: string
          saved_to_memory: boolean | null
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          saved_to_memory?: boolean | null
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          saved_to_memory?: boolean | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_questions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_required: boolean | null
          options: Json | null
          order_index: number | null
          question_text: string
          question_type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_required?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text: string
          question_type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_required?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text?: string
          question_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          cultural_preferences: Json | null
          date_of_birth: string | null
          full_name: string | null
          horoscope_sign: string | null
          id: string
          intensity_preference:
            | Database["public"]["Enums"]["intensity_preference"]
            | null
          language: string | null
          memory_consent: boolean | null
          nickname: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          psychological_profile: Json | null
          updated_at: string
          user_id: string
          voice_minutes_used: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          cultural_preferences?: Json | null
          date_of_birth?: string | null
          full_name?: string | null
          horoscope_sign?: string | null
          id?: string
          intensity_preference?:
            | Database["public"]["Enums"]["intensity_preference"]
            | null
          language?: string | null
          memory_consent?: boolean | null
          nickname?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          psychological_profile?: Json | null
          updated_at?: string
          user_id: string
          voice_minutes_used?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          cultural_preferences?: Json | null
          date_of_birth?: string | null
          full_name?: string | null
          horoscope_sign?: string | null
          id?: string
          intensity_preference?:
            | Database["public"]["Enums"]["intensity_preference"]
            | null
          language?: string | null
          memory_consent?: boolean | null
          nickname?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          psychological_profile?: Json | null
          updated_at?: string
          user_id?: string
          voice_minutes_used?: number | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          intensity_preference: string | null
          messages_count: number | null
          status: string | null
          summary: string | null
          summary_generated_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          intensity_preference?: string | null
          messages_count?: number | null
          status?: string | null
          summary?: string | null
          summary_generated_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          intensity_preference?: string | null
          messages_count?: number | null
          status?: string | null
          summary?: string | null
          summary_generated_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          paypal_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
          voice_minutes_limit: number | null
          voice_minutes_used: number | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paypal_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
          voice_minutes_limit?: number | null
          voice_minutes_used?: number | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paypal_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
          voice_minutes_limit?: number | null
          voice_minutes_used?: number | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          assessments_completed: string[] | null
          created_at: string
          daily_streak_days: number | null
          id: string
          last_active_at: string | null
          total_sessions: number | null
          total_voice_minutes: number | null
          updated_at: string
          user_id: string
          wellness_content_completed: string[] | null
        }
        Insert: {
          assessments_completed?: string[] | null
          created_at?: string
          daily_streak_days?: number | null
          id?: string
          last_active_at?: string | null
          total_sessions?: number | null
          total_voice_minutes?: number | null
          updated_at?: string
          user_id: string
          wellness_content_completed?: string[] | null
        }
        Update: {
          assessments_completed?: string[] | null
          created_at?: string
          daily_streak_days?: number | null
          id?: string
          last_active_at?: string | null
          total_sessions?: number | null
          total_voice_minutes?: number | null
          updated_at?: string
          user_id?: string
          wellness_content_completed?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wellness_library: {
        Row: {
          audio_file_url: string | null
          category: string | null
          content_type: string
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          short_description: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string | null
          view_count: number | null
        }
        Insert: {
          audio_file_url?: string | null
          category?: string | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          short_description?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url?: string | null
          view_count?: number | null
        }
        Update: {
          audio_file_url?: string | null
          category?: string | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          short_description?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wellness_library_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_lead: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "super_admin"
      assessment_visibility: "public" | "authenticated" | "members_only"
      booking_status: "pending" | "confirmed" | "cancelled" | "attended"
      event_status: "draft" | "published" | "cancelled" | "completed"
      intensity_preference: "soft" | "direct" | "no_mercy"
      lead_status: "new" | "contacted" | "converted" | "declined"
      subscription_status: "active" | "cancelled" | "expired" | "pending"
      subscription_tier: "discovery" | "growth" | "transformation"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin", "super_admin"],
      assessment_visibility: ["public", "authenticated", "members_only"],
      booking_status: ["pending", "confirmed", "cancelled", "attended"],
      event_status: ["draft", "published", "cancelled", "completed"],
      intensity_preference: ["soft", "direct", "no_mercy"],
      lead_status: ["new", "contacted", "converted", "declined"],
      subscription_status: ["active", "cancelled", "expired", "pending"],
      subscription_tier: ["discovery", "growth", "transformation"],
    },
  },
} as const