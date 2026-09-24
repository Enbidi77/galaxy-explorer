'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { loadPlanetTexture, createProceduralSaturnRings } from './planet-materials';
import { ringVertexShader, ringFragmentShader } from '@/lib/planet-shaders/ring.glsl';

interface PlanetRingsProps {
  innerRadius: number;
  outerRadius: number;
  planetRadius: number;
  textureUrl?: string;
  sunPosition?: [number, number, number];
  planetPosition?: [number, number, number];
}

export default function PlanetRings({
  innerRadius,
  outerRadius,
  planetRadius,
  textureUrl = '/textures/planets/saturn-rings.png',
  sunPosition = [0, 0, 0],
  planetPosition = [0, 0, 0],
}: PlanetRingsProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const ringTexture = useMemo(() => {
    return loadPlanetTexture(textureUrl, true, undefined, () => createProceduralSaturnRings());
  }, [textureUrl]);

  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: ringVertexShader,
      fragmentShader: ringFragmentShader,
      uniforms: {
        uRingTexture: { value: ringTexture },
        uSunPosition: { value: new THREE.Vector3(...sunPosition) },
        uPlanetPosition: { value: new THREE.Vector3(...planetPosition) },
        uPlanetRadius: { value: planetRadius },
        uInnerRadius: { value: innerRadius },
        uOuterRadius: { value: outerRadius },
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
  }, [ringTexture, sunPosition, planetPosition, planetRadius, innerRadius, outerRadius]);

  useFrame(() => {
    if (ringMaterial && meshRef.current) {
      ringMaterial.uniforms.uSunPosition.value.set(...sunPosition);
      // Get world position of planet for accurate real-time shadow projection
      const worldPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPos);
      ringMaterial.uniforms.uPlanetPosition.value.copy(worldPos);
    }
  });

  useEffect(() => {
    return () => {
      ringMaterial.dispose();
    };
  }, [ringMaterial]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 128]} />
      <primitive object={ringMaterial} attach="material" />
    </mesh>
  );
}
