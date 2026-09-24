"use client"

import { useEffect, useRef } from "react"

export default function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Very basic static minimap drawing for mockup
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw galaxy disc
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    
    ctx.beginPath()
    ctx.arc(cx, cy, 80, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(6, 182, 212, 0.1)"
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(cx, cy, 30, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
    ctx.fill()

    // Draw camera marker
    ctx.beginPath()
    ctx.arc(cx + 40, cy + 20, 3, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + 40, cy + 20, 6, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(255,255,255,0.5)"
    ctx.stroke()

  }, [])

  return (
    <div className="fixed bottom-16 left-6 z-40 bg-black/40 border border-white/10 rounded-lg p-2 backdrop-blur-md hidden md:block">
      <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-2 text-center">
        Sector Map
      </div>
      <canvas 
        ref={canvasRef} 
        width={180} 
        height={180} 
        className="rounded bg-black/20"
      />
    </div>
  )
}
