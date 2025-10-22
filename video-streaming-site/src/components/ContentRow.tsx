import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Content, ContentRowProps } from '../types'
import ContentCard from './ContentCard'

const ContentRow: React.FC<ContentRowProps> = ({ title, contents, category }) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = () => {
    if (!rowRef.current) return

    const scrollLeft = rowRef.current.scrollLeft
    const scrollWidth = rowRef.current.scrollWidth
    const clientWidth = rowRef.current.clientWidth

    setIsScrolled(scrollLeft > 0)
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return

    const scrollAmount = 300
    const currentScroll = rowRef.current.scrollLeft

    rowRef.current.scrollTo({
      left: direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    })
  }

  if (!contents || contents.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h2>
        {category && (
          <button className="text-netflix-red hover:text-red-400 text-sm font-medium transition-colors">
            Explore All
          </button>
        )}
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Content Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 py-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {contents.map((content) => (
            <div key={content.id} className="flex-shrink-0">
              <ContentCard content={content} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ContentRow