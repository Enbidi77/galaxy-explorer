'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialObject } from '../../types/astronomy';
import { useGalaxyStore } from '../../stores/galaxy-store';
import { formatDistance } from '../../lib/utils';
import BlackHole from './BlackHole';

interface InteractiveStarProps {
  object: CelestialObject;
  showLabel?: boolean;
}

export default function InteractiveStar({ object, showLabel = true }: InteractiveStarProps) {
  if (object.type === 'black-hole') {
    return <BlackHole object={object} />;
  }

  return <StandardInteractiveStar object={object} showLabel={showLabel} />;
}

function StandardInteractiveStar({ object, showLabel = true }: InteractiveStarProps) {
  const selectObject = useGalaxyStore((s) => s.selectObject);
  const selectedObjectId = useGalaxyStore((s) => s.selectedObjectId);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);

  const isSelected = selectedObjectId === object.id;

  const glowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.25, 'rgba(255, 240, 200, 0.4)');
    gradient.addColorStop(0.7, 'rgba(255, 180, 50, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      const pulse = Math.sin(t * 1.5 + object.position[0]) * 0.04 + 1.0;
      const scale = (hovered ? 1.25 : 1.0) * pulse;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (glowRef.current) {
      const pulse = Math.sin(t * 1.2) * 0.08 + 1.0;
      const targetOpacity = hovered ? 0.35 : isSelected ? 0.3 : 0.18;
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity,
        targetOpacity * pulse,
        0.1
      );
    }
  });

  const starColor = object.color || '#ffcc00';
  // Controlled visual scale: prevent stars from clipping into giant flat discs
  const visualSize = Math.min(object.size, 16);

  return (
    <group position={object.position}>
      {/* Star Photosphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          selectObject(object.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[visualSize, 32, 32]} />
        <meshStandardMaterial
          color={starColor}
          emissive={starColor}
          emissiveIntensity={hovered ? 1.4 : 0.95}
          roughness={0.8}
        />
      </mesh>

      {/* Subtle Stellar Corona Halo (calibrated scale and low opacity) */}
      {glowTexture && (
        <sprite
          ref={glowRef}
          scale={[visualSize * 2.6, visualSize * 2.6, 1]}
        >
          <spriteMaterial
            map={glowTexture}
            color={starColor}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[visualSize * 1.6, visualSize * 0.04, 16, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Astrometric Label */}
      {(showLabel || hovered || isSelected) && (hovered || isSelected) && (
        <Html
          distanceFactor={90}
          center
          position={[0, visualSize * 1.8, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-slate-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-white/20 select-none shadow-xl font-mono">
            <div className="font-medium text-cyan-300">{object.name}</div>
            <div className="text-white/50 text-[10px] uppercase tracking-wider">
              {object.type}
              {object.distance !== undefined && ` · ${formatDistance(object.distance)}`}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
