"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Send, ImageIcon, Loader2, Wand2 } from "lucide-react"
import type { Mode } from "@/app/page"
import { cn } from "@/lib/utils"

interface InputAreaProps {
  selectedMode: Mode
  onSubmit: (text: string, image?: File) => void
  isLoading: boolean
}

const placeholders: Record<Mode, string> = {
  eli5: "Paste any complex text and I'll explain it like you're 5...",
  emoji: "Paste text to get 3 powerful bullet points with emojis...",
  podcast: "Paste a topic and I'll create a conversational podcast script...",
  action_steps: "Paste any wall of text and I'll create an ADHD-friendly checklist...",
  context_translate: "Paste text and specify target language for translation with context...",
  mindmap: "Paste text and I'll create a visual mind map structure...",
  mediscan: "Describe what you see or add context for the image analysis...",
}

const modeLabels: Record<Mode, string> = {
  eli5: "Simplify with ELI5",
  emoji: "Create Visual Summary",
  podcast: "Generate Podcast Script",
  action_steps: "Extract Action Steps",
  context_translate: "Translate with Context",
  mindmap: "Build Mind Map",
  mediscan: "Analyze Medical Image",
}

export function InputArea({ selectedMode, onSubmit, isLoading }: InputAreaProps) {
  const [text, setText] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isMediScan = selectedMode === "mediscan"

  const handleImageChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleImageChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const clearImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (isMediScan && !image) return
    if (!isMediScan && !text.trim()) return
    onSubmit(text, image ?? undefined)
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
        {/* Image upload area for MediScan */}
        {isMediScan && (
          <div className="mb-4">
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-56 w-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-3 top-3 h-8 w-8 rounded-full"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <p className="absolute bottom-3 left-3 text-sm font-medium text-white">
                  {image?.name}
                </p>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex h-44 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-300",
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                )}
              >
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                  isDragging ? "bg-primary/20" : "bg-white/5"
                )}>
                  <ImageIcon className={cn(
                    "h-7 w-7 transition-colors",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {isDragging ? "Drop your image here" : "Drop an image or click to upload"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supports JPG, PNG, WebP
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
          </div>
        )}

        {/* Text area */}
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholders[selectedMode]}
            className={cn(
              "min-h-36 resize-none rounded-xl border-white/10 bg-white/[0.02] text-foreground transition-all duration-300",
              "placeholder:text-muted-foreground/60",
              "focus:border-primary/50 focus:bg-white/[0.03] focus-visible:ring-primary/30",
              isMediScan && "min-h-24"
            )}
            disabled={isLoading}
          />
        </div>

        {/* Submit button */}
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (isMediScan ? !image : !text.trim())}
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
