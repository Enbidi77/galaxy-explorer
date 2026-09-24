'use client';

import React, { useMemo } from 'react';
import { useGalaxyStore } from '../../stores/galaxy-store';
import { useSettingsStore } from '../../stores/settings-store';
import { systemsRecord } from '../../lib/galaxy/systems';
import StarField from './StarField';
import Nebula from './Nebula';
import InteractiveStar from './InteractiveStar';
import CameraController from './CameraController';
import PlanetSystem from './PlanetSystem';
import PostProcessing from './PostProcessing';
import BackgroundStars from './BackgroundStars';
import DistanceGrid from './DistanceGrid';

interface GalaxySceneProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function GalaxyScene({ performanceMode = 'medium' }: GalaxySceneProps) {
  const celestialObjects = useGalaxyStore((s) => s.celestialObjects);
  const focusedObjectId = useGalaxyStore((s) => s.focusedObjectId);
  const viewLevel = useGalaxyStore((s) => s.viewLevel);
  const visualizationSettings = useSettingsStore((s) => s.visualizationSettings);

  const { showNebula, showGrid, showLabels, bloomIntensity } = visualizationSettings;

  const interactiveObjects = useMemo(
    () =>
      celestialObjects.filter(
        (obj) => obj.type === 'star' || obj.type === 'black-hole' || obj.type === 'galaxy'
      ),
    [celestialObjects]
  );

  const focusedSystem = focusedObjectId ? systemsRecord[focusedObjectId] : null;

  return (
    <>
      <color attach="background" args={['#000005']} />
      <ambientLight intensity={0.08} />

      <CameraController />

      {/* Galaxy view */}
      {viewLevel === 'galaxy' && (
        <group>
          <StarField performanceMode={performanceMode} />
          {showNebula && <Nebula />}
          {interactiveObjects.map((obj) => (
            <InteractiveStar key={obj.id} object={obj} showLabel={showLabels} />
          ))}
          {showGrid && <DistanceGrid />}
        </group>
      )}

      {/* System view */}
      {viewLevel === 'system' && focusedSystem && (
        <PlanetSystem system={focusedSystem} />
      )}

      {/* Always visible */}
      <BackgroundStars />

      {/* Post-processing */}
      {bloomIntensity > 0 && (
        <PostProcessing performanceMode={performanceMode} />
      )}
    </>
  );
}
