import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { auth, supabase } from '../lib/supabase'
import type { User, Profile, AuthContextType } from '../types'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user: null,
  profile: null,
  loading: true
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'LOGOUT':
      return { user: null, profile: null, loading: false }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        const { data: { session } } = await auth.getSession()
        
        if (session?.user) {
          dispatch({ type: 'SET_USER', payload: session.user as User })
          await fetchProfile(session.user.id)
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error checking session:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        dispatch({ type: 'SET_USER', payload: session.user as User })
        await fetchProfile(session.user.id)
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      
      dispatch({ type: 'SET_PROFILE', payload: data as Profile })
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Create default profile if it doesn't exist
      await createDefaultProfile(userId)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createDefaultProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          user_id: userId,
          name: 'Profile 1',
          is_kids_profile: false,
          preferences: {}
        }])
        .select()
        .single()

      if (error) throw error
      dispatch({ type: 'SET_PROFILE', payload: data as Profile })
    } catch (error) {
      console.error('Error creating default profile:', error)
    }
  }

  const login = async (email: string, password: string) => {
    const { error } = await auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const register = async (email: string, password: string, name: string) => {
    const { error } = await auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!state.user) throw new Error('No user logged in')
    
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('user_id', state.user.id)

    if (error) throw error
    
    // Refetch profile to get updated data
    await fetchProfile(state.user.id)
  }

  const value: AuthContextType = {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}