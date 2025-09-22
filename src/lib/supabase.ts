import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client for SSR
export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database types (we'll define these as we create the schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'public' | 'verified' | 'admin'
          encrypted_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'public' | 'verified' | 'admin'
          encrypted_contact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'public' | 'verified' | 'admin'
          encrypted_contact?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          location_coords: string | null
          what_to_bring: string[] | null
          flyer_url: string | null
          qr_code_url: string | null
          purge_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          location_coords?: string | null
          what_to_bring?: string[] | null
          flyer_url?: string | null
          qr_code_url?: string | null
          purge_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
          location_coords?: string | null
          what_to_bring?: string[] | null
          flyer_url?: string | null
          qr_code_url?: string | null
          purge_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          user_id: string | null
          event_id: string
          role: string
          anonymous_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_id: string
          role: string
          anonymous_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_id?: string
          role?: string
          anonymous_name?: string | null
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          type: 'need' | 'have'
          category: string
          description: string
          user_id: string | null
          event_id: string | null
          claimed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'need' | 'have'
          category: string
          description: string
          user_id?: string | null
          event_id?: string | null
          claimed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'need' | 'have'
          category?: string
          description?: string
          user_id?: string | null
          event_id?: string | null
          claimed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string | null
          skill_tags: string[]
          contact_method: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          skill_tags: string[]
          contact_method?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          skill_tags?: string[]
          contact_method?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}