"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "./loading-screen"
import { Navigation } from "./navigation"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem("focusbuddy-visited")
    if (hasVisited) {
      setIsLoading(false)
      setShowContent(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    sessionStorage.setItem("focusbuddy-visited", "true")
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      
      <div
        className={`transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navigation />
        {children}
      </div>
    </>
  )
}
