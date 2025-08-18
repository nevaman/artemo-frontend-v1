import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  full_name: string | null
  role: 'user' | 'admin'
  active: boolean
  created_at: string
  updated_at: string
}

export class AuthService {
  private static instance: AuthService

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Authentication methods
  async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Error getting current session:', error)
      return null
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId)
      return profile?.role === 'admin' && profile?.active === true
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Auth state change listener
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Password reset
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }
}