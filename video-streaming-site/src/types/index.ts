export interface User {
  id: string
  email: string
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  avatar_url?: string
  is_kids_profile: boolean
  preferences: Record<string, any>
  created_at: string
}

export interface Content {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  content_type: 'movie' | 'tv_show' | 'documentary'
  category: string
  release_year: number
  rating: number
  genres: string[]
  created_at: string
}

export interface WatchProgress {
  id: string
  user_id: string
  content_id: string
  progress_seconds: number
  is_completed: boolean
  last_watched: string
  content?: Content
}

export interface WatchlistItem {
  id: string
  user_id: string
  content_id: string
  added_at: string
  content?: Content
}

export interface Genre {
  id: string
  name: string
  slug: string
}

export interface VideoPlayerProps {
  content: Content
  onProgressUpdate?: (progress: number) => void
  onComplete?: () => void
  startTime?: number
}

export interface ContentRowProps {
  title: string
  contents: Content[]
  category?: string
}

export interface HeaderProps {
  showSearch?: boolean
}

export interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

export interface VideoContextType {
  contents: Content[]
  watchlist: WatchlistItem[]
  watchProgress: WatchProgress[]
  loading: boolean
  addToWatchlist: (contentId: string) => Promise<void>
  removeFromWatchlist: (contentId: string) => Promise<void>
  updateWatchProgress: (contentId: string, progress: number, completed?: boolean) => Promise<void>
  searchContents: (query: string) => Promise<Content[]>
  getContentsByCategory: (category: string) => Promise<Content[]>
  getContentsByGenre: (genre: string) => Promise<Content[]>
}