import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Bell, User, Menu, X, Play, Home, Compass, Bookmark, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-netflix-red text-2xl font-bold">
                NETFLIX
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                  isActive('/') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/browse"
                className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                  isActive('/browse') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Compass size={18} />
                <span>Browse</span>
              </Link>
              <Link
                to="/watchlist"
                className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                  isActive('/watchlist') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Bookmark size={18} />
                <span>My List</span>
              </Link>
              <Link
                to="/continue-watching"
                className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                  isActive('/continue-watching') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Clock size={18} />
                <span>Continue Watching</span>
              </Link>
            </nav>
          </div>

          {/* Search and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, TV shows..."
                    className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-netflix-red w-64"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-netflix-red text-white px-4 py-2 rounded-r-md hover:bg-red-700 transition-colors"
                  >
                    <Search size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Search size={24} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button className="text-gray-300 hover:text-white transition-colors">
              <Bell size={24} />
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <span className="hidden md:block">{profile?.name || 'Profile'}</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  isActive('/') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/browse"
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  isActive('/browse') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass size={18} />
                <span>Browse</span>
              </Link>
              <Link
                to="/watchlist"
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  isActive('/watchlist') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark size={18} />
                <span>My List</span>
              </Link>
              <Link
                to="/continue-watching"
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  isActive('/continue-watching') ? 'text-white bg-white bg-opacity-10' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Clock size={18} />
                <span>Continue Watching</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header