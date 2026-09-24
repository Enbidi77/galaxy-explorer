"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, RotateCcw, Target, Settings, Maximize, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commands = [
    { icon: Search, label: "Search Object...", shortcut: "S" },
    { icon: RotateCcw, label: "Reset Camera", shortcut: "R" },
    { icon: Target, label: "Focus Selected", shortcut: "F" },
    { icon: Maximize, label: "Toggle Fullscreen", shortcut: "F11" },
    { icon: Settings, label: "Open Settings", shortcut: "," },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-slate-950/90 border border-white/20 shadow-2xl rounded-xl overflow-hidden backdrop-blur-md"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/10">
              <Input 
                autoFocus
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 px-0 shadow-none text-lg placeholder:text-white/30"
              />
              <kbd className="hidden sm:inline-flex ml-2 px-2 py-1 text-xs bg-white/10 rounded font-mono text-white/50">ESC</kbd>
            </div>

            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                Commands
              </div>
              <div className="space-y-1">
                {commands.map((cmd, i) => (
                  <button 
                    key={i}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-cyan-950/50 hover:text-cyan-400 text-white/80 transition-colors text-left group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <cmd.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span>{cmd.label}</span>
                    </div>
                    <kbd className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded font-mono text-white/40 group-hover:text-cyan-400/70 group-hover:border-cyan-500/30">
                      {cmd.shortcut}
                    </kbd>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
