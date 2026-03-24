"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Languages, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  Bot,
  Globe,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const popularLanguages = [
  { code: "spanish", label: "Spanish", flag: "ES" },
  { code: "french", label: "French", flag: "FR" },
  { code: "german", label: "German", flag: "DE" },
  { code: "japanese", label: "Japanese", flag: "JP" },
  { code: "korean", label: "Korean", flag: "KR" },
  { code: "chinese", label: "Chinese", flag: "CN" },
  { code: "indonesian", label: "Indonesian", flag: "ID" },
  { code: "arabic", label: "Arabic", flag: "AR" },
]

export default function TranslatePage() {
  const [text, setText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("indonesian")
  const [customLanguage, setCustomLanguage] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setIsLoading(true)
    setResult("")

    const language = customLanguage.trim() || targetLanguage

    try {
      const formData = new FormData()
      formData.append("mode", "context_translate")
      formData.append("text", `Translate to ${language}:\n\n${text}`)

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background pt-24">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2">
            <Languages className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Context-Aware Translation</span>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Smart
            </span>{" "}
            Translator
          </h1>
          
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground">
            More than just word-for-word translation. Get cultural context, idiomatic expressions, and a helpful glossary for better understanding.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="glass-card overflow-hidden rounded-2xl glow-blue">
            <div className="border-b border-white/5 bg-white/[0.02] px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Globe className="h-4 w-4 text-blue-400" />
                Source Text
              </h2>
            </div>
            
            <div className="p-5">
              {/* Language selector */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Target Language
                </label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {popularLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setTargetLanguage(lang.code)
                        setCustomLanguage("")
                      }}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                        targetLanguage === lang.code && !customLanguage
                          ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or type any language..."
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                />
              </div>

              {/* Text area */}
              <div className="mb-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="min-h-[180px] resize-none rounded-xl border-white/10 bg-white/[0.02] text-foreground placeholder:text-muted-foreground/60 focus:border-blue-500/50 focus-visible:ring-blue-500/30"
                  disabled={isLoading}
                />
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !text.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-6 text-base font-medium hover:from-blue-400 hover:to-indigo-400 disabled:from-muted disabled:to-muted"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    Translate
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result Section */}
          {!result && !isLoading ? (
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 ring-1 ring-white/10">
                  <Languages className="h-10 w-10 text-blue-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Enter Your Text
              </h3>
              <p className="max-w-sm text-muted-foreground">
                Type or paste text, select a language, and get a contextual translation with cultural insights.
              </p>
            </div>
          ) : isLoading ? (
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg className="h-20 w-20 animate-spin" viewBox="0 0 100 100">
                    <circle className="stroke-muted" strokeWidth="8" fill="none" cx="50" cy="50" r="40" />
                    <circle className="stroke-blue-400" strokeWidth="8" strokeLinecap="round" fill="none" cx="50" cy="50" r="40" strokeDasharray="250" strokeDashoffset="180" />
                  </svg>
                  <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <Languages className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground">Translating...</p>
              <p className="mt-1 text-sm text-muted-foreground">AI is creating a contextual translation</p>
              <div className="mt-4 flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            <div className="glass-card overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Bot className="h-4 w-4 text-blue-400" />
                  Translation Result
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className={cn(
                    "h-8 gap-2 rounded-lg px-3 text-xs transition-all",
                    copied ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {copied ? <><Check className="h-3.5 w-3.5" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
                </Button>
              </div>
              <div className="max-h-[500px] overflow-y-auto p-5">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 md:text-base">
                  {result}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
