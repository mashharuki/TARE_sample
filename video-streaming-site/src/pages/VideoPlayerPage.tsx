import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'
import { useVideo } from '../contexts/VideoContext'
import { useAuth } from '../contexts/AuthContext'
import VideoPlayer from '../components/VideoPlayer'
import type { Content } from '../types'

const VideoPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { contents, updateWatchProgress, watchProgress } = useVideo()
  const { user } = useAuth()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [startTime, setStartTime] = useState(0)

  useEffect(() => {
    if (id && contents.length > 0) {
      const foundContent = contents.find(c => c.id === id)
      if (foundContent) {
        setContent(foundContent)
        
        // Check for existing watch progress
        if (user) {
          const progress = watchProgress.find(p => p.content_id === id)
          if (progress && progress.progress_seconds > 0 && !progress.is_completed) {
            setStartTime(progress.progress_seconds)
          }
        }
        
        setLoading(false)
      } else {
        // Content not found
        navigate('/')
      }
    }
  }, [id, contents, watchProgress, user, navigate])

  const handleProgressUpdate = async (progress: number) => {
    if (!user || !content) return
    
    try {
      await updateWatchProgress(content.id, progress, false)
    } catch (error) {
      console.error('Error updating watch progress:', error)
    }
  }

  const handleComplete = async () => {
    if (!user || !content) return
    
    try {
      await updateWatchProgress(content.id, content.duration, true)
    } catch (error) {
      console.error('Error updating watch progress:', error)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Content not found</h2>
          <button
            onClick={handleBack}
            className="bg-netflix-red text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Video Player */}
      <div className="relative w-full h-screen">
        <VideoPlayer
          content={content}
          onProgressUpdate={handleProgressUpdate}
          onComplete={handleComplete}
          startTime={startTime}
        />
      </div>

      {/* Video Info Panel (shown when paused or on mobile) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Title and Description */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {content.title}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {content.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                  {content.rating}/10
                </span>
                <span>{content.release_year}</span>
                <span>{Math.floor(content.duration / 60)} min</span>
                <span className="border border-gray-500 px-2 py-1 rounded">
                  {content.content_type.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              {content.genres && content.genres.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-white font-semibold mb-2">Category</h3>
                <p className="text-gray-300">{content.category}</p>
              </div>

              {startTime > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Progress</h3>
                  <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-netflix-red h-full transition-all duration-300"
                      style={{ width: `${(startTime / content.duration) * 100}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {Math.floor(startTime / 60)} minutes watched
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerPage