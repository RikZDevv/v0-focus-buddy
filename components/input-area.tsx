"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, Wand2 } from "lucide-react"
import type { Mode } from "@/app/page"
import { cn } from "@/lib/utils"

interface InputAreaProps {
  selectedMode: Mode
  onSubmit: (text: string) => void
  isLoading: boolean
}

const placeholders: Record<Mode, string> = {
  eli5: "Paste any complex text and I'll explain it like you're 5 years old...",
  emoji: "Paste text to get 3 powerful bullet points with visual emojis...",
  podcast: "Paste a topic and I'll create a conversational podcast script...",
  action_steps: "Paste any wall of text and I'll create an ADHD-friendly checklist...",
  mindmap: "Paste text and I'll create a visual mind map structure...",
}

const modeLabels: Record<Mode, string> = {
  eli5: "Simplify with ELI5",
  emoji: "Create Visual Summary",
  podcast: "Generate Podcast Script",
  action_steps: "Extract Action Steps",
  mindmap: "Build Mind Map",
}

export function InputArea({ selectedMode, onSubmit, isLoading }: InputAreaProps) {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="border-b border-white/5 bg-white/[0.02] px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Wand2 className="h-4 w-4 text-primary" />
          Input
        </h2>
      </div>
      
      <div className="p-5">
        {/* Text area */}
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[selectedMode]}
            className={cn(
              "min-h-[200px] resize-none rounded-xl border-white/10 bg-white/[0.02] text-foreground transition-all duration-300",
              "placeholder:text-muted-foreground/60",
              "focus:border-primary/50 focus:bg-white/[0.03] focus-visible:ring-primary/30"
            )}
            disabled={isLoading}
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">Cmd</kbd> + <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to submit
          </p>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
            size="lg"
            className={cn(
              "group relative overflow-hidden rounded-xl px-6 transition-all duration-300",
              "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400",
              "disabled:from-muted disabled:to-muted disabled:text-muted-foreground"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {modeLabels[selectedMode]}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
