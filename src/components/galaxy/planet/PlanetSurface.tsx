'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetDefinition } from './planet-data';
import { loadPlanetTexture, createProceduralEarthTexture, createProceduralMoonTexture } from './planet-materials';
import { earthSurfaceVertexShader, earthSurfaceFragmentShader } from '@/lib/planet-shaders/earth-surface.glsl';
import { gasGiantVertexShader, gasGiantFragmentShader } from '@/lib/planet-shaders/gas-giant.glsl';

interface PlanetSurfaceProps {
  planet: PlanetDefinition;
  radius: number;
  segments: number;
  sunPosition?: [number, number, number];
}

export default function PlanetSurface({
  planet,
  radius,
  segments,
  sunPosition = [0, 0, 0],
}: PlanetSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const earthMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const gasGiantMatRef = useRef<THREE.ShaderMaterial | null>(null);

  // Textures
  const dayMap = useMemo(() => {
    return loadPlanetTexture(planet.textures.map, true, undefined, () => {
      if (planet.id === 'earth') return createProceduralEarthTexture();
      if (planet.id === 'moon') return createProceduralMoonTexture();
    });
  }, [planet.textures.map, planet.id]);

  const normalMap = useMemo(() => {
    return planet.textures.normalMap ? loadPlanetTexture(planet.textures.normalMap, false) : null;
  }, [planet.textures.normalMap]);

  const specularMap = useMemo(() => {
    return planet.textures.specularMap ? loadPlanetTexture(planet.textures.specularMap, false) : null;
  }, [planet.textures.specularMap]);

  const nightMap = useMemo(() => {
    return planet.textures.nightMap ? loadPlanetTexture(planet.textures.nightMap, true) : null;
  }, [planet.textures.nightMap]);

  // Earth custom multi-layer PBR Shader Material
  const earthShaderMaterial = useMemo(() => {
    if (planet.id !== 'earth') return null;

    return new THREE.ShaderMaterial({
      vertexShader: earthSurfaceVertexShader,
      fragmentShader: earthSurfaceFragmentShader,
      uniforms: {
        uDayMap: { value: dayMap },
        uNightMap: { value: nightMap || dayMap },
        uNormalMap: { value: normalMap },
        uSpecularMap: { value: specularMap },
        uSunPosition: { value: new THREE.Vector3(...sunPosition) },
        uNormalScale: { value: 0.8 },
        uShininess: { value: 36.0 },
      },
      defines: {
        USE_NORMALMAP: normalMap ? 1 : 0,
      },
    });
  }, [planet.id, dayMap, nightMap, normalMap, specularMap, sunPosition]);

  // Gas Giant custom turbulence & zonal wind Shader Material
  const gasGiantShaderMaterial = useMemo(() => {
    if (planet.type !== 'gas-giant' && planet.type !== 'ice-giant') return null;

    const atmosphereTint =
      planet.id === 'jupiter'
        ? new THREE.Vector3(0.9, 0.75, 0.55)
        : planet.id === 'saturn'
        ? new THREE.Vector3(0.85, 0.78, 0.6)
        : planet.id === 'uranus'
        ? new THREE.Vector3(0.5, 0.85, 0.9)
        : new THREE.Vector3(0.2, 0.45, 0.95);

    return new THREE.ShaderMaterial({
      vertexShader: gasGiantVertexShader,
      fragmentShader: gasGiantFragmentShader,
      uniforms: {
        uMap: { value: dayMap },
        uSunPosition: { value: new THREE.Vector3(...sunPosition) },
        uTime: { value: 0 },
        uTurbulence: { value: planet.id === 'jupiter' ? 1.0 : 0.4 },
        uAtmosphereTint: { value: atmosphereTint },
      },
    });
  }, [planet.type, planet.id, dayMap, sunPosition]);

  // Animate gas giant turbulence and update sun position
  useFrame((state) => {
    if (gasGiantMatRef.current) {
      gasGiantMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      gasGiantMatRef.current.uniforms.uSunPosition.value.set(...sunPosition);
    }
    if (earthMatRef.current) {
      earthMatRef.current.uniforms.uSunPosition.value.set(...sunPosition);
    }
  });

  // Assign refs and clean up materials on unmount
  useEffect(() => {
    earthMatRef.current = earthShaderMaterial;
    gasGiantMatRef.current = gasGiantShaderMaterial;
    return () => {
      earthShaderMaterial?.dispose();
      gasGiantShaderMaterial?.dispose();
    };
  }, [earthShaderMaterial, gasGiantShaderMaterial]);

  if (planet.id === 'earth' && earthShaderMaterial) {
    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, segments, segments]} />
        <primitive object={earthShaderMaterial} attach="material" />
      </mesh>
    );
  }

  if ((planet.type === 'gas-giant' || planet.type === 'ice-giant') && gasGiantShaderMaterial) {
    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, segments, segments]} />
        <primitive object={gasGiantShaderMaterial} attach="material" />
      </mesh>
    );
  }

  // Terrestrial planets & moons (Mars, Moon, Mercury, Venus)
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, segments, segments]} />
      <meshStandardMaterial
        map={dayMap}
        normalMap={normalMap || undefined}
        normalScale={normalMap ? new THREE.Vector2(0.8, 0.8) : undefined}
        roughness={planet.material?.roughness ?? 0.8}
        metalness={planet.material?.metalness ?? 0.05}
      />
    </mesh>
  );
}
