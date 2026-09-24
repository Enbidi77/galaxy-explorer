'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { useUIStore } from '@/stores/ui-store';
import { Search, Star, Globe, Cloud, Circle, X, CornerDownLeft } from 'lucide-react';
import { formatDistance } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function GalaxySearch() {
  const {
    celestialObjects,
    selectObject,
    focusObject,
    setViewLevel,
    setSearchQuery,
    searchQuery
  } = useGalaxyStore();
  const { isSearchOpen, setIsSearchOpen, setIsInfoPanelOpen } = useUIStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = celestialObjects.filter((obj) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      obj.name.toLowerCase().includes(q) ||
      obj.type.toLowerCase().includes(q) ||
      (obj.description && obj.description.toLowerCase().includes(q))
    );
  });

  const handleSelect = (id: string) => {
    selectObject(id);
    focusObject(id);
    const targetObj = celestialObjects.find((o) => o.id === id);
    if (targetObj && (targetObj.type === 'planet' || targetObj.type === 'moon')) {
      setViewLevel('system');
    }
    setIsSearchOpen(false);
    setIsInfoPanelOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].id);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'star':
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'planet':
      case 'moon':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'nebula':
        return <Cloud className="w-4 h-4 text-purple-400" />;
      case 'black-hole':
        return <Circle className="w-4 h-4 text-pink-400 fill-pink-400/20" />;
      case 'galaxy':
        return <Circle className="w-4 h-4 text-blue-300" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/60 backdrop-blur-md px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        className="w-full max-w-xl bg-slate-950/90 border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-2xl overflow-hidden backdrop-blur-xl"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-white/10">
          <Search className="w-4 h-4 text-cyan-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-light"
            placeholder="Search celestial bodies, stars, planets... (use ↑↓ and Enter)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-white/40 hover:text-white mr-2 text-xs font-mono"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-white/40 text-xs font-mono">
              No celestial bodies found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest">
                Celestial Results ({filtered.length})
              </div>
              {filtered.map((obj, idx) => {
                const isFocused = idx === selectedIndex;
                return (
                  <button
                    key={obj.id}
                    onClick={() => handleSelect(obj.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors text-left group ${
                      isFocused
                        ? 'bg-cyan-950/60 border border-cyan-500/40 text-white'
                        : 'hover:bg-white/5 border border-transparent text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                        {getIcon(obj.type)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white flex items-center gap-2">
                          <span>{obj.name}</span>
                          {obj.spectralClass && (
                            <span className="text-[10px] font-mono text-indigo-300 px-1 py-0.2 rounded bg-indigo-950/50 border border-indigo-500/20">
                              {obj.spectralClass}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-white/40 capitalize font-mono">
                          {obj.type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-cyan-400/80">
                        {obj.distance !== undefined ? formatDistance(obj.distance) : ''}
                      </span>
                      {isFocused && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
