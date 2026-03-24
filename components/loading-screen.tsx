"use client"

import { useEffect, useState } from "react"
import { Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState("Initializing")

  useEffect(() => {
    const texts = [
      "Initializing",
      "Loading AI Models",
      "Preparing Your Space",
      "Almost Ready"
    ]

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 5
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(onLoadingComplete, 500)
          return 100
        }
        return next
      })
    }, 200)

    const textInterval = setInterval(() => {
      setText((prev) => {
        const idx = texts.indexOf(prev)
        return texts[(idx + 1) % texts.length]
      })
    }, 600)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-3xl bg-primary/30 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-2xl">
            <Brain className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          FocusBuddy
        </h1>
        <p className="mb-8 text-muted-foreground">7 AI Sages for Neurodiverse Minds</p>

        {/* Progress bar */}
        <div className="relative mb-4 h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300",
              progress === 100 && "from-emerald-400 to-green-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading text */}
        <p className="text-sm text-muted-foreground">{text}...</p>
      </div>
    </div>
  )
}
