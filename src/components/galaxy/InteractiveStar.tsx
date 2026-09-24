'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialObject } from '../../types/astronomy';
import { useGalaxyStore } from '../../stores/galaxy-store';
import { formatDistance } from '../../lib/utils';

interface InteractiveStarProps {
  object: CelestialObject;
  showLabel?: boolean;
}

export default function InteractiveStar({ object, showLabel = true }: InteractiveStarProps) {
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
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      const pulse = Math.sin(t * 2 + object.position[0]) * 0.08 + 1.0;
      const scale = (hovered ? 1.4 : 1.0) * pulse;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (glowRef.current) {
      const pulse = Math.sin(t * 1.5) * 0.15 + 1.0;
      const targetOpacity = hovered ? 0.7 : isSelected ? 0.6 : 0.4;
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity,
        targetOpacity * pulse,
        0.1
      );
    }
  });

  const starColor = object.color || '#ffcc00';

  return (
    <group position={object.position}>
      {/* Star mesh */}
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
        <sphereGeometry args={[object.size, 32, 32]} />
        <meshStandardMaterial
          color={starColor}
          emissive={starColor}
          emissiveIntensity={hovered ? 2.5 : 1.5}
        />
      </mesh>

      {/* Glow sprite */}
      {glowTexture && (
        <sprite
          ref={glowRef}
          scale={[object.size * 5, object.size * 5, 1]}
        >
          <spriteMaterial
            map={glowTexture}
            color={starColor}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[object.size * 2.2, object.size * 0.08, 16, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Label */}
      {(showLabel || hovered || isSelected) && (hovered || isSelected) && (
        <Html
          distanceFactor={100}
          center
          position={[0, object.size * 2.5, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded text-xs whitespace-nowrap border border-white/20 select-none">
            <div className="font-medium">{object.name}</div>
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
