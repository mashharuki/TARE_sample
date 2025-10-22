import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { Content, WatchlistItem, WatchProgress, VideoContextType } from '../types'

interface VideoState {
  contents: Content[]
  watchlist: WatchlistItem[]
  watchProgress: WatchProgress[]
  loading: boolean
}

type VideoAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONTENTS'; payload: Content[] }
  | { type: 'SET_WATCHLIST'; payload: WatchlistItem[] }
  | { type: 'SET_WATCH_PROGRESS'; payload: WatchProgress[] }
  | { type: 'ADD_TO_WATCHLIST'; payload: WatchlistItem }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'UPDATE_WATCH_PROGRESS'; payload: WatchProgress }

const initialState: VideoState = {
  contents: [],
  watchlist: [],
  watchProgress: [],
  loading: true
}

const videoReducer = (state: VideoState, action: VideoAction): VideoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_CONTENTS':
      return { ...state, contents: action.payload }
    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.payload }
    case 'SET_WATCH_PROGRESS':
      return { ...state, watchProgress: action.payload }
    case 'ADD_TO_WATCHLIST':
      return { ...state, watchlist: [...state.watchlist, action.payload] }
    case 'REMOVE_FROM_WATCHLIST':
      return { 
        ...state, 
        watchlist: state.watchlist.filter(item => item.id !== action.payload) 
      }
    case 'UPDATE_WATCH_PROGRESS':
      const existingIndex = state.watchProgress.findIndex(
        item => item.content_id === action.payload.content_id
      )
      if (existingIndex >= 0) {
        const updated = [...state.watchProgress]
        updated[existingIndex] = action.payload
        return { ...state, watchProgress: updated }
      } else {
        return { ...state, watchProgress: [...state.watchProgress, action.payload] }
      }
    default:
      return state
  }
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchInitialData()
    } else {
      fetchPublicContent()
    }
  }, [user])

  const fetchInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      await Promise.all([
        fetchContents(),
        fetchWatchlist(),
        fetchWatchProgress()
      ])
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchPublicContent = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await fetchContents()
    } catch (error) {
      console.error('Error fetching public content:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select(`*, genres (name)`)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      
      const contents = data?.map(item => ({
        ...item,
        genres: item.genres?.map((g: any) => g.name) || []
      })) || []
      
      dispatch({ type: 'SET_CONTENTS', payload: contents })
    } catch (error) {
      console.error('Error fetching contents:', error)
    }
  }

  const fetchWatchlist = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select(`*, content (*, genres (name))`)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false })

      if (error) throw error
      
      const watchlist = data?.map(item => ({
        ...item,
        content: {
          ...item.content,
          genres: item.content?.genres?.map((g: any) => g.name) || []
        }
      })) || []
      
      dispatch({ type: 'SET_WATCHLIST', payload: watchlist })
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    }
  }

  const fetchWatchProgress = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('watch_progress')
        .select(`*, content (*, genres (name))`)
        .eq('user_id', user.id)
        .order('last_watched', { ascending: false })

      if (error) throw error
      
      const watchProgress = data?.map(item => ({
        ...item,
        content: {
          ...item.content,
          genres: item.content?.genres?.map((g: any) => g.name) || []
        }
      })) || []
      
      dispatch({ type: 'SET_WATCH_PROGRESS', payload: watchProgress })
    } catch (error) {
      console.error('Error fetching watch progress:', error)
    }
  }

  const addToWatchlist = async (contentId: string) => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .insert([{
          user_id: user.id,
          content_id: contentId
        }])
        .select(`*, content (*, genres (name))`)
        .single()

      if (error) throw error
      
      const watchlistItem = {
        ...data,
        content: {
          ...data.content,
          genres: data.content?.genres?.map((g: any) => g.name) || []
        }
      }
      
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: watchlistItem })
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      throw error
    }
  }

  const removeFromWatchlist = async (contentId: string) => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', contentId)

      if (error) throw error
      
      const item = state.watchlist.find(item => item.content_id === contentId)
      if (item) {
        dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: item.id })
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      throw error
    }
  }

  const updateWatchProgress = async (contentId: string, progress: number, completed = false) => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const { data, error } = await supabase
        .from('watch_progress')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          progress_seconds: progress,
          is_completed: completed,
          last_watched: new Date().toISOString()
        }, {
          onConflict: 'user_id,content_id'
        })
        .select(`*, content (*, genres (name))`)
        .single()

      if (error) throw error
      
      const watchProgress = {
        ...data,
        content: {
          ...data.content,
          genres: data.content?.genres?.map((g: any) => g.name) || []
        }
      }
      
      dispatch({ type: 'UPDATE_WATCH_PROGRESS', payload: watchProgress })
    } catch (error) {
      console.error('Error updating watch progress:', error)
      throw error
    }
  }

  const searchContents = async (query: string): Promise<Content[]> => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select(`*, genres (name)`)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(50)

      if (error) throw error
      
      return data?.map(item => ({
        ...item,
        genres: item.genres?.map((g: any) => g.name) || []
      })) || []
    } catch (error) {
      console.error('Error searching contents:', error)
      return []
    }
  }

  const getContentsByCategory = async (category: string): Promise<Content[]> => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select(`*, genres (name)`)
        .eq('category', category)
        .order('rating', { ascending: false })
        .limit(50)

      if (error) throw error
      
      return data?.map(item => ({
        ...item,
        genres: item.genres?.map((g: any) => g.name) || []
      })) || []
    } catch (error) {
      console.error('Error fetching contents by category:', error)
      return []
    }
  }

  const getContentsByGenre = async (genre: string): Promise<Content[]> => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select(`*, genres (name)`)
        .contains('genres', [genre])
        .order('rating', { ascending: false })
        .limit(50)

      if (error) throw error
      
      return data?.map(item => ({
        ...item,
        genres: item.genres?.map((g: any) => g.name) || []
      })) || []
    } catch (error) {
      console.error('Error fetching contents by genre:', error)
      return []
    }
  }

  const value: VideoContextType = {
    contents: state.contents,
    watchlist: state.watchlist,
    watchProgress: state.watchProgress,
    loading: state.loading,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchProgress,
    searchContents,
    getContentsByCategory,
    getContentsByGenre
  }

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  )
}

export const useVideo = () => {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
}