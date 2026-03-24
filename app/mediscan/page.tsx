"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Scan, 
  Upload, 
  X, 
  Send, 
  ImageIcon, 
  Loader2, 
  AlertTriangle,
  Copy,
  Check,
  Bot,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function MediScanPage() {
  const [text, setText] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSubmit = async () => {
    if (!image) return
    setIsLoading(true)
    setResult("")

    try {
      const formData = new FormData()
      formData.append("mode", "mediscan")
      formData.append("text", text)
      formData.append("image", image)

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
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-rose-500/15 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[600px] w-[600px] rounded-full bg-pink-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2">
            <Scan className="h-4 w-4 text-rose-400" />
            <span className="text-sm font-medium text-rose-400">Medical Image Analysis</span>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              MediScan
            </span>{" "}
            AI Assistant
          </h1>
          
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground">
            Upload a medical image and get educational health information. Our AI analyzes skin conditions, symptoms, medications, and more.
          </p>

          {/* Disclaimer */}
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <p className="text-left text-sm text-amber-200/90">
                <strong>Disclaimer:</strong> This tool provides educational information only and is NOT a medical diagnosis. Always consult a healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="glass-card overflow-hidden rounded-2xl glow-rose">
            <div className="border-b border-white/5 bg-white/[0.02] px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Upload className="h-4 w-4 text-rose-400" />
                Upload Image
              </h2>
            </div>
            
            <div className="p-5">
              {/* Image upload area */}
              <div className="mb-4">
                {imagePreview ? (
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="max-h-64 w-full object-contain"
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
                      "flex h-52 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-300",
                      isDragging
                        ? "border-rose-400 bg-rose-500/10 scale-[1.02]"
                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                    )}
                  >
                    <div className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                      isDragging ? "bg-rose-500/20" : "bg-white/5"
                    )}>
                      <ImageIcon className={cn(
                        "h-8 w-8 transition-colors",
                        isDragging ? "text-rose-400" : "text-muted-foreground"
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

              {/* Context text area */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Additional Context (optional)
                </label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe what you see or add any relevant context..."
                  className="min-h-24 resize-none rounded-xl border-white/10 bg-white/[0.02] text-foreground placeholder:text-muted-foreground/60 focus:border-rose-500/50 focus-visible:ring-rose-500/30"
                  disabled={isLoading}
                />
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !image}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-6 text-base font-medium hover:from-rose-400 hover:to-pink-400 disabled:from-muted disabled:to-muted"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-5 w-5" />
                    Analyze Image
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result Section */}
          {!result && !isLoading ? (
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-rose-500/20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 ring-1 ring-white/10">
                  <Shield className="h-10 w-10 text-rose-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Upload an Image
              </h3>
              <p className="max-w-sm text-muted-foreground">
                Drop or select a medical image and MediScan will provide educational health information.
              </p>
            </div>
          ) : isLoading ? (
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-ping rounded-full bg-rose-500/30" />
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg className="h-20 w-20 animate-spin" viewBox="0 0 100 100">
                    <circle className="stroke-muted" strokeWidth="8" fill="none" cx="50" cy="50" r="40" />
                    <circle className="stroke-rose-400" strokeWidth="8" strokeLinecap="round" fill="none" cx="50" cy="50" r="40" strokeDasharray="250" strokeDashoffset="180" />
                  </svg>
                  <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                    <Scan className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground">Analyzing Image...</p>
              <p className="mt-1 text-sm text-muted-foreground">AI is examining your medical image</p>
              <div className="mt-4 flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-rose-400" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-rose-400" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-rose-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            <div className="glass-card overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Bot className="h-4 w-4 text-rose-400" />
                  Analysis Result
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
