import React, { useState, useEffect } from 'react'
import { User, Mail, Edit2, Save, X, Film, Clock, Heart, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useVideo } from '../contexts/VideoContext'
import type { Profile } from '../types'

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth()
  const { watchlist, watchProgress } = useVideo()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>(profile || {})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'history' | 'settings'>('overview')

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile)
    }
  }, [profile])

  const handleEdit = () => {
    setIsEditing(true)
    setMessage('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(profile || {})
    setMessage('')
  }

  const handleSave = async () => {
    if (!editedProfile.name?.trim()) {
      setMessage('Name is required')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      await updateProfile(editedProfile)
      setIsEditing(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getWatchTimeStats = () => {
    const totalMinutes = watchProgress.reduce((total, progress) => {
      return total + Math.floor(progress.watch_time / 60)
    }, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return { hours, minutes }
  }

  const getCompletedContent = () => {
    return watchProgress.filter(progress => 
      progress.watch_time >= progress.content.duration * 0.9
    )
  }

  const stats = getWatchTimeStats()
  const completedContent = getCompletedContent()

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and viewing preferences</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-900 text-green-200' 
              : 'bg-red-900 text-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={48} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-netflix-red text-center"
                      placeholder="Enter your name"
                    />
                  ) : (
                    profile?.name || 'Unknown User'
                  )}
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  <Mail size={16} className="inline mr-1" />
                  {user?.email}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Watch Time</span>
                  <span className="text-white">{stats.hours}h {stats.minutes}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Watchlist Items</span>
                  <span className="text-white">{watchlist.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Completed</span>
                  <span className="text-white">{completedContent.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="w-full bg-netflix-red text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      <Save size={18} className="mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      <X size={18} className="mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="w-full bg-netflix-red text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-900 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'watchlist', label: 'Watchlist', icon: Heart },
                { id: 'history', label: 'History', icon: Clock },
                { id: 'settings', label: 'Settings', icon: Eye }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-netflix-red text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-900 rounded-lg p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Viewing Activity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">This Month</span>
                        <Film size={20} className="text-netflix-red" />
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {watchProgress.filter(p => {
                          const date = new Date(p.updated_at)
                          const now = new Date()
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                        }).length}
                      </div>
                      <div className="text-sm text-gray-400">Titles watched</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Completion Rate</span>
                        <Eye size={20} className="text-netflix-red" />
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {watchProgress.length > 0 
                          ? Math.round((completedContent.length / watchProgress.length) * 100)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-400">Of started content</div>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-3">Recently Watched</h4>
                  <div className="space-y-3">
                    {watchProgress.slice(0, 5).map((progress) => (
                      <div key={progress.content.id} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                        <img
                          src={progress.content.thumbnail_url}
                          alt={progress.content.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{progress.content.title}</h5>
                          <p className="text-gray-400 text-sm">
                            {Math.floor(progress.watch_time / 60)} min watched • 
                            {Math.round((progress.watch_time / progress.content.duration) * 100)}% complete
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'watchlist' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    My Watchlist ({watchlist.length})
                  </h3>
                  {watchlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Your watchlist is empty</p>
                      <p className="text-gray-500 text-sm">Start adding movies and shows you want to watch!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {watchlist.map((item) => (
                        <div key={item.content.id} className="bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={item.content.thumbnail_url}
                            alt={item.content.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="text-white font-medium mb-2">{item.content.title}</h4>
                            <p className="text-gray-400 text-sm">
                              {item.content.genres?.join(', ')}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              Added {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Watch History ({watchProgress.length})
                  </h3>
                  {watchProgress.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock size={48} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No viewing history yet</p>
                      <p className="text-gray-500 text-sm">Start watching some content!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {watchProgress.map((progress) => (
                        <div key={progress.content.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                          <img
                            src={progress.content.thumbnail_url}
                            alt={progress.content.title}
                            className="w-20 h-30 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{progress.content.title}</h4>
                            <p className="text-gray-400 text-sm mb-2">
                              {progress.content.genres?.join(', ')} • {progress.content.release_year}
                            </p>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-netflix-red h-2 rounded-full"
                                style={{ width: `${Math.min((progress.watch_time / progress.content.duration) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                              {Math.floor(progress.watch_time / 60)} min / {Math.floor(progress.content.duration / 60)} min • 
                              {Math.round((progress.watch_time / progress.content.duration) * 100)}% complete
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">
                              {new Date(progress.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">Profile Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-gray-800 text-gray-400 px-3 py-2 rounded border border-gray-700 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Display Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.name || ''}
                              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-netflix-red"
                            />
                          ) : (
                            <input
                              type="text"
                              value={profile?.name || ''}
                              disabled
                              className="w-full bg-gray-800 text-gray-400 px-3 py-2 rounded border border-gray-700 cursor-not-allowed"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Email Notifications</span>
                          <button className="w-12 h-6 bg-netflix-red rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Auto-play next episode</span>
                          <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Account Actions</h4>
                      <div className="space-y-3">
                        <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                          Change Password
                        </button>
                        <button className="w-full bg-red-900 text-red-200 py-2 px-4 rounded-lg hover:bg-red-800 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage