"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WebGLFallback() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 text-center z-50">
      <div className="max-w-md bg-black/40 border border-red-500/20 p-8 rounded-2xl backdrop-blur-sm">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">WebGL Not Supported</h2>
        
        <p className="text-white/60 mb-8 leading-relaxed">
          Your browser or device doesn&apos;t support WebGL, which is required to render the 3D galaxy visualization.
        </p>
        
        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10">
          [ View 2D Galaxy ]
        </Button>
      </div>
    </div>
  )
}
