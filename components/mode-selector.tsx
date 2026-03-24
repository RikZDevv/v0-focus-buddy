"use client"

import { cn } from "@/lib/utils"
import type { Mode } from "@/app/page"
import {
  Baby,
  Sparkles,
  Headphones,
  CheckSquare,
  Languages,
  GitBranch,
  Scan,
} from "lucide-react"

interface ModeSelectorProps {
  selectedMode: Mode
  onSelectMode: (mode: Mode) => void
}

const modes: { id: Mode; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    id: "eli5",
    label: "ELI5",
    description: "Simple analogies",
    icon: <Baby className="h-5 w-5" />,
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "emoji",
    label: "Visual",
    description: "Emoji bullets",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
  {
    id: "podcast",
    label: "Podcast",
    description: "Conversational",
    icon: <Headphones className="h-5 w-5" />,
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "action_steps",
    label: "Actions",
    description: "ADHD checklist",
    icon: <CheckSquare className="h-5 w-5" />,
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "context_translate",
    label: "Translate",
    description: "Context & glossary",
    icon: <Languages className="h-5 w-5" />,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "mindmap",
    label: "Mind Map",
    description: "Visual hierarchy",
    icon: <GitBranch className="h-5 w-5" />,
    color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
  {
    id: "mediscan",
    label: "MediScan",
    description: "Image analysis",
    icon: <Scan className="h-5 w-5" />,
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
]

export function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200",
              "hover:scale-[1.02] hover:shadow-lg",
              selectedMode === mode.id
                ? cn(mode.color, "ring-2 ring-offset-2 ring-offset-background")
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                selectedMode === mode.id ? mode.color : "bg-muted"
              )}
            >
              {mode.icon}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{mode.label}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {mode.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
