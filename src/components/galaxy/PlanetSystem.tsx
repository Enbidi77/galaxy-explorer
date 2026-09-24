'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialObject, PlanetarySystem } from '../../types/astronomy';
import { useGalaxyStore } from '../../stores/galaxy-store';
import { useSettingsStore } from '../../stores/settings-store';

interface PlanetSystemProps {
  system: PlanetarySystem;
}

export default function PlanetSystem({ system }: PlanetSystemProps) {
  const celestialObjects = useGalaxyStore((s) => s.celestialObjects);
  const selectObject = useGalaxyStore((s) => s.selectObject);
  const selectedObjectId = useGalaxyStore((s) => s.selectedObjectId);
  const showOrbits = useSettingsStore((s) => s.visualizationSettings.showOrbits);
  const showLabels = useSettingsStore((s) => s.visualizationSettings.showLabels);
  const animSpeed = useSettingsStore((s) => s.animationSettings.speed);

  const star = celestialObjects.find((o) => o.id === system.starId);
  const planets = system.planets.filter((p) => p.type === 'planet');
  const moons = system.planets.filter((p) => p.type === 'moon');

  if (!star) return null;

  return (
    <group>
      {/* Central star */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          selectObject(star.id);
        }}
      >
        <sphereGeometry args={[star.size * 0.7, 64, 64]} />
        <meshStandardMaterial
          color={star.color || '#ffcc00'}
          emissive={star.color || '#ffcc00'}
          emissiveIntensity={2.5}
        />
      </mesh>
      <pointLight
        color={star.color || '#ffcc00'}
        intensity={4}
        distance={800}
        decay={1.8}
      />

      {/* Asteroid Belt between Mars & Jupiter */}
      <AsteroidBelt innerRadius={36} outerRadius={46} count={400} />

      {/* Planets */}
      {planets.map((planet) => {
        const planetMoons = moons.filter((m) => m.parentId === planet.id);
        return (
          <PlanetOrbit
            key={planet.id}
            planet={planet}
            moons={planetMoons}
            isSelected={selectedObjectId === planet.id}
            showOrbit={showOrbits}
            showLabel={showLabels}
            animSpeed={animSpeed}
            onSelect={() => selectObject(planet.id)}
          />
        );
      })}
    </group>
  );
}

function AsteroidBelt({ innerRadius, outerRadius, count }: { innerRadius: number; outerRadius: number; count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.5;

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const scale = 0.08 + Math.random() * 0.14;
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, innerRadius, outerRadius, dummy]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888899" roughness={0.9} />
    </instancedMesh>
  );
}

function PlanetOrbit({
  planet,
  moons,
  isSelected,
  showOrbit,
  showLabel,
  animSpeed,
  onSelect,
}: {
  planet: CelestialObject;
  moons: CelestialObject[];
  isSelected: boolean;
  showOrbit: boolean;
  showLabel: boolean;
  animSpeed: number;
  onSelect: () => void;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);

  const radius = planet.orbitalRadius || 20;
  const orbitSpeed = planet.orbitalPeriod ? 0.35 / planet.orbitalPeriod : 0.05;
  const rotSpeed = planet.rotationPeriod ? 1.5 / planet.rotationPeriod : 0.4;
  const planetSize = Math.max(planet.size * 0.4, 0.3);

  const hasRings = Boolean(planet.metadata?.hasRings);

  useFrame((_, delta) => {
    const dt = delta * animSpeed;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += orbitSpeed * dt;
    }
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += rotSpeed * dt;
    }
  });

  return (
    <group>
      {/* Orbit ring */}
      {showOrbit && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.04, radius + 0.04, 128]} />
          <meshBasicMaterial
            color="#22d3ee"
            side={THREE.DoubleSide}
            transparent
            opacity={0.12}
          />
        </mesh>
      )}

      {/* Orbiting group */}
      <group ref={orbitGroupRef}>
        <group position={[radius, 0, 0]}>
          {/* Planet body */}
          <mesh
            ref={planetMeshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            <sphereGeometry args={[planetSize, 32, 32]} />
            <meshStandardMaterial
              color={planet.color || '#888'}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Saturn Planetary Rings */}
          {hasRings && (
            <mesh rotation={[-Math.PI / 2.3, 0.2, 0]}>
              <ringGeometry args={[planetSize * 1.4, planetSize * 2.6, 64]} />
              <meshStandardMaterial
                color="#d8cbb3"
                side={THREE.DoubleSide}
                transparent
                opacity={0.75}
                roughness={0.8}
              />
            </mesh>
          )}

          {/* Target highlight ring */}
          {isSelected && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planetSize * 1.5, planetSize * 1.6, 32]} />
              <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {/* Moons */}
          {moons.map((moon) => (
            <MoonOrbit key={moon.id} moon={moon} parentSize={planetSize} animSpeed={animSpeed} />
          ))}

          {/* Label */}
          {showLabel && (
            <Html
              distanceFactor={50}
              position={[0, planetSize * 2.2, 0]}
              center
              style={{ pointerEvents: 'none' }}
            >
              <div className="bg-slate-950/80 backdrop-blur-sm border border-white/10 text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap select-none opacity-80 font-mono">
                {planet.name}
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

function MoonOrbit({ moon, parentSize, animSpeed }: { moon: CelestialObject; parentSize: number; animSpeed: number }) {
  const moonGroupRef = useRef<THREE.Group>(null);
  const moonRadius = parentSize + 1.2;

  useFrame((_, delta) => {
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += delta * 1.2 * animSpeed;
    }
  });

  return (
    <group ref={moonGroupRef}>
      <mesh position={[moonRadius, 0, 0]}>
        <sphereGeometry args={[Math.max((moon.size || 0.27) * 0.25, 0.08), 16, 16]} />
        <meshStandardMaterial color={moon.color || '#d0d0d0'} />
      </mesh>
    </group>
  );
}
