'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  { threshold: 0, text: 'Initializing spatial renderer...' },
  { threshold: 15, text: 'Generating star field...' },
  { threshold: 35, text: 'Computing spiral arms...' },
  { threshold: 55, text: 'Loading celestial objects...' },
  { threshold: 72, text: 'Calibrating navigation...' },
  { threshold: 88, text: 'Preparing visualization...' },
  { threshold: 100, text: 'Ready' },
];

interface LoadingScreenProps {
  progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const currentStep = useMemo(() => {
    for (let i = LOADING_STEPS.length - 1; i >= 0; i--) {
      if (progress >= LOADING_STEPS[i].threshold) {
        return LOADING_STEPS[i].text;
      }
    }
    return LOADING_STEPS[0].text;
  }, [progress]);

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000005]"
        >
          <div className="w-72 flex flex-col items-center">
            {/* Spinning ring */}
            <div className="relative w-16 h-16 mb-8">
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
            </div>

            <h2 className="text-white/90 tracking-[0.3em] font-light text-sm mb-1">
              INITIALIZING GALAXY
            </h2>
            <p className="text-white/30 text-xs font-mono mb-6">{currentStep}</p>

            {/* Progress bar */}
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>

            <div className="w-full text-right">
              <span className="text-white/40 text-xs font-mono">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
