import { useState, useEffect } from 'react'
import { AuthService, type UserProfile } from '../services/auth'
import type { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authAttempted, setAuthAttempted] = useState(false)

  const authService = AuthService.getInstance()

  useEffect(() => {
    let mounted = true
    let maxTimeoutId: NodeJS.Timeout
    
    // Set a maximum timeout for the initial auth check
    maxTimeoutId = setTimeout(() => {
      if (mounted) {
        console.log('⚠️ Auth timeout reached after 3 seconds - forcing loading to false')
        setLoading(false)
        setAuthAttempted(true)
      }
    }, 3000) // 3 second max timeout

    const getInitialSession = async () => {
      if (authAttempted) {
        console.log('🔄 Auth already attempted, skipping...')
        return
      }
      
      console.log('🚀 Starting initial auth check...')
      setAuthAttempted(true)
      
      try {
        const currentSession = await authService.getCurrentSession()
        const currentUser = await authService.getCurrentUser()
        
        console.log('🔍 Initial auth result:', { 
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
            console.log('👤 Initial profile result:', { 
              hasProfile: !!userProfile, 
              role: userProfile?.role,
              active: userProfile?.active 
            })
            
            if (mounted) {
              setProfile(userProfile)
              // Show admin access if user is admin OR if no profile exists (first time setup)
              setIsAdmin((userProfile?.role === 'admin' && userProfile?.active === true) || !userProfile)
            }
          } catch (profileError) {
            console.log('⚠️ Initial profile error:', profileError)
            if (mounted) {
              setProfile(null)
              // If profile fetch fails, allow admin access for setup
              setIsAdmin(true)
            }
          }
        } else {
          if (mounted) {
            setProfile(null)
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error('💥 Initial auth error:', error)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
          setIsAdmin(false)
        }
      } finally {
        console.log('✅ Initial auth check complete')
        if (mounted) {
          setLoading(false)
          clearTimeout(maxTimeoutId)
        }
      }
    }

    // Only run initial session check once
    if (!authAttempted) {
      getInitialSession()
    }

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change event:', event, 'Has Session:', !!session, 'User:', session?.user?.email)
        
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            const userProfile = await authService.getUserProfile(session.user.id)
            console.log('👤 Auth change profile result for', session.user.email, ':', { 
              hasProfile: !!userProfile, 
              role: userProfile?.role 
            })
            if (mounted) {
              setProfile(userProfile)
              // Show admin access if user is admin OR if no profile exists (first time setup)
              setIsAdmin((userProfile?.role === 'admin' && userProfile?.active === true) || !userProfile)
            }
          } catch (profileError) {
            console.log('⚠️ Auth change profile error for', session.user.email, ':', profileError)
            if (mounted) {
              setProfile(null)
              // If profile fetch fails, allow admin access for setup
              setIsAdmin(true)
            }
          }
        } else {
          console.log('🚪 No session - user signed out or not authenticated')
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
      clearTimeout(maxTimeoutId)
      subscription.unsubscribe()
    }
  }, [authAttempted])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log('🔐 Attempting sign in for:', email)
      const result = await authService.signIn(email, password)
      console.log('✅ Sign in successful')
      return result
    } catch (error) {
      console.error('❌ Sign in failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    try {
      console.log('📝 Attempting sign up for:', email)
      const result = await authService.signUp(email, password, fullName)
      console.log('✅ Sign up successful')
      return result
    } catch (error) {
      console.error('❌ Sign up failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      console.log('🚪 Signing out...')
      await authService.signOut()
      console.log('✅ Sign out successful')
    } catch (error) {
      console.error('❌ Sign out failed:', error)
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