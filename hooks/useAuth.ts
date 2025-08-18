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
    
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔄 Starting initial session check...')
      try {
        const currentSession = await authService.getCurrentSession()
        const currentUser = await authService.getCurrentUser()
        
        console.log('📊 Initial session check:', { 
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
            console.log('👤 User profile loaded:', { 
              hasProfile: !!userProfile, 
              role: userProfile?.role,
              active: userProfile?.active 
            })
            
            if (mounted) {
              setProfile(userProfile)
              setIsAdmin(userProfile?.role === 'admin' && userProfile?.active === true)
            }
          } catch (profileError) {
            console.log('⚠️ Profile not found, user may need to complete setup')
            if (mounted) {
              setProfile(null)
              setIsAdmin(false)
            }
          }
        } else {
          console.log('❌ No current user found')
          if (mounted) {
            setProfile(null)
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error('💥 Error getting initial session:', error)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
          setIsAdmin(false)
        }
      } finally {
        console.log('✅ Initial session check complete - Setting loading to false')
        if (mounted) {
          setLoading(false)
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
            console.log('👤 Profile loaded after auth change:', { 
              hasProfile: !!userProfile, 
              role: userProfile?.role 
            })
            if (mounted) {
              setProfile(userProfile)
              setIsAdmin(userProfile?.role === 'admin' && userProfile?.active === true)
            }
          } catch (profileError) {
            console.log('⚠️ Profile not found for auth change')
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
        
        console.log('✅ Auth state change complete - Setting loading to false')
        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
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