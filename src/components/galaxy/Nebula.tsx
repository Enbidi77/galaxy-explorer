'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateNebulaData() {
  const count = 600;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const rand = seededRandom(42);

  const nebulaColors = [
    new THREE.Color('#4c1d95'), // Purple
    new THREE.Color('#1e3a8a'), // Blue
    new THREE.Color('#be185d'), // Pink
    new THREE.Color('#0891b2'), // Cyan
  ];

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = (rand() + rand() + rand() - 1.5) * 200;
    const theta = rand() * Math.PI * 2;
    const phi = (rand() - 0.5) * 0.3;

    pos[i3] = r * Math.cos(theta);
    pos[i3 + 1] = r * Math.sin(phi);
    pos[i3 + 2] = r * Math.sin(theta);

    const baseColor = nebulaColors[Math.floor(rand() * nebulaColors.length)];
    col[i3] = baseColor.r;
    col[i3 + 1] = baseColor.g;
    col[i3 + 2] = baseColor.b;
  }

  return { positions: pos, colors: col };
}

const STATIC_NEBULA_DATA = generateNebulaData();

// Soft particle texture generator
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

const PARTICLE_TEXTURE = typeof document !== 'undefined' ? createParticleTexture() : null;

export default function Nebula() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_NEBULA_DATA.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[STATIC_NEBULA_DATA.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={140}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.04}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        map={PARTICLE_TEXTURE || undefined}
      />
    </points>
  );
}
