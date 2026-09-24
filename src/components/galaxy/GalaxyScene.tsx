'use client';

import React, { useMemo } from 'react';
import { color } from 'three/examples/jsm/nodes/Nodes.js';
import StarField from './StarField';
import Nebula from './Nebula';
import InteractiveStar from './InteractiveStar';
import PlanetSystem from './PlanetSystem';
import CameraController from './CameraController';
import PostProcessing from './PostProcessing';
import BackgroundStars from './BackgroundStars';
import DistanceGrid from './DistanceGrid';
import { useSettingsStore } from '@/stores/settingsStore';
import { useGalaxyStore } from '@/stores/galaxyStore';

interface GalaxySceneProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function GalaxyScene({ performanceMode = 'medium' }: GalaxySceneProps) {
  const { viewLevel, showNebula, showGrid, postProcessingEnabled } = useSettingsStore();
  const { specialStars, selectedSystem } = useGalaxyStore();

  return (
    <>
      <color attach="background" args={['#000005']} />
      <ambientLight intensity={0.1} />
      
      <CameraController />

      {viewLevel === 'galaxy' && (
        <group>
          <StarField performanceMode={performanceMode} />
          {showNebula && <Nebula />}
          {specialStars?.map((star) => (
            <InteractiveStar key={star.id} star={star} />
          ))}
          {showGrid && <DistanceGrid />}
        </group>
      )}

      {viewLevel === 'system' && selectedSystem && (
        <PlanetSystem system={selectedSystem} />
      )}

      <BackgroundStars />

      {postProcessingEnabled && (
        <PostProcessing performanceMode={performanceMode} />
      )}
    </>
  );
}
