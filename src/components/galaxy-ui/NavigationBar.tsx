"use client"

import { Sparkles, Maximize, Volume2 } from "lucide-react"
import GalaxySearch from "./GalaxySearch"

export default function NavigationBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-40 flex items-center px-6 justify-between border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-cyan-500/10 rounded-md border border-cyan-500/30">
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
        <span className="text-white font-bold tracking-widest text-sm hidden sm:inline-block">
          GALAXY EXPLORER
        </span>
      </div>

      <div className="flex-1 max-w-md mx-4 flex justify-center">
        <GalaxySearch />
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition">
          <Volume2 className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition hidden sm:block">
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
