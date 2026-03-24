"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Menu, X, Scan, Languages, Home, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home, description: "All AI modes in one place" },
  { href: "/mediscan", label: "MediScan", icon: Scan, description: "Medical image analysis" },
  { href: "/translate", label: "Translate", icon: Languages, description: "Context-aware translation" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <nav className="glass-card flex items-center justify-between rounded-2xl px-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="hidden bg-gradient-to-r from-white to-white/80 bg-clip-text text-xl font-bold text-transparent sm:block">
                FocusBuddy
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2 rounded-xl px-4 transition-all duration-300",
                        isActive 
                          ? "bg-primary/20 text-primary hover:bg-primary/30" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] transform bg-card/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close button */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-foreground">FocusBuddy</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={cn(
                    "group flex items-center gap-4 rounded-xl p-4 transition-all duration-300",
                    isActive 
                      ? "bg-primary/20" 
                      : "hover:bg-white/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium transition-colors",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">
              Built with care for ADHD & neurodiverse thinkers
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
