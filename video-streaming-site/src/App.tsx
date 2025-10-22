import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { VideoProvider } from './contexts/VideoContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import SearchPage from './pages/SearchPage'
import VideoPlayerPage from './pages/VideoPlayerPage'
import ProfilePage from './pages/ProfilePage'
import WatchlistPage from './pages/WatchlistPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ContinueWatchingPage from './pages/ContinueWatchingPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <VideoProvider>
        <Router>
          <div className="min-h-screen bg-netflix-black">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes with header */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-netflix-black">
                    <Header />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/browse" element={<BrowsePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/watch/:id" element={<VideoPlayerPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/watchlist" element={<WatchlistPage />} />
                      <Route path="/continue-watching" element={<ContinueWatchingPage />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </VideoProvider>
    </AuthProvider>
  )
}

export default App