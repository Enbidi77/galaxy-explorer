'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { loadPlanetTexture } from './planet-materials';

interface PlanetNightLightsProps {
  radius: number;
  nightMapUrl: string;
  sunPosition?: [number, number, number];
  segments?: number;
}

const nightLightsVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const nightLightsFragmentShader = /* glsl */ `
uniform sampler2D uNightMap;
uniform vec3 uSunPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 L = normalize(uSunPosition - vWorldPosition);
  vec3 N = normalize(vNormal);

  float NdotL = dot(N, L);
  // Terminator blend: night lights appear as sun dips below horizon
  float nightTerminator = smoothstep(0.1, -0.15, NdotL);

  vec3 lights = texture2D(uNightMap, vUv).rgb;
  vec3 color = lights * nightTerminator * 1.5;

  gl_FragColor = vec4(color, nightTerminator);
}
`;

export default function PlanetNightLights({
  radius,
  nightMapUrl,
  sunPosition = [0, 0, 0],
  segments = 64,
}: PlanetNightLightsProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const nightTexture = useMemo(() => {
    return loadPlanetTexture(nightMapUrl, true);
  }, [nightMapUrl]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: nightLightsVertexShader,
      fragmentShader: nightLightsFragmentShader,
      uniforms: {
        uNightMap: { value: nightTexture },
        uSunPosition: { value: new THREE.Vector3(...sunPosition) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [nightTexture, sunPosition]);

  useFrame(() => {
    if (material) {
      material.uniforms.uSunPosition.value.set(...sunPosition);
    }
  });

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh ref={meshRef} scale={1.002}>
      <sphereGeometry args={[radius, segments, segments]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
