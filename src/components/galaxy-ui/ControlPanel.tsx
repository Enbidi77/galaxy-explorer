"use client"

import { useState } from "react"
import { Settings, X, Layers, Orbit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function ControlPanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-20 right-6 z-40">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900/80 border-white/20 text-white backdrop-blur-md hover:bg-white/10 hover:text-white"
      >
        <Settings className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-14 right-0 w-80 bg-slate-950/90 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                Settings
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Visualization
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Labels</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Orbits</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Nebula rendering</span>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="space-y-4">
                <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider flex items-center gap-2">
                  <Orbit className="w-3 h-3" /> Camera
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Field of View</span>
                    <span className="text-cyan-400 font-mono">60°</span>
                  </div>
                  <Slider defaultValue={[60]} max={120} min={30} step={1} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
