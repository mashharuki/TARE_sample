import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Plus, Check, ThumbsUp, Info } from 'lucide-react'
import type { Content } from '../types'
import { useVideo } from '../contexts/VideoContext'

interface ContentCardProps {
  content: Content
  size?: 'small' | 'medium' | 'large'
  showProgress?: boolean
  progress?: number
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  size = 'medium', 
  showProgress = false, 
  progress = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const navigate = useNavigate()
  const { addToWatchlist, removeFromWatchlist, watchlist } = useVideo()

  const isCurrentlyInWatchlist = watchlist.some(item => item.content_id === content.id)

  const handlePlay = () => {
    navigate(`/watch/${content.id}`)
  }

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (isCurrentlyInWatchlist) {
        await removeFromWatchlist(content.id)
      } else {
        await addToWatchlist(content.id)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-32 h-48'
      case 'large':
        return 'w-80 h-48'
      default:
        return 'w-64 h-36'
    }
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} min`
  }

  return (
    <div
      className={`relative ${getSizeClasses()} rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-full">
        <img
          src={content.thumbnail_url}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Progress Bar */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-full bg-netflix-red transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col justify-between p-4">
          {/* Top Section */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-semibold text-sm line-clamp-2">
                {content.title}
              </h3>
              <div className="flex items-center space-x-1 ml-2">
                <span className="bg-yellow-500 text-black text-xs px-1 py-0.5 rounded font-bold">
                  {content.rating}
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 text-xs line-clamp-3 mb-2">
              {content.description}
            </p>
          </div>

          {/* Middle Section - Controls */}
          <div className="flex justify-center">
            <button
              onClick={handlePlay}
              className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition-colors"
            >
              <Play size={20} fill="currentColor" />
            </button>
          </div>

          {/* Bottom Section - Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>{content.release_year}</span>
              <span>{formatDuration(content.duration)}</span>
              <span className="border border-gray-600 px-1 py-0.5 rounded">
                {content.content_type.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWatchlistToggle}
                  className={`p-2 rounded-full border transition-colors ${
                    isCurrentlyInWatchlist
                      ? 'bg-netflix-red border-netflix-red text-white'
                      : 'border-gray-600 text-gray-400 hover:text-white hover:border-white'
                  }`}
                >
                  {isCurrentlyInWatchlist ? (
                    <Check size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                </button>
                
                <button className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors">
                  <ThumbsUp size={16} />
                </button>
              </div>
              
              <button className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors">
                <Info size={16} />
              </button>
            </div>

            {/* Genres */}
            {content.genres && content.genres.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {content.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentCard