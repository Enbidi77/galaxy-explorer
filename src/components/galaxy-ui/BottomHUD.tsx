'use client';

import React from 'react';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { formatDistance, formatRA, formatDEC } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

export default function BottomHUD() {
  const { celestialObjects, selectedObjectId, filteredObjects } = useGalaxyStore();
  const { isUIVisible } = useUIStore();

  if (!isUIVisible) return null;

  const selectedObj = celestialObjects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 z-30 flex items-center justify-between px-6 py-2">
      <div className="flex gap-6 text-xs font-mono text-white/60">
        <div>
          <span className="text-cyan-500/70 mr-2">OBJECTS</span>
          <span className="text-white">{celestialObjects.length}</span>
        </div>
        <div className="hidden md:block">
          <span className="text-cyan-500/70 mr-2">VISIBLE</span>
          <span className="text-white">{filteredObjects.length}</span>
        </div>
      </div>

      {selectedObj && (
        <div className="flex gap-6 text-xs font-mono text-white/60">
          {selectedObj.distance !== undefined && (
            <div className="hidden md:block">
              <span className="text-cyan-500/70 mr-2">DIST</span>
              <span className="text-white">{formatDistance(selectedObj.distance)}</span>
            </div>
          )}
          {selectedObj.position && (
            <div className="flex gap-4">
              <div>
                <span className="text-cyan-500/70 mr-2">RA</span>
                <span className="text-white">{formatRA(selectedObj.position[0], selectedObj.position[2])}</span>
              </div>
              <div>
                <span className="text-cyan-500/70 mr-2">DEC</span>
                <span className="text-white">{formatDEC(selectedObj.position[1])}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
