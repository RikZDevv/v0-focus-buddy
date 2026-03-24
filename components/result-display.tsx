"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Sparkles } from "lucide-react"
import { useState } from "react"

interface ResultDisplayProps {
  result: string
  isLoading: boolean
}

export function ResultDisplay({ result, isLoading }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!result && !isLoading) {
    return (
      <Card className="border-dashed border-muted-foreground/30 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Ready to Transform
          </h3>
          <p className="max-w-sm text-muted-foreground">
            Select a mode above, paste your text, and let FocusBuddy work its magic.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
            <p className="animate-pulse text-muted-foreground">
              Processing your request...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Result
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {result}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
