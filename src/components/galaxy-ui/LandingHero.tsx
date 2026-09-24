"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function LandingHero({ onEnter = () => {} }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="text-center px-4 max-w-4xl mx-auto">
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-cyan-400 tracking-[0.3em] text-sm md:text-base font-semibold mb-6 uppercase"
        >
          Explore the galaxy
        </motion.p>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-7xl font-light text-white tracking-tight mb-12 drop-shadow-2xl"
        >
          THE UNIVERSE IS <span className="font-bold">WAITING</span>
        </motion.h1>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            onClick={onEnter}
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full px-8 py-6 text-lg tracking-widest border border-cyan-400/50 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_40px_0px_rgba(6,182,212,0.6)]"
          >
            [ ENTER EXPLORATION ]
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
