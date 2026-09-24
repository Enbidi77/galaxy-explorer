'use client';

import React, { Component, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import GalaxyScene from './GalaxyScene';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WebGL Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-3 text-red-400">
              3D RENDERING ERROR
            </h2>
            <p className="text-sm text-white/60 mb-4">
              {this.state.error?.message || 'An error occurred while rendering the galaxy.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface GalaxyCanvasProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function GalaxyCanvas({ performanceMode = 'medium' }: GalaxyCanvasProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#000005]">
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: [0, 80, 180], fov: 60, near: 0.1, far: 10000 }}
          gl={{
            antialias: performanceMode !== 'low',
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          dpr={performanceMode === 'high' ? [1, 2] : [1, 1.5]}
        >
          <Suspense fallback={null}>
            <GalaxyScene performanceMode={performanceMode} />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
