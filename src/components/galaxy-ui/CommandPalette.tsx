'use client';

import React, { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useCameraStore } from '@/stores/camera-store';
import { Command } from 'cmdk';
import { motion } from 'framer-motion';
import {
  Search,
  RotateCcw,
  Target,
  Tag,
  Orbit,
  Cloud,
  Film,
  Maximize,
  Settings,
  X
} from 'lucide-react';

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsSearchOpen,
    setIsSettingsOpen,
    setIsFullscreen
  } = useUIStore();

  const {
    isCinematicMode,
    setCinematicMode,
    selectedObjectId,
    focusObject
  } = useGalaxyStore();

  const { visualizationSettings, setVisualizationSettings } = useSettingsStore();
  const { setCameraMode, setTargetPosition } = useCameraStore();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-md px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        className="w-full max-w-lg bg-slate-950/90 border border-cyan-500/25 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden backdrop-blur-xl"
      >
        <Command label="Command Palette" className="w-full flex flex-col bg-transparent">
          <div className="flex items-center px-4 py-3 border-b border-white/10">
            <Search className="w-4 h-4 text-cyan-400 mr-3" />
            <Command.Input
              value={inputValue}
              onValueChange={setInputValue}
              placeholder="Type a cosmic command or action..."
              className="w-full bg-transparent border-none text-white outline-none placeholder-white/30 text-sm font-light"
              autoFocus
            />
            <button
              onClick={() => setIsCommandPaletteOpen(false)}
              className="p-1 rounded text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-xs font-mono text-white/40">
              No matching commands.
            </Command.Empty>

            <Command.Group heading="Navigation & Search" className="text-[10px] font-mono tracking-wider text-cyan-500/70 px-3 py-1 uppercase">
              <Command.Item
                onSelect={() => {
                  setIsCommandPaletteOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Search Celestial Objects</span>
                </div>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">Ctrl K</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setCameraMode('free');
                  setTargetPosition(null);
                  focusObject(null);
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Reset Camera to Galaxy Vista</span>
                </div>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">R</kbd>
              </Command.Item>

              {selectedObjectId && (
                <Command.Item
                  onSelect={() => {
                    focusObject(selectedObjectId);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
                >
                  <div className="flex items-center gap-2.5">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>Focus Selected Celestial Object</span>
                  </div>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">F</kbd>
                </Command.Item>
              )}
            </Command.Group>

            <Command.Group heading="Visualization Controls" className="text-[10px] font-mono tracking-wider text-cyan-500/70 px-3 py-1 uppercase mt-2">
              <Command.Item
                onSelect={() => {
                  setVisualizationSettings({ showLabels: !visualizationSettings.showLabels });
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-blue-400" />
                  <span>Toggle Celestial Labels</span>
                </div>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">L</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setVisualizationSettings({ showOrbits: !visualizationSettings.showOrbits });
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Orbit className="w-4 h-4 text-cyan-400" />
                  <span>Toggle Orbital Trajectories</span>
                </div>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">O</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setVisualizationSettings({ showNebula: !visualizationSettings.showNebula });
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Cloud className="w-4 h-4 text-purple-400" />
                  <span>Toggle Volumetric Nebulae</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setCinematicMode(!isCinematicMode);
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-pink-400" />
                  <span>Toggle Cinematic Tour</span>
                </div>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">C</kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Interface & System" className="text-[10px] font-mono tracking-wider text-cyan-500/70 px-3 py-1 uppercase mt-2">
              <Command.Item
                onSelect={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                  } else {
                    document.exitFullscreen();
                    setIsFullscreen(false);
                  }
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Maximize className="w-4 h-4 text-white/70" />
                  <span>Toggle Fullscreen Mode</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setIsSettingsOpen(true);
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg cursor-pointer aria-selected:bg-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-white/70" />
                  <span>Open Control Panel</span>
                </div>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </motion.div>
    </div>
  );
}
