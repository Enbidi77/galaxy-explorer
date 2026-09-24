'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialObject } from '@/types/astronomy';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { blackHoleDiskVertexShader, blackHoleDiskFragmentShader } from '@/lib/planet-shaders/black-hole.glsl';

interface BlackHoleProps {
  object: CelestialObject;
}

export default function BlackHole({ object }: BlackHoleProps) {
  const selectObject = useGalaxyStore((s) => s.selectObject);
  const selectedObjectId = useGalaxyStore((s) => s.selectedObjectId);

  const diskRef = useRef<THREE.Mesh>(null);
  const diskMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const isSelected = selectedObjectId === object.id;

  const diskMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: blackHoleDiskVertexShader,
      fragmentShader: blackHoleDiskFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uInnerRadius: { value: 0.28 },
        uOuterRadius: { value: 1.0 },
      },
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (diskMaterialRef.current) {
      diskMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.4;
    }
    if (diskRef.current) {
      diskRef.current.rotation.z += 0.002;
    }
  });

  useEffect(() => {
    diskMaterialRef.current = diskMaterial;
    return () => {
      diskMaterial.dispose();
    };
  }, [diskMaterial]);

  const eventHorizonRadius = object.size * 0.45;
  const diskOuterRadius = object.size * 2.8;

  return (
    <group
      position={object.position}
      onClick={(e) => {
        e.stopPropagation();
        selectObject(object.id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Absolute Black Event Horizon Sphere */}
      <mesh>
        <sphereGeometry args={[eventHorizonRadius, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Gravitational Lensing Halo Rim */}
      <mesh scale={1.08}>
        <sphereGeometry args={[eventHorizonRadius, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa44"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Relativistic Accretion Disk */}
      <mesh
        ref={diskRef}
        rotation={[-Math.PI / 2.8, 0.35, 0]}
      >
        <planeGeometry args={[diskOuterRadius * 2, diskOuterRadius * 2]} />
        <primitive object={diskMaterial} attach="material" />
      </mesh>

      {/* 4. Secondary Gravitational Lensing Arch (vertical warped image of back disk) */}
      <mesh rotation={[0.4, 0, 0]}>
        <ringGeometry args={[eventHorizonRadius * 1.05, eventHorizonRadius * 1.45, 64]} />
        <meshBasicMaterial
          color="#ffa230"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Selection Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[eventHorizonRadius * 2.2, eventHorizonRadius * 2.35, 64]} />
          <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}
