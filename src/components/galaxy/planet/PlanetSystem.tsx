'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { useSettingsStore } from '@/stores/settings-store';
import { SOLAR_SYSTEM_PLANETS, PlanetDefinition } from './planet-data';
import Planet from './Planet';
import { movingObjectRegistry } from '@/lib/galaxy/focus-registry';

interface PlanetSystemProps {
  system?: unknown; // Keeps backwards compatibility with earlier props
}

export default function PlanetSystem({}: PlanetSystemProps) {
  const selectObject = useGalaxyStore((s) => s.selectObject);
  const selectedObjectId = useGalaxyStore((s) => s.selectedObjectId);
  const focusObject = useGalaxyStore((s) => s.focusObject);
  const showOrbits = useSettingsStore((s) => s.visualizationSettings.showOrbits);
  const showLabels = useSettingsStore((s) => s.visualizationSettings.showLabels);
  const animSpeed = useSettingsStore((s) => s.animationSettings.speed);
  const performanceMode = useSettingsStore((s) => s.performanceMode);

  const solAnchorRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (solAnchorRef.current) {
      movingObjectRegistry.register('sol', solAnchorRef.current);
    }
    return () => {
      movingObjectRegistry.unregister('sol');
    };
  }, []);

  // Quality profile for LOD
  const quality = useMemo(() => {
    switch (performanceMode) {
      case 'low':
        return 'low';
      case 'balanced':
        return 'medium';
      case 'high':
        return 'high';
      default:
        return 'high';
    }
  }, [performanceMode]);

  const planets = useMemo(() => {
    return SOLAR_SYSTEM_PLANETS.filter((p) => p.type !== 'moon');
  }, []);

  const moon = useMemo(() => {
    return SOLAR_SYSTEM_PLANETS.find((p) => p.id === 'moon')!;
  }, []);

  const sunPosition: [number, number, number] = [0, 0, 0];

  return (
    <group>
      {/* ================= SUN (SOL) ================= */}
      {/* Central star as a calibrated light source (not an overblown flat disc) */}
      <group ref={solAnchorRef} position={sunPosition}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            selectObject('sol');
            focusObject('sol');
          }}
        >
          <sphereGeometry args={[4.2, 64, 64]} />
          <meshStandardMaterial
            color="#ffbb44"
            emissive="#ff8800"
            emissiveIntensity={1.8}
            roughness={0.9}
          />
        </mesh>

        {/* Soft Corona Halo */}
        <mesh scale={1.15}>
          <sphereGeometry args={[4.2, 32, 32]} />
          <meshBasicMaterial
            color="#ffaa33"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Primary Star Illumination for the System */}
        <pointLight
          position={[0, 0, 0]}
          color="#fff8ed"
          intensity={5.0}
          distance={1200}
          decay={1.2}
        />

        {showLabels && (
          <Html distanceFactor={60} position={[0, 5.5, 0]} center style={{ pointerEvents: 'none' }}>
            <div className="bg-slate-950/80 backdrop-blur-sm border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider">
              SOL (G2V)
            </div>
          </Html>
        )}
      </group>

      {/* ================= ASTEROID BELT ================= */}
      <AsteroidBelt innerRadius={48} outerRadius={56} count={quality === 'low' ? 180 : 450} />

      {/* ================= PLANETS ================= */}
      {planets.map((planet) => {
        const isSelected = selectedObjectId === planet.id;
        const isEarth = planet.id === 'earth';

        return (
          <PlanetOrbit
            key={planet.id}
            planet={planet}
            moon={isEarth ? moon : undefined}
            isSelected={isSelected}
            selectedObjectId={selectedObjectId}
            showOrbit={showOrbits}
            showLabel={showLabels}
            animSpeed={animSpeed}
            quality={quality}
            sunPosition={sunPosition}
            onSelectPlanet={(id) => {
              selectObject(id);
              focusObject(id);
            }}
          />
        );
      })}
    </group>
  );
}

