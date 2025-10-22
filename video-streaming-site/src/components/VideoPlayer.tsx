import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import type { Content, VideoPlayerProps } from '../types'

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  content, 
  onProgressUpdate, 
  onComplete,
  startTime = 0 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(startTime)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!videoRef.current) return

    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{
        src: content.video_url,
        type: 'video/mp4'
      }],
      poster: content.thumbnail_url,
      autoplay: false,
      preload: 'auto',
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        pictureInPictureToggle: false,
        volumePanel: {
          inline: false
        }
      }
    })

    playerRef.current = player

    // Set initial time if provided
    if (startTime > 0) {
      player.ready(() => {
        player.currentTime(startTime)
      })
    }

    // Event listeners
    player.on('play', () => {
      setIsPlaying(true)
    })

    player.on('pause', () => {
      setIsPlaying(false)
    })

    player.on('timeupdate', () => {
      const currentTime = player.currentTime()
      const duration = player.duration()
      
      setCurrentTime(currentTime)
      setDuration(duration)
      
      // Update progress every 5 seconds
      if (Math.floor(currentTime) % 5 === 0 && onProgressUpdate) {
        onProgressUpdate(currentTime)
      }
    })

    player.on('ended', () => {
      setIsPlaying(false)
      if (onComplete) {
        onComplete()
      }
      if (onProgressUpdate) {
        onProgressUpdate(duration)
      }
    })

    player.on('loadedmetadata', () => {
      setDuration(player.duration())
    })

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
      }
    }
  }, [content.video_url, content.thumbnail_url, startTime, duration, onProgressUpdate, onComplete])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered"
        controls
        preload="auto"
        data-setup="{}"
      />
      
      {/* Video Info Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-gradient-to-r from-black via-black/70 to-transparent p-4 rounded">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {content.title}
          </h1>
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-3">
            {content.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
              {content.rating}/10
            </span>
            <span>{content.release_year}</span>
            <span>{formatDuration(content.duration)}</span>
            <span className="border border-gray-500 px-2 py-1 rounded text-xs">
              {content.content_type.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar (when paused) */}
      {!isPlaying && duration > 0 && (
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-netflix-red h-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer