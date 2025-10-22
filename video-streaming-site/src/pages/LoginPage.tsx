import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent z-10" />
        <div className="w-full h-full bg-gradient-to-r from-netflix-black via-netflix-black/30 to-transparent" />
      </div>

      <div className="relative z-20 w-full max-w-md px-4">
        <div className="bg-black bg-opacity-75 p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Sign In
          </h1>

          {error && (
            <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-netflix-red text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              New to Netflix?{' '}
              <Link to="/register" className="text-white hover:underline">
                Sign up now
              </Link>
            </p>
          </div>

          <div className="mt-8 text-xs text-gray-400">
            <p className="mb-2">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
            <p>
              By signing in, you agree to our{' '}
              <a href="#" className="text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage