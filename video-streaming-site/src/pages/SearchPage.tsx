import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Filter, Clock, TrendingUp } from 'lucide-react'
import { useVideo } from '../contexts/VideoContext'
import ContentCard from '../components/ContentCard'
import type { Content } from '../types'

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchContents, contents } = useVideo()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<Content[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('relevance')

  const genres = ['all', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary']
  const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016']

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
    }
  }, [searchQuery])

  useEffect(() => {
    if (searchResults.length > 0) {
      applyFilters()
    }
  }, [selectedGenre, selectedYear, sortBy])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const results = await searchContents(query)
      setSearchResults(results)
      applyFiltersToResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const applyFiltersToResults = (results: Content[]) => {
    let filtered = [...results]

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

    setSearchResults(filtered)
  }

  const applyFilters = () => {
    applyFiltersToResults(searchResults)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
      performSearch(searchQuery.trim())
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSearchParams({})
  }

  const getTrendingSearches = () => {
    return ['Action', 'Comedy', 'Drama', 'Netflix Original', 'New Releases', 'Top Rated']
  }

  const getRecentSearches = () => {
    // In a real app, this would come from localStorage or user preferences
    return JSON.parse(localStorage.getItem('recentSearches') || '[]')
  }

  const addToRecentSearches = (query: string) => {
    const recent = getRecentSearches()
    if (!recent.includes(query)) {
      const updated = [query, ...recent.slice(0, 4)]
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, documentaries..."
              className="w-full bg-gray-800 text-white pl-12 pr-12 py-4 rounded-lg border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            )}
          </form>
        </div>

        {/* Search Suggestions (when no search) */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Trending Searches
            </h2>
            <div className="flex flex-wrap gap-3">
              {getTrendingSearches().map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term)
                    addToRecentSearches(term)
                  }}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && getRecentSearches().length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Recent Searches
            </h2>
            <div className="flex flex-wrap gap-3">
              {getRecentSearches().map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {isSearching ? 'Searching...' : `${searchResults.length} results for "${searchQuery}"`}
              </h2>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                      <option value="relevance">Relevance</option>
                      <option value="rating">Rating</option>
                      <option value="year">Year</option>
                      <option value="title">Title</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
              </div>
            )}

            {/* Search Results Grid */}
            {!isSearching && searchResults.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchResults.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-gray-500 text-sm">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage