'use client';

import React, { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { atmosphereVertexShader, atmosphereFragmentShader } from '@/lib/planet-shaders/atmosphere.glsl';

interface PlanetAtmosphereProps {
  radius: number;
  color?: string;
  density?: number;
  scatteringStrength?: number;
  sunPosition?: [number, number, number];
  segments?: number;
}

export default function PlanetAtmosphere({
  radius,
  color = '#4fa8ff',
  density = 1.0,
  scatteringStrength = 2.8,
  sunPosition = [0, 0, 0],
  segments = 64,
}: PlanetAtmosphereProps) {
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uSunPosition: { value: new THREE.Vector3(...sunPosition) },
        uDensity: { value: density },
        uPower: { value: scatteringStrength },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide, // BackSide creates the smooth limb atmosphere outside the planet sphere
      depthWrite: false,
    });
  }, [color, density, scatteringStrength, sunPosition]);

  useFrame(() => {
    if (atmosphereMaterial) {
      atmosphereMaterial.uniforms.uSunPosition.value.set(...sunPosition);
    }
  });

  useEffect(() => {
    return () => {
      atmosphereMaterial.dispose();
    };
  }, [atmosphereMaterial]);

  return (
    <mesh scale={1.035}>
      <sphereGeometry args={[radius, segments, segments]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}
