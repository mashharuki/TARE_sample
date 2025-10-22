import React, { useState } from 'react'
import { Play, Clock, Calendar, Filter, Grid, List, TrendingUp, Eye } from 'lucide-react'
import { useVideo } from '../contexts/VideoContext'
import ContentCard from '../components/ContentCard'

const ContinueWatchingPage: React.FC = () => {
  const { watchProgress } = useVideo()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'incomplete' | 'completed'>('all')

  // Filter watch progress based on selection
  const filteredProgress = watchProgress.filter(progress => {
    switch (filterBy) {
      case 'recent':
        // Last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return new Date(progress.updated_at) >= sevenDaysAgo
      case 'incomplete':
        return progress.watch_time < progress.content.duration * 0.9
      case 'completed':
        return progress.watch_time >= progress.content.duration * 0.9
      case 'all':
      default:
        return true
    }
  })

  // Sort by most recently watched
  const sortedProgress = filteredProgress.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )

  const getProgressPercentage = (progress: typeof watchProgress[0]) => {
    return Math.min((progress.watch_time / progress.content.duration) * 100, 100)
  }

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Continue Watching</h1>
          <p className="text-gray-400">
            {sortedProgress.length} {sortedProgress.length === 1 ? 'title' : 'titles'} ready to continue
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          {/* Filter Options */}
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-netflix-red"
              >
                <option value="all">All Content</option>
                <option value="recent">Recently Watched</option>
                <option value="incomplete">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-netflix-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-netflix-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {sortedProgress.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play size={48} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No content to continue</h2>
            <p className="text-gray-400 mb-6">
              Start watching some content and it will appear here
            </p>
            <a
              href="/browse"
              className="bg-netflix-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
            >
              <TrendingUp size={18} />
              <span>Browse Content</span>
            </a>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && sortedProgress.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedProgress.map((progress) => (
              <div key={progress.content.id} className="relative group">
                <div className="relative">
                  <ContentCard content={progress.content} />
                  
                  {/* Progress Bar Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2">
                    <div className="flex items-center justify-between text-xs text-white mb-1">
                      <span>{Math.round(getProgressPercentage(progress))}%</span>
                      <span>{getTimeAgo(progress.updated_at)}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1">
                      <div
                        className="bg-netflix-red h-1 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(progress)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && sortedProgress.length > 0 && (
          <div className="space-y-4">
            {sortedProgress.map((progress) => (
              <div key={progress.content.id} className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors group">
                <img
                  src={progress.content.thumbnail_url}
                  alt={progress.content.title}
                  className="w-20 h-30 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{progress.content.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {progress.content.genres?.join(', ')} • {progress.content.release_year}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} className="text-gray-400" />
                      <span className="text-gray-300">
                        {formatWatchTime(progress.watch_time)} watched
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-300">
                        {getTimeAgo(progress.updated_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play size={14} className="text-gray-400" />
                      <span className="text-gray-300">
                        {Math.round(getProgressPercentage(progress))}% complete
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-netflix-red h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(progress)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`/watch/${progress.content.id}`}
                    className="bg-netflix-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Play size={16} />
                    <span>Continue</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {sortedProgress.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Showing {sortedProgress.length} of {watchProgress.length} titles
              {filterBy !== 'all' && (
                <span className="ml-2">
                  ({filterBy === 'recent' ? 'recently watched' : 
                    filterBy === 'incomplete' ? 'in progress' : 'completed'})
                </span>
              )}
            </p>
            <div className="mt-4 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Eye size={14} />
                <span>Total: {formatWatchTime(watchProgress.reduce((sum, p) => sum + p.watch_time, 0))}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={14} />
                <span>Average: {Math.round(watchProgress.reduce((sum, p) => sum + getProgressPercentage(p), 0) / watchProgress.length)}% complete</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContinueWatchingPage