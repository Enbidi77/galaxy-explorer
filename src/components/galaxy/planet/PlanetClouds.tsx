'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { loadPlanetTexture } from './planet-materials';
import { cloudVertexShader, cloudFragmentShader } from '@/lib/planet-shaders/cloud-layer.glsl';

interface PlanetCloudsProps {
  radius: number;
  cloudsMapUrl: string;
  rotationSpeed?: number;
  opacity?: number;
  sunPosition?: [number, number, number];
  segments?: number;
}

export default function PlanetClouds({
  radius,
  cloudsMapUrl,
  rotationSpeed = 0.55,
  opacity = 0.85,
  sunPosition = [0, 0, 0],
  segments = 64,
}: PlanetCloudsProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const cloudTexture = useMemo(() => {
    return loadPlanetTexture(cloudsMapUrl, false);
  }, [cloudsMapUrl]);

  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      uniforms: {
        uCloudMap: { value: cloudTexture },
        uSunPosition: { value: new THREE.Vector3(...sunPosition) },
        uOpacity: { value: opacity },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, [cloudTexture, opacity, sunPosition]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta * 0.05;
    }
    if (cloudMaterial) {
      cloudMaterial.uniforms.uSunPosition.value.set(...sunPosition);
    }
  });

  useEffect(() => {
    return () => {
      cloudMaterial.dispose();
    };
  }, [cloudMaterial]);

  return (
    <mesh ref={meshRef} scale={1.012}>
      <sphereGeometry args={[radius, segments, segments]} />
      <primitive object={cloudMaterial} attach="material" />
    </mesh>
  );
}
