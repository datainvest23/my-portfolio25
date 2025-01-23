export type Profile = {
  id: string;
  email: string;
  name: string;
  last_login: string;
  gpt_thread_id: string | null;
  // ... any other fields
};

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
      your_table: {
        Row: {
          id: string
          created_at?: string
          // Add other columns from your table
        }
        Insert: {
          id?: string
          created_at?: string
          // Add other columns
        }
        Update: {
          id?: string
          created_at?: string
          // Add other columns
        }
      }
      // Add other tables if you have them
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