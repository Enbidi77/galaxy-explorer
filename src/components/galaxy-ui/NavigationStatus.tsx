"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function NavigationStatus({ status = "TARGET LOCKED" }) {
  // Return null if no status
  if (!status) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="bg-cyan-950/80 border border-cyan-500/50 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span className="text-cyan-400 text-xs font-mono tracking-widest font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {status}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
