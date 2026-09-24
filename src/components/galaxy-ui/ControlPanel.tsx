'use client';

import React from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { useUIStore } from '@/stores/ui-store';
import { Settings, X, Sliders, Eye, Zap, Palette, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PerformanceMode, ThemeMode } from '@/types/astronomy';

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-1.5 select-none group">
      <span className="text-xs text-white/80 group-hover:text-white transition-colors">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`block w-9 h-5 rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-white/20'}`} />
        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
    </label>
  );
}

function Slider({ value, min, max, step, onChange, label }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="py-1.5 flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-white/70">{label}</span>
        <span className="font-mono text-cyan-400 text-[11px]">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/20 accent-cyan-400 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

export default function ControlPanel() {
  const {
    visualizationSettings,
    setVisualizationSettings,
    cameraSettings,
    setCameraSettings,
    animationSettings,
    setAnimationSettings,
    performanceMode,
    setPerformanceMode,
    theme,
    setTheme
  } = useSettingsStore();

  const { isSettingsOpen, setIsSettingsOpen, isMobile } = useUIStore();

  const updateVis = (key: keyof typeof visualizationSettings, value: unknown) => {
    setVisualizationSettings({ [key]: value });
  };

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={isMobile ? { opacity: 0, y: 300 } : { opacity: 0, x: -320 }}
        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
        exit={isMobile ? { opacity: 0, y: 300 } : { opacity: 0, x: -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed z-40 bg-slate-950/85 backdrop-blur-xl border-white/10 flex flex-col ${
          isMobile
            ? 'bottom-0 left-0 right-0 max-h-[75vh] border-t rounded-t-2xl p-6 overflow-y-auto'
            : 'left-4 top-20 bottom-14 w-84 rounded-2xl border shadow-2xl p-6 overflow-y-auto'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-white">
            <Settings className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-light tracking-widest uppercase">Controls</h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Performance Mode */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono tracking-wider uppercase mb-2.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Performance Profile</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['auto', 'high', 'balanced', 'low'] as PerformanceMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPerformanceMode(mode)}
                  className={`py-1.5 text-[10px] font-mono rounded transition-colors uppercase tracking-wider ${
                    performanceMode === mode
                      ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Visualization Toggles */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono tracking-wider uppercase mb-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Visualization Layers</span>
            </div>
            <div className="space-y-0.5 border-t border-white/5 pt-1">
              <Switch checked={visualizationSettings.showStarField} onChange={(v) => updateVis('showStarField', v)} label="Star Field (Points)" />
              <Switch checked={visualizationSettings.showNebula} onChange={(v) => updateVis('showNebula', v)} label="Nebulae (Volumetric)" />
              <Switch checked={visualizationSettings.showGalaxyArms} onChange={(v) => updateVis('showGalaxyArms', v)} label="Spiral Arms" />
              <Switch checked={visualizationSettings.showLabels} onChange={(v) => updateVis('showLabels', v)} label="Celestial Labels" />
              <Switch checked={visualizationSettings.showOrbits} onChange={(v) => updateVis('showOrbits', v)} label="Planetary Orbits" />
              <Switch checked={visualizationSettings.showGrid} onChange={(v) => updateVis('showGrid', v)} label="Distance Grid" />
            </div>
          </div>

          {/* Rendering Sliders */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono tracking-wider uppercase mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Optical Rendering</span>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-1">
              <Slider value={visualizationSettings.bloomIntensity} min={0} max={2.5} step={0.1} onChange={(v) => updateVis('bloomIntensity', v)} label="Bloom Intensity" />
              <Slider value={visualizationSettings.exposure} min={0.2} max={3.0} step={0.1} onChange={(v) => updateVis('exposure', v)} label="Exposure" />
              <Slider value={visualizationSettings.particleDensity} min={0.2} max={2.0} step={0.1} onChange={(v) => updateVis('particleDensity', v)} label="Particle Density" />
            </div>
          </div>

          {/* Camera Controls */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono tracking-wider uppercase mb-2">
              <Video className="w-3.5 h-3.5" />
              <span>Camera Dynamics</span>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-1">
              <Slider value={cameraSettings.sensitivity} min={0.2} max={2.0} step={0.1} onChange={(v) => setCameraSettings({ sensitivity: v })} label="Sensitivity" />
              <Slider value={cameraSettings.smoothness} min={0.01} max={0.2} step={0.01} onChange={(v) => setCameraSettings({ smoothness: v })} label="Damping Smoothness" />
            </div>
          </div>

          {/* Animation Time Speed */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono tracking-wider uppercase mb-2.5">
              <span>Orbital Speed</span>
            </div>
            <div className="flex gap-1.5">
              {[0.5, 1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAnimationSettings({ speed })}
                  className={`flex-1 py-1.5 text-xs font-mono rounded transition-colors ${
                    animationSettings.speed === speed
                      ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono tracking-wider uppercase mb-2.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Interface Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['deep-space', 'scientific'] as ThemeMode[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`py-1.5 px-3 text-xs font-mono rounded transition-colors capitalize ${
                    theme === t
                      ? 'bg-white/20 text-white border border-cyan-400 font-medium'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
