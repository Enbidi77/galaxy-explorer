"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Star, Globe, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function GalaxySearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")

  // Mock data for now since stores aren't fully implemented
  const results = [
    { id: 1, name: "Sol", type: "Star", distance: "0 ly", icon: Star },
    { id: 2, name: "Earth", type: "Planet", distance: "0 ly", icon: Globe },
    { id: 3, name: "Alpha Centauri A", type: "Star", distance: "4.37 ly", icon: Star },
  ]

  const filtered = query 
    ? results.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : results

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 bg-black/40 border border-white/10 rounded-md hover:bg-white/10 transition-colors backdrop-blur-md"
      >
        <Search className="w-4 h-4" />
        <span>Search Galaxy...</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-lg bg-slate-950/90 border border-white/20 shadow-2xl rounded-xl overflow-hidden backdrop-blur-md"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-cyan-400 mr-3" />
                <Input 
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stars, planets, nebulae..."
                  className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 px-0 shadow-none text-lg placeholder:text-white/30"
                />
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="py-10 text-center text-white/40 text-sm">
                    No celestial objects found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Results
                    </div>
                    {filtered.map(result => (
                      <button 
                        key={result.id}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-black/50 rounded-md border border-white/5 text-cyan-400 group-hover:text-cyan-300">
                            <result.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{result.name}</div>
                            <div className="text-white/40 text-xs font-mono">{result.distance}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-white/10 text-white/60 bg-black/30">
                          {result.type}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
