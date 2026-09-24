'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateGalaxy } from '../../lib/galaxy/generator';

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aOffset;
varying vec3 vColor;
varying float vBrightness;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float twinkle = sin(uTime * 1.5 + aOffset * 6.28) * 0.25 + 0.75;
  gl_PointSize = max(aSize * uPixelRatio * (200.0 / -mvPosition.z) * twinkle, 0.5);
  gl_Position = projectionMatrix * mvPosition;
  vColor = color;
  vBrightness = twinkle;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vBrightness;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.1, 0.5, d);
  gl_FragColor = vec4(vColor * vBrightness * 1.3, alpha * 0.9);
}
`;

interface StarFieldProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function StarField({ performanceMode = 'medium' }: StarFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const config = useMemo(() => {
    let starCount = 40000;
    if (performanceMode === 'low') starCount = 12000;
    else if (performanceMode === 'high') starCount = 80000;

    return {
      starCount,
      spiralArms: 4,
      spiralTightness: 0.6,
      galaxyRadius: 200,
      coreRadius: 30,
      thickness: 12,
      armWidth: 8,
    };
  }, [performanceMode]);

  const galaxyData = useMemo(() => generateGalaxy(config), [config]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2),
      },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points frustumCulled>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[galaxyData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[galaxyData.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[galaxyData.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[galaxyData.offsets, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}
