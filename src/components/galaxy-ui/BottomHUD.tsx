"use client"

import { Target, Eye, Database } from "lucide-react"

export default function BottomHUD() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/60 border-t border-white/10 backdrop-blur-md z-40 flex items-center px-6 justify-between text-xs font-mono">
      <div className="flex items-center gap-6 text-white/50">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-500/70" />
          <span>OBJECTS: <span className="text-white">142,305</span></span>
        </div>
        <div className="flex items-center gap-2 hidden md:flex">
          <Eye className="w-3.5 h-3.5 text-cyan-500/70" />
          <span>VISIBLE: <span className="text-white">12,041</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-white/50">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-cyan-500/70" />
          <span>COORD: <span className="text-white">RA 17h 45m 40s | DEC -29° 00' 28"</span></span>
        </div>
      </div>
    </div>
  )
}
