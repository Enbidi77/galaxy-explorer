'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Nebula() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const nebulaColors = [
      new THREE.Color('#4c1d95'), // Purple
      new THREE.Color('#1e3a8a'), // Blue
      new THREE.Color('#be185d'), // Pink
      new THREE.Color('#0891b2'), // Cyan
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Gaussian-like distribution
      const r = (Math.random() + Math.random() + Math.random() - 1.5) * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 0.3; // Flatter disk
      
      pos[i3] = r * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi);
      pos[i3 + 2] = r * Math.sin(theta);

      const baseColor = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      col[i3] = baseColor.r;
      col[i3 + 1] = baseColor.g;
      col[i3 + 2] = baseColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={150}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.04}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        map={createParticleTexture()}
      />
    </points>
  );
}

// Simple soft particle texture generator
function createParticleTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
}
