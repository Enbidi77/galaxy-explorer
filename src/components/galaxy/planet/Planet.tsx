'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetDefinition } from './planet-data';
import PlanetSurface from './PlanetSurface';
import PlanetAtmosphere from './PlanetAtmosphere';
import PlanetClouds from './PlanetClouds';
import PlanetRings from './PlanetRings';

export interface PlanetProps {
  planet: PlanetDefinition;
  radius?: number;
  rotationSpeed?: number;
  showAtmosphere?: boolean;
  showClouds?: boolean;
  showNightLights?: boolean;
  sunPosition?: [number, number, number];
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  isSelected?: boolean;
  onClick?: () => void;
}

export default function Planet({
  planet,
  radius = planet.radius,
  rotationSpeed = planet.rotationSpeed,
  showAtmosphere = true,
  showClouds = true,
  sunPosition = [0, 0, 0],
  quality = 'high',
  isSelected = false,
  onClick,
}: PlanetProps) {
  const tiltGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);

  // Dynamic LOD segments based on quality and distance
  const segments = useMemo(() => {
    switch (quality) {
      case 'low':
        return 32;
      case 'medium':
        return 64;
      case 'ultra':
        return 160;
      case 'high':
      default:
        return 96;
    }
  }, [quality]);

  // Axial tilt in radians
  const axialTiltRad = useMemo(() => {
    return (planet.axialTilt * Math.PI) / 180;
  }, [planet.axialTilt]);

  // Planet axial spin in useFrame (pure, no React state re-renders)
  useFrame((_, delta) => {
    if (spinGroupRef.current) {
      spinGroupRef.current.rotation.y += rotationSpeed * delta * 0.1;
    }
  });

  return (
    <group
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer Axial Tilt Group */}
      <group ref={tiltGroupRef} rotation={[0, 0, axialTiltRad]}>
        {/* Inner Spin Group */}
        <group ref={spinGroupRef}>
          {/* Surface */}
          <PlanetSurface
            planet={planet}
            radius={radius}
            segments={segments}
            sunPosition={sunPosition}
          />

          {/* Cloud Layer (e.g. Earth) */}
          {planet.clouds?.enabled && showClouds && quality !== 'low' && planet.textures.cloudsMap && (
            <PlanetClouds
              radius={radius}
              cloudsMapUrl={planet.textures.cloudsMap}
              rotationSpeed={planet.clouds.rotationSpeed}
              opacity={planet.clouds.opacity}
              sunPosition={sunPosition}
              segments={segments}
            />
          )}

          {/* Planetary Rings (e.g. Saturn) */}
          {planet.rings?.enabled && (
            <PlanetRings
              innerRadius={planet.rings.innerRadius}
              outerRadius={planet.rings.outerRadius}
              planetRadius={radius}
              textureUrl={planet.rings.texture}
              sunPosition={sunPosition}
            />
          )}
        </group>

        {/* Atmosphere Shell (Outside spin group to maintain optical rim orientation) */}
        {planet.atmosphere?.enabled && showAtmosphere && quality !== 'low' && (
          <PlanetAtmosphere
            radius={radius}
            color={planet.atmosphere.color}
            density={planet.atmosphere.density}
            scatteringStrength={planet.atmosphere.scatteringStrength}
            sunPosition={sunPosition}
            segments={segments}
          />
        )}
      </group>

      {/* Selection Target Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 1.45, 64]} />
          <meshBasicMaterial
            color="#22d3ee"
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </group>
  );
}
