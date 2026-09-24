'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Target, ArrowLeft, Orbit } from 'lucide-react';

export default function NavigationStatus() {
  const { navigationStatus, navigationTarget, setNavigationStatus } = useUIStore();

  useEffect(() => {
    if (navigationStatus === 'arrived' || navigationStatus === 'returning' || navigationStatus === 'entering-system') {
      const timer = setTimeout(() => {
        setNavigationStatus('idle');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigationStatus, setNavigationStatus]);

  if (navigationStatus === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="bg-slate-950/85 backdrop-blur-xl border border-cyan-500/35 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.25)] text-xs font-mono">
          {navigationStatus === 'navigating' && (
            <>
              <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span className="text-white/80">
                NAVIGATING → <span className="text-cyan-300 font-semibold">{navigationTarget?.toUpperCase()}</span>
              </span>
            </>
          )}

          {navigationStatus === 'entering-system' && (
            <>
              <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-white/80">
                ENTERING SYSTEM → <span className="text-cyan-300 font-semibold">{navigationTarget?.toUpperCase()}</span>
              </span>
            </>
          )}

          {navigationStatus === 'returning' && (
            <>
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-semibold">RETURNING TO GALAXY</span>
            </>
          )}

          {navigationStatus === 'arrived' && (
            <>
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white/80">
                TARGET LOCKED → <span className="text-emerald-300 font-semibold">{navigationTarget?.toUpperCase()}</span>
              </span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