interface PlanetOrbitProps {
  planet: PlanetDefinition;
  moon?: PlanetDefinition;
  isSelected: boolean;
  selectedObjectId: string | null;
  showOrbit: boolean;
  showLabel: boolean;
  animSpeed: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  sunPosition: [number, number, number];
  onSelectPlanet: (id: string) => void;
}

function PlanetOrbit({
  planet,
  moon,
  isSelected,
  selectedObjectId,
  showOrbit,
  showLabel,
  animSpeed,
  quality,
  sunPosition,
  onSelectPlanet,
}: PlanetOrbitProps) {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const moonOrbitGroupRef = useRef<THREE.Group>(null);
  const planetAnchorRef = useRef<THREE.Group>(null);
  const moonAnchorRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (planetAnchorRef.current) {
      movingObjectRegistry.register(planet.id, planetAnchorRef.current);
    }
    return () => {
      movingObjectRegistry.unregister(planet.id);
    };
  }, [planet.id]);

  useEffect(() => {
    if (moon && moonAnchorRef.current) {
      movingObjectRegistry.register(moon.id, moonAnchorRef.current);
    }
    return () => {
      if (moon) {
        movingObjectRegistry.unregister(moon.id);
      }
    };
  }, [moon]);

  const radius = planet.orbitalRadius;
  // Physically proportional orbital angular velocity (Kepler: T^2 = a^3)
  const orbitSpeed = 0.28 / Math.sqrt(planet.orbitalPeriod);

  useFrame((_, delta) => {
    const dt = delta * animSpeed;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += orbitSpeed * dt * 0.15;
    }
    if (moonOrbitGroupRef.current) {
      moonOrbitGroupRef.current.rotation.y += dt * 0.8;
    }
  });

  return (
    <group>
      {/* Concentric Orbit Trajectory Ring */}
      {showOrbit && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
          <meshBasicMaterial
            color="#22d3ee"
            side={THREE.DoubleSide}
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Orbiting Plane */}
      <group ref={orbitGroupRef}>
        <group ref={planetAnchorRef} position={[radius, 0, 0]}>
          {/* Main Planet Renderer */}
          <Planet
            planet={planet}
            radius={planet.radius}
            quality={quality}
            sunPosition={sunPosition}
            isSelected={isSelected}
            onClick={() => onSelectPlanet(planet.id)}
          />

          {/* Moon System (Earth's Luna) */}
          {moon && (
            <group ref={moonOrbitGroupRef}>
              <group ref={moonAnchorRef} position={[moon.orbitalRadius, 0, 0]}>
                <Planet
                  planet={moon}
                  radius={moon.radius}
                  quality={quality}
                  sunPosition={sunPosition}
                  isSelected={selectedObjectId === 'moon'}
                  onClick={() => onSelectPlanet('moon')}
                />
                {showLabel && (
                  <Html
                    distanceFactor={35}
                    position={[0, moon.radius * 2.2, 0]}
                    center
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="bg-slate-950/75 text-white/70 px-1.5 py-0.2 rounded text-[8px] font-mono whitespace-nowrap">
                      Moon
                    </div>
                  </Html>
                )}
              </group>
            </group>
          )}

          {/* Planet Label */}
          {showLabel && (
            <Html
              distanceFactor={55}
              position={[0, planet.radius * 2.1, 0]}
              center
              style={{ pointerEvents: 'none' }}
            >
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap select-none transition-all ${
                  isSelected
                    ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-950/80 text-white/80 border border-white/10 hover:border-white/30'
                }`}
              >
                {planet.name}
              </div>
            </Html>
          )}
        </group>
      </group>
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
      const y = (Math.random() - 0.5) * 1.8;

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const scale = 0.06 + Math.random() * 0.12;
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, innerRadius, outerRadius, dummy]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#7a7876" roughness={0.92} metalness={0.08} />
    </instancedMesh>
  );
}
