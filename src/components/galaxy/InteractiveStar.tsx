'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useGalaxyStore } from '@/stores/galaxyStore';
import { SpecialStar } from '@/types/galaxy';

interface InteractiveStarProps {
  star: SpecialStar;
}

export default function InteractiveStar({ star }: InteractiveStarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedObjectId, setSelectedObject } = useGalaxyStore();

  const isSelected = selectedObjectId === star.id;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      const pulse = Math.sin(time * 3 + star.position[0]) * 0.1 + 1.0;
      const targetScale = hovered ? 1.5 * pulse : 1.0 * pulse;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (glowRef.current) {
      const pulse = Math.sin(time * 2) * 0.2 + 1.2;
      const targetOpacity = hovered ? 0.8 : 0.5;
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, targetOpacity * pulse, 0.1);
    }
  });

  return (
    <group position={star.position as [number, number, number]}>
      <Sphere
        ref={meshRef}
        args={[star.size, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedObject(star.id);
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
        <meshStandardMaterial 
          color={star.color} 
          emissive={star.color}
          emissiveIntensity={hovered ? 2 : 1}
        />
      </Sphere>

      <sprite ref={glowRef} scale={[star.size * 5, star.size * 5, 1]}>
        <spriteMaterial 
          color={star.color} 
          transparent={true} 
          opacity={0.5} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={createGlowTexture()}
        />
      </sprite>

      {isSelected && (
        <Torus args={[star.size * 2, star.size * 0.1, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </Torus>
      )}

      {(hovered || isSelected) && (
        <Html distanceFactor={100} center position={[0, star.size * 2, 0]}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-white/20 select-none pointer-events-none">
            {star.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function createGlowTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
}
