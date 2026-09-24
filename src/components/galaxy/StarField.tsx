'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateGalaxy } from '@/lib/galaxy/generator';
import { useSettingsStore } from '@/stores/settingsStore';

const vertexShader = `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aOffset;
varying vec3 vColor;
varying float vBrightness;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float twinkle = sin(uTime * 2.0 + aOffset * 6.28) * 0.3 + 0.7;
  gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z) * twinkle;
  gl_Position = projectionMatrix * mvPosition;
  vColor = color;
  vBrightness = twinkle;
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vBrightness;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.2, 0.5, d);
  gl_FragColor = vec4(vColor * vBrightness * 1.2, alpha);
}
`;

interface StarFieldProps {
  performanceMode?: 'low' | 'medium' | 'high';
}

export default function StarField({ performanceMode = 'medium' }: StarFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const particleCount = useMemo(() => {
    switch (performanceMode) {
      case 'low': return 10000;
      case 'high': return 100000;
      default: return 40000;
    }
  }, [performanceMode]);

  const { positions, colors, sizes, offsets } = useMemo(() => {
    return generateGalaxy(particleCount);
  }, [particleCount]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points frustumCulled={true}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={offsets.length}
          array={offsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
        }}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
      />
    </points>
  );
}
