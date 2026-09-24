'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useSettingsStore } from '@/stores/settingsStore';

interface PostProcessingProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function PostProcessing({ performanceMode = 'medium' }: PostProcessingProps) {
  const { bloomIntensity } = useSettingsStore();

  if (performanceMode === 'low') {
    return null;
  }

  return (
    <EffectComposer multisampling={performanceMode === 'high' ? 8 : 4}>
      <Bloom 
        intensity={bloomIntensity} 
        luminanceThreshold={0.6} 
        luminanceSmoothing={0.9} 
        mipmapBlur={performanceMode === 'high'} 
      />
      <Vignette eskil={false} offset={0.3} darkness={0.7} />
    </EffectComposer>
  );
}
