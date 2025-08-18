import { useState, useEffect } from 'react'
import { AuthService, type UserProfile } from '../services/auth'
import type { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const authService = AuthService.getInstance()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentSession = await authService.getCurrentSession()
        const currentUser = await authService.getCurrentUser()
        
        console.log('Initial session check:', { currentSession: !!currentSession, currentUser: !!currentUser })
        
        setSession(currentSession)
        setUser(currentUser)

        if (currentUser) {
          try {
            const userProfile = await authService.getUserProfile(currentUser.id)
            console.log('User profile:', userProfile)
            setProfile(userProfile)
            setIsAdmin(userProfile?.role === 'admin' && userProfile?.active === true)
          } catch (profileError) {
            console.log('Profile not found, user may need to complete setup')
            setProfile(null)
            setIsAdmin(false)
          }
        } else {
          console.log('No current user found')
        }
      } catch (error) {
        console.log('Error getting initial session:', error)
        setSession(null)
        setUser(null)
        setProfile(null)
        setIsAdmin(false)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'Session:', !!session)
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            const userProfile = await authService.getUserProfile(session.user.id)
            setProfile(userProfile)
            setIsAdmin(userProfile?.role === 'admin' && userProfile?.active === true)
          } catch (profileError) {
            console.log('Profile not found for new user')
            setProfile(null)
            setIsAdmin(false)
          }
        } else {
          setProfile(null)
          setIsAdmin(false)
        }
        
        // Only set loading to false if we're not in the initial load
        if (!loading) {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authService.signIn(email, password)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    try {
      const result = await authService.signUp(email, password, fullName)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const updatedProfile = await authService.updateUserProfile(user.id, updates)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }
}