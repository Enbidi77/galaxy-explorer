'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { StarSystem, Planet } from '@/types/galaxy';

interface PlanetSystemProps {
  system: StarSystem;
}

export default function PlanetSystem({ system }: PlanetSystemProps) {
  return (
    <group>
      {/* Central Star */}
      <Sphere args={[system.starSize, 64, 64]}>
        <meshStandardMaterial 
          color={system.starColor}
          emissive={system.starColor}
          emissiveIntensity={2}
        />
      </Sphere>

      {/* Point light from star */}
      <pointLight color={system.starColor} intensity={2} distance={1000} decay={2} />

      {/* Planets */}
      {system.planets.map((planet, index) => (
        <PlanetRenderer key={planet.id || index} planet={planet} />
      ))}
    </group>
  );
}

function PlanetRenderer({ planet }: { planet: Planet }) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Orbit rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = time * planet.orbitSpeed;
    }
    
    // Planet self-rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = time * planet.rotationSpeed;
    }
  });

  // Create orbit line points
  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * planet.orbitRadius, 0, Math.sin(theta) * planet.orbitRadius));
  }

  return (
    <group>
      {/* Orbit Ring */}
      <Line points={points} color="#ffffff" opacity={0.1} transparent lineWidth={1} />

      {/* Rotating Group for Orbit */}
      <group ref={groupRef}>
        {/* Planet position offset by orbit radius */}
        <group position={[planet.orbitRadius, 0, 0]}>
          <Sphere ref={planetRef} args={[planet.size, 32, 32]}>
            <meshStandardMaterial color={planet.color} />
          </Sphere>
          
          {/* Label */}
          <Html distanceFactor={50} position={[0, planet.size * 1.5, 0]} center>
            <div className="bg-black/50 text-white px-1 py-0.5 rounded text-[10px] pointer-events-none opacity-50 whitespace-nowrap">
              {planet.name}
            </div>
          </Html>
        </group>
      </group>
    </group>
  );
}
