import { Outlet } from 'react-router-dom'
import { useState, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import LanguageSwitcher from '../UI/LanguageSwitcher'

const Layout = () => {
  const [topBannerVisible, setTopBannerVisible] = useState(true)
  const [celebrationVisible, setCelebrationVisible] = useState(true)

  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 240, y: window.innerHeight - 180 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const celebrationRef = useRef(null)

  const configKey = 'SHOW_BETA_BANNER' // you can later use a prop or backend value

  const handleMouseDown = (e) => {
    if (e.target.closest('.close-button')) return
    setIsDragging(true)
    const rect = celebrationRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 🔼 Top Banner */}
      {configKey === 'SHOW_BETA_BANNER' && topBannerVisible && (
        <div className="bg-yellow-100 text-yellow-800 text-sm text-center py-2 shadow-md flex items-center justify-center relative z-50">
          🚧 This is a <strong className="mx-1">Beta</strong> version. Features may change. Enjoy exploring!
          <button
            onClick={() => setTopBannerVisible(false)}
            className="absolute right-4 text-yellow-700 hover:text-red-500 transition"
            title="Close banner"
          >
            ×
          </button>
        </div>
      )}

      {/* 🪔 Celebration Floating Banner */}
      {configKey === 'SHOW_BETA_BANNER' && celebrationVisible && (
        <div
          ref={celebrationRef}
          className={`fixed z-40 m-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
          style={{
            left: position.x,
            top: position.y,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="relative group">
            {/* Close Button */}
            <button
              onClick={() => setCelebrationVisible(false)}
              className="close-button absolute -top-2 -right-2 w-6 h-6 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
              title="Close celebration banner"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Cloud Bubble */}
            <div className={`bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full px-6 py-3 shadow-lg border-2 border-yellow-300 relative transition-all duration-300 ${isDragging ? 'scale-105 shadow-xl' : 'hover:scale-102 hover:shadow-xl'}`}>
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full"></div>
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full"></div>

              {/* Text */}
              <div className="flex flex-col items-center text-center text-white text-sm font-bold tracking-wide pointer-events-none">
                <span className="text-yellow-300">🪔 Trail Launch 🪔</span>
                <span className="text-xs text-white mt-1">
                  Thank you for being part of our journey!
                </span>
              </div>

              {/* Decorations */}
              <div className="absolute -top-2 left-2 w-3 h-2 bg-green-400 rounded-full opacity-80 transform rotate-12"></div>
              <div className="absolute -top-2 right-2 w-3 h-2 bg-green-400 rounded-full opacity-80 transform -rotate-12"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-green-400 rounded-full opacity-80"></div>
            </div>

            {/* Sparkles */}
            <div className="absolute -top-1 -left-2 w-2 h-2 text-yellow-400 opacity-70 animate-pulse">✨</div>
            <div className="absolute -top-1 -right-2 w-2 h-2 text-yellow-400 opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute -bottom-1 left-1/4 w-2 h-2 text-orange-400 opacity-60 animate-bounce" style={{ animationDelay: '1s' }}>🎉</div>
            <div className="absolute -bottom-1 right-1/4 w-2 h-2 text-red-400 opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }}>🎊</div>
          </div>
        </div>
      )}

      <Header />
      <LanguageSwitcher />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout