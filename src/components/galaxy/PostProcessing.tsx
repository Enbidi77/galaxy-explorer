'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useSettingsStore } from '../../stores/settings-store';

interface PostProcessingProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function PostProcessing({ performanceMode = 'medium' }: PostProcessingProps) {
  const bloomIntensity = useSettingsStore((s) => s.visualizationSettings.bloomIntensity);

  if (performanceMode === 'low' || bloomIntensity <= 0) {
    return null;
  }

  return (
    <EffectComposer multisampling={performanceMode === 'high' ? 8 : 0}>
      <Bloom
        intensity={bloomIntensity * 0.7}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.3}
        mipmapBlur={performanceMode === 'high'}
      />
      <Vignette offset={0.28} darkness={0.7} />
    </EffectComposer>
  );
}
