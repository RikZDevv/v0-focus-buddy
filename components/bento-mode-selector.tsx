"use client"

import { cn } from "@/lib/utils"
import type { Mode } from "@/app/page"
import {
  Baby,
  Sparkles,
  Headphones,
  CheckSquare,
  GitBranch,
} from "lucide-react"

interface BentoModeSelectorProps {
  selectedMode: Mode
  onSelectMode: (mode: Mode) => void
}

const modes: { 
  id: Mode
  label: string
  description: string
  icon: React.ReactNode
  gradient: string
  glowClass: string
  gridClass: string
}[] = [
  {
    id: "eli5",
    label: "ELI5",
    description: "Explains complex topics using simple analogies a 5-year-old would understand",
    icon: <Baby className="h-7 w-7" />,
    gradient: "from-amber-400 to-orange-500",
    glowClass: "glow-amber",
    gridClass: "md:col-span-2 md:row-span-2",
  },
  {
    id: "emoji",
    label: "Visual Summary",
    description: "3 powerful bullet points with relevant emojis",
    icon: <Sparkles className="h-6 w-6" />,
    gradient: "from-pink-400 to-rose-500",
    glowClass: "glow-pink",
    gridClass: "md:col-span-1",
  },
  {
    id: "podcast",
    label: "Podcast Script",
    description: "Conversational dialogue format",
    icon: <Headphones className="h-6 w-6" />,
    gradient: "from-cyan-400 to-teal-500",
    glowClass: "glow-cyan",
    gridClass: "md:col-span-1",
  },
  {
    id: "action_steps",
    label: "Action Steps",
    description: "ADHD-friendly checklist with clear priorities and quick wins",
    icon: <CheckSquare className="h-7 w-7" />,
    gradient: "from-emerald-400 to-green-500",
    glowClass: "glow-emerald",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "mindmap",
    label: "Mind Map",
    description: "Visual hierarchy structure for better understanding",
    icon: <GitBranch className="h-6 w-6" />,
    gradient: "from-violet-400 to-purple-500",
    glowClass: "glow-violet",
    gridClass: "md:col-span-2",
  },
]

export function BentoModeSelector({ selectedMode, onSelectMode }: BentoModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {modes.map((mode) => {
        const isSelected = selectedMode === mode.id
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={cn(
              mode.gridClass,
              "group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 md:p-6",
              "glass-card",
              "hover:scale-[1.02] active:scale-[0.98]",
              isSelected && mode.glowClass,
              isSelected ? "ring-2 ring-white/20" : "hover:ring-1 hover:ring-white/10"
            )}
          >
            {/* Background gradient */}
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                mode.gradient,
                isSelected ? "opacity-20" : "group-hover:opacity-10"
              )}
            />
            
            {/* Shimmer effect on select */}
            {isSelected && (
              <div className="absolute inset-0 animate-shimmer" />
            )}
            
            {/* Content */}
            <div className="relative z-10 flex h-full flex-col">
              {/* Icon */}
              <div 
                className={cn(
                  "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
                  isSelected 
                    ? `bg-gradient-to-br ${mode.gradient} shadow-lg` 
                    : "bg-white/5 group-hover:bg-white/10"
                )}
              >
                <span className={cn(
                  "transition-colors duration-300",
                  isSelected ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {mode.icon}
                </span>
              </div>
              
              {/* Text */}
              <div className="mt-auto">
                <h3 className={cn(
                  "mb-1 text-lg font-semibold tracking-tight transition-colors duration-300",
                  isSelected ? "text-white" : "text-foreground/90"
                )}>
                  {mode.label}
                </h3>
                <p className={cn(
                  "text-sm leading-relaxed transition-colors duration-300",
                  isSelected ? "text-white/70" : "text-muted-foreground"
                )}>
                  {mode.description}
                </p>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
