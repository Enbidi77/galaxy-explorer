'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// Dynamic import for the 3D scene to prevent SSR issues with WebGL
const GalaxyScene = dynamic(() => import('./GalaxyScene'), { ssr: false });

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
      <div className="text-center p-8 bg-red-900/30 rounded-lg border border-red-500/50">
        <h2 className="text-xl font-bold mb-2 text-red-400">WebGL Render Error</h2>
        <p className="text-sm opacity-80">{error.message}</p>
      </div>
    </div>
  );
}

interface GalaxyCanvasProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function GalaxyCanvas({ performanceMode = 'medium' }: GalaxyCanvasProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden select-none">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 10000, position: [0, 100, 200] }}
          gl={{
            antialias: performanceMode !== 'low',
            toneMapping: 1, // THREE.NoToneMapping
            powerPreference: 'high-performance',
            alpha: false,
          }}
          dpr={performanceMode === 'high' ? [1, 2] : 1}
        >
          <Suspense fallback={null}>
            <GalaxyScene performanceMode={performanceMode} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
