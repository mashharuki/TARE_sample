import React, { useState } from 'react'
import { Heart, Play, Filter, Grid, List, Clock, Calendar, Star, X } from 'lucide-react'
import { useVideo } from '../contexts/VideoContext'
import ContentCard from '../components/ContentCard'

const WatchlistPage: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useVideo()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'year' | 'rating'>('date')
  const [filterGenre, setFilterGenre] = useState<string>('all')

  const genres = ['all', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary']

  const sortedAndFilteredWatchlist = watchlist
    .filter(item => filterGenre === 'all' || item.content.genres?.includes(filterGenre))
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.content.title.localeCompare(b.content.title)
        case 'year':
          return b.content.release_year - a.content.release_year
        case 'rating':
          return b.content.rating - a.content.rating
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const handleRemoveFromWatchlist = async (contentId: string) => {
    try {
      await removeFromWatchlist(contentId)
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">
            {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved to watch later
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-netflix-red"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-netflix-red"
              >
                <option value="date">Date Added</option>
                <option value="title">Title</option>
                <option value="year">Release Year</option>
                <option value="rating">Rating</option>
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
        {watchlist.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={48} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-6">
              Start adding movies and TV shows you want to watch later
            </p>
            <a
              href="/browse"
              className="bg-netflix-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
            >
              <Play size={18} />
              <span>Browse Content</span>
            </a>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && sortedAndFilteredWatchlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedAndFilteredWatchlist.map((item) => (
              <div key={item.content.id} className="relative group">
                <ContentCard content={item.content} />
                <button
                  onClick={() => handleRemoveFromWatchlist(item.content.id)}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove from watchlist"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && sortedAndFilteredWatchlist.length > 0 && (
          <div className="space-y-4">
            {sortedAndFilteredWatchlist.map((item) => (
              <div key={item.content.id} className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors group">
                <img
                  src={item.content.thumbnail_url}
                  alt={item.content.title}
                  className="w-16 h-24 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{item.content.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {item.content.genres?.join(', ')} • {item.content.release_year}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-white">{item.content.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-300">{Math.floor(item.content.duration / 60)} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-300">Added {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`/watch/${item.content.id}`}
                    className="bg-netflix-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Play size={16} />
                    <span>Play</span>
                  </a>
                  <button
                    onClick={() => handleRemoveFromWatchlist(item.content.id)}
                    className="bg-gray-700 text-white p-2 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from watchlist"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {sortedAndFilteredWatchlist.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Showing {sortedAndFilteredWatchlist.length} of {watchlist.length} items
              {filterGenre !== 'all' && ` in ${filterGenre}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WatchlistPage