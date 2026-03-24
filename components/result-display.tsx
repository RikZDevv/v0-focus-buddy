"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check, Sparkles, Bot, Zap } from "lucide-react"
import { useState } from "react"
import type { Mode } from "@/app/page"
import { cn } from "@/lib/utils"

interface ResultDisplayProps {
  result: string
  isLoading: boolean
  selectedMode: Mode
}

const modeIcons: Record<Mode, React.ReactNode> = {
  eli5: <span className="text-xl">5</span>,
  emoji: <Sparkles className="h-5 w-5" />,
  podcast: <Bot className="h-5 w-5" />,
  action_steps: <Check className="h-5 w-5" />,
  context_translate: <span className="text-lg">AB</span>,
  mindmap: <Zap className="h-5 w-5" />,
  mediscan: <span className="text-lg">+</span>,
}

export function ResultDisplay({ result, isLoading, selectedMode }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!result && !isLoading) {
    return (
      <div className="glass-card flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-white/10">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Ready to Transform
        </h3>
        <p className="max-w-sm text-muted-foreground">
          Select a mode, paste your text, and let FocusBuddy work its magic.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="glass-card flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl p-8">
        {/* Animated loading indicator */}
        <div className="relative mb-6">
          {/* Outer glow ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          
          {/* Main spinner */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            <svg className="h-20 w-20 animate-spin" viewBox="0 0 100 100">
              <circle
                className="stroke-muted"
                strokeWidth="8"
                fill="none"
                cx="50"
                cy="50"
                r="40"
              />
              <circle
                className="stroke-primary"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                cx="50"
                cy="50"
                r="40"
                strokeDasharray="250"
                strokeDashoffset="180"
              />
            </svg>
            
            {/* Center icon */}
            <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              {modeIcons[selectedMode]}
            </div>
          </div>
        </div>
        
        <p className="text-lg font-medium text-foreground">Processing...</p>
        <p className="mt-1 text-sm text-muted-foreground">
          AI is analyzing your content
        </p>
        
        {/* Loading dots */}
        <div className="mt-4 flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Bot className="h-4 w-4 text-primary" />
          Result
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={cn(
            "h-8 gap-2 rounded-lg px-3 text-xs transition-all",
            copied 
              ? "bg-emerald-500/20 text-emerald-400" 
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      
      {/* Content */}
      <div className="max-h-[500px] overflow-y-auto p-5">
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 md:text-base">
            {result}
          </div>
        </div>
      </div>
    </div>
  )
}
