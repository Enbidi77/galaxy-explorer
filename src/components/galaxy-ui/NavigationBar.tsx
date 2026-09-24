'use client';

import React from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useSettingsStore } from '@/stores/settings-store';
import { Search, Settings, Maximize, Minimize, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { spaceSound } from '@/lib/sound';

export default function NavigationBar() {
  const {
    setIsSearchOpen,
    setIsSettingsOpen,
    isUIVisible,
    toggleUI,
    isFullscreen,
    setIsFullscreen
  } = useUIStore();
  
  const { soundEnabled, setSoundEnabled } = useSettingsStore();

  React.useEffect(() => {
    if (soundEnabled) {
      spaceSound.play();
    } else {
      spaceSound.stop();
    }
  }, [soundEnabled]);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  if (!isUIVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleUI}
          className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-full text-white/70 hover:text-white transition-colors"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md border-b border-white/10 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          <span className="text-white font-bold text-xs">GE</span>
        </div>
        <h1 className="text-white font-light tracking-[0.2em] text-sm hidden sm:block">GALAXY EXPLORER</h1>
      </div>

      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-white/50 hover:text-white/80 transition-colors max-w-md w-full mx-4"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm font-light">Search systems, stars, planets... (Ctrl+K)</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={handleFullscreenToggle}
          className="p-2 text-white/50 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 text-white/50 hover:text-white transition-colors"
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-white/50 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={toggleUI}
          className="p-2 text-white/50 hover:text-white transition-colors ml-2 border-l border-white/10 pl-4"
          title="Hide UI"
        >
          <EyeOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
