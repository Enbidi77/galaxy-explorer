"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function LoadingScreen({ progress = 45, status = "LOADING SECTOR DATA..." }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         {/* Simple static stars for loading screen */}
         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full" />
         <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-white rounded-full" />
         <div className="absolute top-1/2 left-4/5 w-1 h-1 bg-white rounded-full" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center z-10"
      >
        <div className="p-4 bg-cyan-950/30 rounded-2xl border border-cyan-500/20 mb-8">
          <Sparkles className="w-12 h-12 text-cyan-400" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-[0.2em] mb-4 text-center">
          INITIALIZING <span className="text-cyan-400">GALAXY</span>
        </h1>
        
        <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        
        <p className="text-cyan-400/60 font-mono text-sm tracking-wider">
          {status} {progress}%
        </p>
      </motion.div>
    </motion.div>
  )
}
