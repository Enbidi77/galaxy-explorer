'use client';

import React from 'react';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { useUIStore } from '@/stores/ui-store';
import { formatDistance, formatTemperature } from '@/lib/utils';
import { systemsRecord } from '@/lib/galaxy/systems';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Compass, ArrowLeft, Orbit } from 'lucide-react';

export default function ObjectInfoPanel() {
  const {
    selectedObjectId,
    celestialObjects,
    focusObject,
    viewLevel,
    setViewLevel,
    selectObject
  } = useGalaxyStore();
  
  const {
    isInfoPanelOpen,
    setIsInfoPanelOpen,
    setNavigationStatus,
    setNavigationTarget,
    isMobile
  } = useUIStore();

  const selectedObj = celestialObjects.find(obj => obj.id === selectedObjectId);

  if (!selectedObj || !isInfoPanelOpen) return null;

  const hasSystem = (selectedObj.type.includes('star') || selectedObj.id === 'sol') && systemsRecord[selectedObj.id];

  const handleFocus = () => {
    focusObject(selectedObj.id);
    setNavigationStatus('navigating');
    setNavigationTarget(selectedObj.name);
    setTimeout(() => {
      setNavigationStatus('arrived');
      setTimeout(() => setNavigationStatus('idle'), 2500);
    }, 2000);
  };

  const handleExploreSystem = () => {
    if (hasSystem) {
      focusObject(selectedObj.id);
      setViewLevel('system');
      setNavigationStatus('entering-system');
      setNavigationTarget(selectedObj.name);
      setTimeout(() => {
        setNavigationStatus('idle');
      }, 3000);
    }
  };

  const handleReturnToGalaxy = () => {
    setViewLevel('galaxy');
    focusObject(null);
    setNavigationStatus('returning');
    setTimeout(() => {
      setNavigationStatus('idle');
    }, 2500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={isMobile ? { opacity: 0, y: 300 } : { opacity: 0, x: 340 }}
        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
        exit={isMobile ? { opacity: 0, y: 300 } : { opacity: 0, x: 340 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed z-40 bg-slate-950/85 backdrop-blur-xl border-white/10 flex flex-col ${
          isMobile
            ? "bottom-0 left-0 right-0 max-h-[75vh] border-t rounded-t-2xl p-6"
            : "right-4 top-20 bottom-14 w-96 rounded-2xl border shadow-2xl p-6"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
                {selectedObj.type.replace('_', ' ')}
              </span>
              {Boolean(selectedObj.metadata?.realData) && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">
                  VERIFIED ASTRONOMY
                </span>
              )}
            </div>
            <h2 className="text-2xl font-light tracking-wide text-white">
              {selectedObj.name}
            </h2>
          </div>

          <button
            onClick={() => setIsInfoPanelOpen(false)}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System view breadcrumb banner */}
        {viewLevel === 'system' && (
          <div className="mb-4 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <Orbit className="w-4 h-4" />
              <span>Solar System View Active</span>
            </div>
            <button
              onClick={handleReturnToGalaxy}
              className="text-white/70 hover:text-white underline font-mono text-[10px]"
            >
              Exit to Galaxy
            </button>
          </div>
        )}

        {/* Description */}
        {selectedObj.description && (
          <p className="text-white/70 text-xs leading-relaxed mb-6 font-light">
            {selectedObj.description}
          </p>
        )}

        {/* Scientific Data Matrix */}
        <div className="space-y-3 mb-6 flex-1 overflow-y-auto pr-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Astrophysical Measurements
          </div>

          {selectedObj.distance !== undefined && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Distance from Earth</span>
              <span className="font-mono text-cyan-300">{formatDistance(selectedObj.distance)}</span>
            </div>
          )}

          {selectedObj.temperature !== undefined && selectedObj.temperature > 0 && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Surface Temperature</span>
              <span className="font-mono text-amber-300">{formatTemperature(selectedObj.temperature)}</span>
            </div>
          )}

          {selectedObj.mass !== undefined && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Solar Mass (M☉)</span>
              <span className="font-mono text-white/90">
                {selectedObj.mass >= 1000
                  ? `${(selectedObj.mass / 1000000).toFixed(2)}M M☉`
                  : selectedObj.mass >= 1
                  ? `${selectedObj.mass.toFixed(2)} M☉`
                  : `${(selectedObj.mass * 333000).toFixed(1)} Earths`}
              </span>
            </div>
          )}

          {selectedObj.magnitude !== undefined && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Apparent Magnitude</span>
              <span className="font-mono text-white/90">{selectedObj.magnitude}</span>
            </div>
          )}

          {selectedObj.spectralClass && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Spectral Classification</span>
              <span className="font-mono text-indigo-300">{selectedObj.spectralClass}</span>
            </div>
          )}

          {/* Planetary Orbital Metrics */}
          {selectedObj.orbitalRadius !== undefined && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Orbital Distance</span>
              <span className="font-mono text-blue-300">{(selectedObj.orbitalRadius / 20).toFixed(2)} AU</span>
            </div>
          )}

          {selectedObj.orbitalPeriod !== undefined && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Orbital Period</span>
              <span className="font-mono text-blue-300">{selectedObj.orbitalPeriod} Earth Years</span>
            </div>
          )}

          {selectedObj.rotationPeriod !== undefined && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Rotation Period</span>
              <span className="font-mono text-blue-300">{selectedObj.rotationPeriod} Earth Days</span>
            </div>
          )}

          {/* Parent star reference */}
          {selectedObj.parentId && (
            <div className="flex justify-between items-baseline border-b border-white/5 pb-1.5 text-xs">
              <span className="text-white/45">Parent Star</span>
              <button
                onClick={() => selectObject(selectedObj.parentId!)}
                className="font-mono text-cyan-400 hover:underline uppercase"
              >
                {selectedObj.parentId}
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-auto">
          <div className="flex gap-2">
            <button
              onClick={handleFocus}
              className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs font-mono tracking-wider border border-white/10"
            >
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              FOCUS TARGET
            </button>

            {hasSystem && viewLevel !== 'system' && (
              <button
                onClick={handleExploreSystem}
                className="flex-1 bg-cyan-600/30 hover:bg-cyan-600/50 active:bg-cyan-600/60 text-cyan-300 border border-cyan-500/40 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <Compass className="w-3.5 h-3.5" />
                EXPLORE SYSTEM
              </button>
            )}
          </div>

          {viewLevel === 'system' && (
            <button
              onClick={handleReturnToGalaxy}
              className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs font-mono tracking-wider border border-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              RETURN TO GALAXY
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
