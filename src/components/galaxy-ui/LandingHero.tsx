'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

interface LandingHeroProps {
  onEnter: () => void;
}

export default function LandingHero({ onEnter }: LandingHeroProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-radial from-slate-950/20 via-black/60 to-[#000005]/95 backdrop-blur-[2px] select-none">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center max-w-3xl px-6 flex flex-col items-center"
      >
        {/* Subtle Sci-Fi Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Interactive 3D Planetarium</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-[0.18em] uppercase leading-none mb-6">
          THE UNIVERSE <br />
          <span className="font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_35px_rgba(34,211,238,0.3)]">
            IS WAITING
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 text-lg md:text-xl font-light tracking-wide max-w-lg mx-auto mb-10">
          Explore the galaxy in procedural 3D.
        </p>

        {/* Enter Exploration Button */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 35px rgba(34, 211, 238, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="group relative px-9 py-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-400/40 hover:border-cyan-400 transition-all duration-300 rounded-full font-mono text-sm tracking-[0.25em] uppercase flex items-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
          <span>ENTER EXPLORATION</span>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Feature Hint Footer */}
        <div className="mt-16 flex items-center gap-8 text-[11px] font-mono text-white/40 uppercase tracking-widest">
          <span>80,000+ Stars</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Solar System & Orbits</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Volumetric Nebulae</span>
        </div>
      </motion.div>
    </div>
  );
}
