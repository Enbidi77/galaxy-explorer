'use client';

import React from 'react';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Play, Pause, X } from 'lucide-react';

export default function CinematicMode() {
  const {
    isCinematicMode,
    setCinematicMode,
    isCinematicPaused,
    setCinematicPaused,
    currentTourStop
  } = useGalaxyStore();

  if (!isCinematicMode) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-full px-5 py-2.5 flex items-center gap-4 text-xs font-mono"
      >
        <div className="flex items-center gap-2 text-cyan-400">
          <Film className="w-4 h-4 animate-pulse" />
          <span className="font-semibold tracking-widest text-[11px] uppercase">
            CINEMATIC TOUR
          </span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="text-white/80 flex items-center gap-1.5">
          <span className="text-white/40">LOCATION:</span>
          <span className="text-white font-medium">{currentTourStop}</span>
        </div>

        <div className="flex items-center gap-1.5 pl-2">
          <button
            onClick={() => setCinematicPaused(!isCinematicPaused)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 px-2.5"
            title={isCinematicPaused ? "Resume Tour" : "Pause Tour"}
          >
            {isCinematicPaused ? (
              <>
                <Play className="w-3 h-3 fill-current text-cyan-400" />
                <span className="text-[10px]">RESUME</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-white/80" />
                <span className="text-[10px]">PAUSE</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCinematicMode(false)}
            className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 px-2.5 border border-red-500/20"
            title="Exit Cinematic Mode"
          >
            <X className="w-3 h-3" />
            <span className="text-[10px]">EXIT</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
