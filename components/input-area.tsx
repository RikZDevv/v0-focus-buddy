"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Send, ImageIcon, Loader2 } from "lucide-react"
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
  context_translate: "Paste text to get a simplified version with a glossary...",
  mindmap: "Paste text and I'll create a visual mind map structure...",
  mediscan: "Describe what you see or add context for the image analysis...",
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
    <Card className="mb-6 border-border bg-card">
      <CardContent className="p-4 md:p-6">
        {/* Image upload area for MediScan */}
        {isMediScan && (
          <div className="mb-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-64 w-full rounded-lg object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors",
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/50"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    Drop an image here or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG, WebP
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
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
            className="min-h-32 resize-none border-muted-foreground/20 bg-background pr-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (isMediScan ? !image : !text.trim())}
            size="icon"
            className="absolute bottom-3 right-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
