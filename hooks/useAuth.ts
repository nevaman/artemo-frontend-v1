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
    let mounted = true
    let timeoutId: NodeJS.Timeout
    
    // Set a maximum timeout for the initial auth check
    const maxTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⚠️ Auth timeout reached - forcing loading to false')
        setLoading(false)
      }
    }, 2000) // 2 second max timeout

    const getInitialSession = async () => {
      console.log('🚀 Starting auth check...')
      try {
        const currentSession = await authService.getCurrentSession()
        const currentUser = await authService.getCurrentUser()
        
        console.log('🔍 Auth result:', { 
          hasSession: !!currentSession, 
          hasUser: !!currentUser,
          userId: currentUser?.id 
        })
        
        if (!mounted) return
        
        setSession(currentSession)
        setUser(currentUser)

        if (currentUser) {
          try {
            const userProfile = await authService.getUserProfile(currentUser.id)
            console.log('👤 Profile result:', { 
              hasProfile: !!userProfile, 
              role: userProfile?.role,
              active: userProfile?.active 
            })
            
            if (mounted) {
              setProfile(userProfile)
              setIsAdmin(userProfile?.role === 'admin' && userProfile?.active === true)
            }
          } catch (profileError) {
            console.log('⚠️ Profile error:', profileError)
            if (mounted) {
              setProfile(null)
              setIsAdmin(false)
            }
          }
        } else {
          if (mounted) {
            setProfile(null)
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error('💥 Auth error:', error)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
          setIsAdmin(false)
        }
      } finally {
        console.log('✅ Auth check complete')
        if (mounted) {
          setLoading(false)
          clearTimeout(maxTimeout)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, 'Has Session:', !!session)
        
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            const userProfile = await authService.getUserProfile(session.user.id)
            if (mounted) {
              setProfile(userProfile)
              setIsAdmin(userProfile?.role === 'admin' && userProfile?.active === true)
            }
          } catch (profileError) {
            if (mounted) {
              setProfile(null)
              setIsAdmin(false)
            }
          }
        } else {
          if (mounted) {
            setProfile(null)
            setIsAdmin(false)
          }
        }
        
        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(maxTimeout)
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