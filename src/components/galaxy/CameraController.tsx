'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGalaxyStore } from '../../stores/galaxy-store';
import { useCameraStore } from '../../stores/camera-store';
import { SOLAR_SYSTEM_PLANETS } from './planet/planet-data';

const DEFAULT_POSITION: [number, number, number] = [0, 80, 180];
const DEFAULT_TARGET: [number, number, number] = [0, 0, 0];

const TOUR_STOPS = [
  { name: 'Galactic Core', pos: [0, 18, 45], target: [0, 0, 0], duration: 4 },
  { name: 'Spiral Arm Cluster', pos: [90, 35, 90], target: [50, 4, 30], duration: 4 },
  { name: 'Solar System & Earth', pos: [136, 12, -64], target: [120, 5, -80], duration: 4.5 },
  { name: 'Sirius Binary System', pos: [138, 15, -62], target: [126, 8, -74], duration: 4 },
  { name: 'Betelgeuse Supergiant', pos: [190, 45, -100], target: [150, 18, -130], duration: 4.5 },
  { name: 'Milky Way Vista', pos: [0, 95, 210], target: [0, 0, 0], duration: 4.5 },
];

export default function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  
  const focusedObjectId = useGalaxyStore((s) => s.focusedObjectId);
  const viewLevel = useGalaxyStore((s) => s.viewLevel);
  const celestialObjects = useGalaxyStore((s) => s.celestialObjects);
  const isCinematicMode = useGalaxyStore((s) => s.isCinematicMode);
  const isCinematicPaused = useGalaxyStore((s) => s.isCinematicPaused);
  const setCurrentTourStop = useGalaxyStore((s) => s.setCurrentTourStop);

  const setIsAnimating = useCameraStore((s) => s.setIsAnimating);
  const setTargetPosition = useCameraStore((s) => s.setTargetPosition);

  const cinematicTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Cinematic Tour Animation
  useEffect(() => {
    if (!controlsRef.current) return;

    if (isCinematicMode) {
      if (cinematicTimelineRef.current) {
        cinematicTimelineRef.current.kill();
      }

      const tl = gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.update();
          }
        }
      });

      TOUR_STOPS.forEach((stop, index) => {
        tl.to(
          {},
          {
            duration: 0.1,
            onStart: () => setCurrentTourStop(stop.name)
          }
        );

        tl.to(
          camera.position,
          {
            x: stop.pos[0],
            y: stop.pos[1],
            z: stop.pos[2],
            duration: stop.duration,
            ease: 'power2.inOut',
          },
          `stop-${index}`
        );

        tl.to(
          controlsRef.current!.target,
          {
            x: stop.target[0],
            y: stop.target[1],
            z: stop.target[2],
            duration: stop.duration,
            ease: 'power2.inOut',
          },
          `stop-${index}`
        );

        // Pause at each landmark for viewing
        tl.to({}, { duration: 2.5 });
      });

      cinematicTimelineRef.current = tl;

      return () => {
        tl.kill();
        cinematicTimelineRef.current = null;
      };
    } else {
      if (cinematicTimelineRef.current) {
        cinematicTimelineRef.current.kill();
        cinematicTimelineRef.current = null;
      }
    }
  }, [isCinematicMode, camera, setCurrentTourStop]);

  // Handle Pause / Resume
  useEffect(() => {
    if (!cinematicTimelineRef.current) return;
    if (isCinematicPaused) {
      cinematicTimelineRef.current.pause();
    } else {
      cinematicTimelineRef.current.resume();
    }
  }, [isCinematicPaused]);

  // Regular Focus Mode Animation (when not in cinematic tour)
  useEffect(() => {
    if (!controlsRef.current || isCinematicMode) return;

    if (viewLevel === 'system') {
      if (!focusedObjectId || focusedObjectId === 'sol') {
        // System overview centered on Sol
        setIsAnimating(true);
        setTargetPosition([0, 0, 0]);

        gsap.to(camera.position, {
          x: 0,
          y: 45,
          z: 95,
          duration: 2.2,
          ease: 'power2.inOut',
          onComplete: () => setIsAnimating(false),
        });

        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2.2,
          ease: 'power2.inOut',
        });
      } else {
        // Close-up framing on focused planet or moon
        const planetDef = SOLAR_SYSTEM_PLANETS.find((p) => p.id === focusedObjectId);
        const radius = planetDef?.orbitalRadius ?? 20;
        const planetSize = planetDef?.radius ?? 1.0;
        const tx = radius;
        const ty = 0;
        const tz = 0;
        const camDistance = Math.max(planetSize * 3.6 + 1.2, 3.2);

        setIsAnimating(true);
        setTargetPosition([tx, ty, tz]);

        gsap.to(camera.position, {
          x: tx + camDistance * 0.7,
          y: ty + camDistance * 0.35,
          z: tz + camDistance * 0.8,
          duration: 2.0,
          ease: 'power2.inOut',
          onComplete: () => setIsAnimating(false),
        });

        gsap.to(controlsRef.current.target, {
          x: tx,
          y: ty,
          z: tz,
          duration: 2.0,
          ease: 'power2.inOut',
        });
      }
      return;
    }

    if (focusedObjectId) {
      const target = celestialObjects.find((o) => o.id === focusedObjectId);
      if (!target) return;

      const [tx, ty, tz] = target.position;
      const offsetDist = Math.max(target.size * 8, 20);

      setIsAnimating(true);
      setTargetPosition([tx, ty, tz]);

      gsap.to(camera.position, {
        x: tx + offsetDist * 0.5,
        y: ty + offsetDist * 0.3,
        z: tz + offsetDist,
        duration: 2.5,
        ease: 'power2.inOut',
        onComplete: () => setIsAnimating(false),
      });

      gsap.to(controlsRef.current.target, {
        x: tx,
        y: ty,
        z: tz,
        duration: 2.5,
        ease: 'power2.inOut',
      });
    } else {
      // Reset to default view
      setIsAnimating(true);
      setTargetPosition(null);

      gsap.to(camera.position, {
        x: DEFAULT_POSITION[0],
        y: DEFAULT_POSITION[1],
        z: DEFAULT_POSITION[2],
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => setIsAnimating(false),
      });

      gsap.to(controlsRef.current.target, {
        x: DEFAULT_TARGET[0],
        y: DEFAULT_TARGET[1],
        z: DEFAULT_TARGET[2],
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [focusedObjectId, viewLevel, celestialObjects, camera, setIsAnimating, setTargetPosition, isCinematicMode]);

  // WASD camera movement
  useEffect(() => {
    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      keys.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
    };

    const moveCamera = () => {
      if (!controlsRef.current || isCinematicMode) return;
      const speed = 1.8;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

      if (keys.has('w')) {
        camera.position.addScaledVector(forward, speed);
        controlsRef.current.target.addScaledVector(forward, speed);
      }
      if (keys.has('s')) {
        camera.position.addScaledVector(forward, -speed);
        controlsRef.current.target.addScaledVector(forward, -speed);
      }
      if (keys.has('a')) {
        camera.position.addScaledVector(right, -speed);
        controlsRef.current.target.addScaledVector(right, -speed);
      }
      if (keys.has('d')) {
        camera.position.addScaledVector(right, speed);
        controlsRef.current.target.addScaledVector(right, speed);
      }
      if (keys.has('q')) {
        camera.position.y -= speed;
        controlsRef.current.target.y -= speed;
      }
      if (keys.has('e')) {
        camera.position.y += speed;
        controlsRef.current.target.y += speed;
      }

      requestAnimationFrame(moveCamera);
    };

    const frameId = requestAnimationFrame(moveCamera);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(frameId);
    };
  }, [camera, isCinematicMode]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxDistance={3000}
      minDistance={1}
      enablePan
      panSpeed={0.6}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
    />
  );
}
