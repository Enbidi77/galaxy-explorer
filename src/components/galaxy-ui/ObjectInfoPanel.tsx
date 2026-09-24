"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Target, Navigation, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock props for now
export default function ObjectInfoPanel({ isOpen = true, onClose = () => {} }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-slate-950/80 border-l border-white/10 backdrop-blur-xl z-40 p-6 flex flex-col pt-20"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-950/50 rounded-lg border border-cyan-500/30 text-cyan-400">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Sol</h2>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/30 mt-1">
                  G-Type Main Sequence
                </Badge>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <p className="text-sm text-white/70 leading-relaxed">
                The Sun is the star at the center of the Solar System. It is a nearly perfect ball of hot plasma, heated to incandescence by nuclear fusion reactions in its core.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/5 rounded-lg p-3">
                <div className="text-[10px] uppercase text-white/40 tracking-wider mb-1">Distance</div>
                <div className="font-mono text-cyan-300">0.00 ly</div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-lg p-3">
                <div className="text-[10px] uppercase text-white/40 tracking-wider mb-1">Mass</div>
                <div className="font-mono text-cyan-300">1.0 M☉</div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-lg p-3">
                <div className="text-[10px] uppercase text-white/40 tracking-wider mb-1">Temperature</div>
                <div className="font-mono text-cyan-300">5,778 K</div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-lg p-3">
                <div className="text-[10px] uppercase text-white/40 tracking-wider mb-1">Radius</div>
                <div className="font-mono text-cyan-300">1.0 R☉</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-auto flex gap-3">
            <Button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/50">
              <Target className="w-4 h-4 mr-2" />
              FOCUS
            </Button>
            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
              <Navigation className="w-4 h-4 mr-2" />
              EXPLORE
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
