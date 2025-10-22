import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Info, Plus } from 'lucide-react'
import { useVideo } from '../contexts/VideoContext'
import { useAuth } from '../contexts/AuthContext'
import ContentRow from '../components/ContentRow'
import type { Content } from '../types'

const HomePage: React.FC = () => {
  const { contents, watchProgress } = useVideo()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [heroContent, setHeroContent] = useState<Content | null>(null)
  const [featuredCategories, setFeaturedCategories] = useState<string[]>([])

  useEffect(() => {
    if (contents.length > 0) {
      // Set random hero content
      const randomIndex = Math.floor(Math.random() * Math.min(contents.length, 10))
      setHeroContent(contents[randomIndex])
      
      // Get unique categories for featured rows
      const categories = [...new Set(contents.map(content => content.category))]
      setFeaturedCategories(categories.slice(0, 6))
    }
  }, [contents])

  const handlePlay = (contentId: string) => {
    navigate(`/watch/${contentId}`)
  }

  const handleInfo = (contentId: string) => {
    // Navigate to content details page (can be implemented later)
    console.log('Show info for content:', contentId)
  }

  const getContinueWatching = () => {
    return watchProgress
      .filter(item => !item.is_completed && item.progress_seconds > 0)
      .map(item => item.content)
      .filter(Boolean) as Content[]
  }

  const getTrendingContent = () => {
    return contents
      .filter(content => content.rating >= 7.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 20)
  }

  const getNewReleases = () => {
    const currentYear = new Date().getFullYear()
    return contents
      .filter(content => content.release_year >= currentYear - 1)
      .sort((a, b) => b.release_year - a.release_year)
      .slice(0, 20)
  }

  const getTopRated = () => {
    return contents
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 20)
  }

  if (!heroContent) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Banner */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={heroContent.thumbnail_url}
            alt={heroContent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-1/4 left-4 md:left-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {heroContent.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 line-clamp-3">
              {heroContent.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                {heroContent.rating}/10
              </span>
              <span>{heroContent.release_year}</span>
              <span className="border border-gray-500 px-2 py-1 rounded">
                {heroContent.content_type.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handlePlay(heroContent.id)}
                className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
              >
                <Play size={20} fill="currentColor" />
                <span>Play</span>
              </button>
              
              <button
                onClick={() => handleInfo(heroContent.id)}
                className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 text-white px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition-colors"
              >
                <Info size={20} />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative z-10 -mt-32 pb-8">
        {/* Continue Watching (for logged in users) */}
        {user && getContinueWatching().length > 0 && (
          <ContentRow
            title="Continue Watching"
            contents={getContinueWatching()}
          />
        )}

        {/* Trending Now */}
        <ContentRow
          title="Trending Now"
          contents={getTrendingContent()}
        />

        {/* New Releases */}
        <ContentRow
          title="New Releases"
          contents={getNewReleases()}
        />

        {/* Top Rated */}
        <ContentRow
          title="Top Rated"
          contents={getTopRated()}
        />

        {/* Category-based Rows */}
        {featuredCategories.map((category) => {
          const categoryContent = contents
            .filter(content => content.category === category)
            .slice(0, 20)
          
          if (categoryContent.length === 0) return null

          return (
            <ContentRow
              key={category}
              title={category}
              contents={categoryContent}
              category={category}
            />
          )
        })}
      </div>
    </div>
  )
}

export default HomePage