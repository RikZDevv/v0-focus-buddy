"use client"

import { useState } from "react"
import { BentoModeSelector } from "@/components/bento-mode-selector"
import { InputArea } from "@/components/input-area"
import { ResultDisplay } from "@/components/result-display"
import { Sparkles, Zap, Shield, Brain } from "lucide-react"

export type Mode = "eli5" | "emoji" | "podcast" | "action_steps" | "mindmap"

export default function FocusBuddyPage() {
  const [selectedMode, setSelectedMode] = useState<Mode>("eli5")
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (text: string) => {
    setIsLoading(true)
    setResult("")

    try {
      const formData = new FormData()
      formData.append("mode", selectedMode)
      formData.append("text", text)

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
    <main className="relative min-h-screen overflow-hidden bg-background pt-24">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute -right-40 top-1/4 h-[600px] w-[600px] rounded-full bg-blue-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12">
        {/* Hero Section */}
        <header className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Learning Assistant</span>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Transform{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Complex Ideas
            </span>
            <br />
            Into Clear Understanding
          </h1>
          
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground">
            Choose a mode below and paste any text. FocusBuddy will transform it into a format that works best for your brain.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-foreground/80">Instant Results</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-foreground/80">ADHD-Friendly</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
              <Brain className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-foreground/80">5 AI Modes</span>
            </div>
          </div>
        </header>

        {/* Bento Grid Mode Selector */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Select Your Mode
          </h2>
          <BentoModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />
        </section>

        {/* Input & Result Section */}
        <section className="grid gap-6 lg:grid-cols-2">
          <InputArea
            selectedMode={selectedMode}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <ResultDisplay result={result} isLoading={isLoading} selectedMode={selectedMode} />
        </section>
      </div>
    </main>
  )
}
