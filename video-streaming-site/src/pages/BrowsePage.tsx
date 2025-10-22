import React, { useState, useEffect } from 'react'
import { Filter, Grid, List } from 'lucide-react'
import { useVideo } from '../contexts/VideoContext'
import ContentCard from '../components/ContentCard'
import type { Content } from '../types'

const BrowsePage: React.FC = () => {
  const { contents, getContentsByCategory, getContentsByGenre } = useVideo()
  const [filteredContents, setFilteredContents] = useState<Content[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['all', ...Array.from(new Set(contents.map(c => c.category)))]
  const genres = ['all', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary']
  const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016']

  useEffect(() => {
    filterContents()
  }, [selectedCategory, selectedGenre, selectedYear, sortBy, contents])

  const filterContents = async () => {
    let filtered = [...contents]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(content => content.category === selectedCategory)
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(content => 
        content.genres && content.genres.includes(selectedGenre)
      )
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(content => 
        content.release_year.toString() === selectedYear
      )
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'year':
        filtered.sort((a, b) => b.release_year - a.release_year)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'duration':
        filtered.sort((a, b) => b.duration - a.duration)
        break
    }

    setFilteredContents(filtered)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedGenre('all')
    setSelectedYear('all')
    setSortBy('rating')
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Browse</h1>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredContents.length} of {contents.length} titles
          </p>
        </div>

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredContents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContents.map((content) => (
              <div key={content.id} className="flex bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                <div className="w-48 h-32 flex-shrink-0">
                  <img
                    src={content.thumbnail_url}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{content.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                      {content.rating}/10
                    </span>
                    <span>{content.release_year}</span>
                    <span>{Math.floor(content.duration / 60)} min</span>
                    <span className="border border-gray-500 px-2 py-1 rounded text-xs">
                      {content.content_type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredContents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No content found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="bg-netflix-red text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowsePage