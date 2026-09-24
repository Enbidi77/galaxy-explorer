"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const modes = ["AUTO", "HIGH", "BALANCED", "LOW"]

export default function PerformanceSelector() {
  const [selected, setSelected] = useState("AUTO")

  return (
    <div className="space-y-3">
      <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider">
        Performance Mode
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {modes.map(mode => (
          <button
            key={mode}
            onClick={() => setSelected(mode)}
            className={cn(
              "px-3 py-2 text-xs font-mono rounded border transition-colors",
              selected === mode 
                ? "bg-cyan-950/50 border-cyan-500/50 text-cyan-400" 
                : "bg-black/40 border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  )
}
