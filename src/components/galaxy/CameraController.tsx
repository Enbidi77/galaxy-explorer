'use client';

import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsAP';
import * as THREE from 'three';
import { useGalaxyStore } from '@/stores/galaxyStore';

export default function CameraController() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const { selectedObjectId, specialStars } = useGalaxyStore();

  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedObjectId) {
      const targetStar = specialStars.find(s => s.id === selectedObjectId);
      if (targetStar) {
        const targetPos = new THREE.Vector3(...targetStar.position);
        
        // Calculate offset position for camera
        const offset = new THREE.Vector3(0, targetStar.size * 5, targetStar.size * 15);
        const camPos = targetPos.clone().add(offset);

        gsap.to(camera.position, {
          x: camPos.x,
          y: camPos.y,
          z: camPos.z,
          duration: 2,
          ease: 'power2.inOut',
        });

        gsap.to(controlsRef.current.target, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 2,
          ease: 'power2.inOut',
        });
      }
    } else {
      // Reset to galaxy view
      gsap.to(camera.position, {
        x: 0,
        y: 100,
        z: 200,
        duration: 2,
        ease: 'power2.inOut',
      });

      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [selectedObjectId, camera.position, specialStars]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      const speed = 5;
      if (e.key === 'w') camera.position.z -= speed;
      if (e.key === 's') camera.position.z += speed;
      if (e.key === 'a') camera.position.x -= speed;
      if (e.key === 'd') camera.position.x += speed;
      if (e.key === 'q') camera.position.y -= speed;
      if (e.key === 'e') camera.position.y += speed;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.05}
      maxDistance={2000}
      minDistance={1}
    />
  );
}
