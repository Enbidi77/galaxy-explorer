'use client';

import React from 'react';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function DistanceGrid() {
  const radii = [10, 100, 1000];
  const segments = 128;

  const circles = radii.map(radius => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return { radius, points };
  });

  return (
    <group>
      {circles.map(({ radius, points }) => (
        <group key={radius}>
          <Line
            points={points}
            color="#4a90e2"
            lineWidth={1}
            transparent
            opacity={0.1}
          />
          <Html position={[radius, 0, 0]} distanceFactor={100} center>
            <div className="text-[#4a90e2] text-[10px] opacity-30 select-none pointer-events-none">
              {radius} LY
            </div>
          </Html>
        </group>
      ))}
      {/* X and Z axes */}
      <Line points={[new THREE.Vector3(-1000, 0, 0), new THREE.Vector3(1000, 0, 0)]} color="#4a90e2" transparent opacity={0.05} />
      <Line points={[new THREE.Vector3(0, 0, -1000), new THREE.Vector3(0, 0, 1000)]} color="#4a90e2" transparent opacity={0.05} />
    </group>
  );
}
