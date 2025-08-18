import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (will be auto-generated later)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'user' | 'admin'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'user' | 'admin'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'user' | 'admin'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          display_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          active: boolean
          featured: boolean
          primary_model: string
          fallback_models: string[]
          prompt_instructions: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          active?: boolean
          featured?: boolean
          primary_model?: string
          fallback_models?: string[]
          prompt_instructions?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          active?: boolean
          featured?: boolean
          primary_model?: string
          fallback_models?: string[]
          prompt_instructions?: string
          created_at?: string
          updated_at?: string
        }
      }
      tool_questions: {
        Row: {
          id: string
          tool_id: string
          label: string
          type: 'input' | 'textarea' | 'select'
          placeholder: string | null
          required: boolean
          order_index: number
          options: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          tool_id: string
          label: string
          type?: 'input' | 'textarea' | 'select'
          placeholder?: string | null
          required?: boolean
          order_index?: number
          options?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          tool_id?: string
          label?: string
          type?: 'input' | 'textarea' | 'select'
          placeholder?: string | null
          required?: boolean
          order_index?: number
          options?: string[] | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          tool_id: string | null
          project_id: string | null
          title: string
          messages: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id?: string | null
          project_id?: string | null
          title: string
          messages?: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string | null
          project_id?: string | null
          title?: string
          messages?: any[]
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base_files: {
        Row: {
          id: string
          user_id: string
          tool_id: string | null
          chat_session_id: string
          filename: string
          file_path: string
          file_size: number
          mime_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id?: string | null
          chat_session_id: string
          filename: string
          file_path: string
          file_size: number
          mime_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string | null
          chat_session_id?: string
          filename?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          created_at?: string
        }
      }
    }
  }
}