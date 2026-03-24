"use client"

import { useState } from "react"
import { ModeSelector } from "@/components/mode-selector"
import { InputArea } from "@/components/input-area"
import { ResultDisplay } from "@/components/result-display"
import { Brain } from "lucide-react"

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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 text-center md:mb-12">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              FocusBuddy
            </h1>
          </div>
          <p className="text-muted-foreground">
            7 Sages for Neurodiverse Minds
          </p>
        </header>

        {/* Mode Selector */}
        <ModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />

        {/* Input Area */}
        <InputArea
          selectedMode={selectedMode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Result Display */}
        <ResultDisplay result={result} isLoading={isLoading} />
      </div>
    </main>
  )
}
