"use client"

import { useState } from "react"
import { BentoModeSelector } from "@/components/bento-mode-selector"
import { InputArea } from "@/components/input-area"
import { ResultDisplay } from "@/components/result-display"
import { Brain, Sparkles } from "lucide-react"

export type Mode = "eli5" | "emoji" | "podcast" | "action_steps" | "context_translate" | "mindmap" | "mediscan"

export default function FocusBuddyPage() {
  const [selectedMode, setSelectedMode] = useState<Mode>("eli5")
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (text: string, image?: File) => {
    setIsLoading(true)
    setResult("")

    try {
      const formData = new FormData()
      formData.append("mode", selectedMode)
      formData.append("text", text)
      if (image) {
        formData.append("image", image)
      }

      const response = await fetch("/api/focus", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setResult(data.result)
    } catch (error) {
      setResult(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0">
        {/* Gradient orbs */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Learning Tools</span>
          </div>
          
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/30 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg md:h-20 md:w-20">
                <Brain className="h-9 w-9 text-white md:h-11 md:w-11" />
              </div>
            </div>
            <h1 className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl">
              FocusBuddy
            </h1>
          </div>
          
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            7 AI Sages designed for neurodiverse minds. Transform complex information into formats that work for you.
          </p>
        </header>

        {/* Bento Grid Mode Selector */}
        <BentoModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />

        {/* Input & Result Section */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Input Area */}
          <InputArea
            selectedMode={selectedMode}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {/* Result Display */}
          <ResultDisplay result={result} isLoading={isLoading} selectedMode={selectedMode} />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-muted-foreground/60">
            Built with care for ADHD & neurodiverse thinkers
          </p>
        </footer>
      </div>
    </main>
  )
}
