'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGalaxyStore } from '../../stores/galaxy-store';
import { useCameraStore } from '../../stores/camera-store';
import { SOLAR_SYSTEM_PLANETS } from './planet/planet-data';
import { movingObjectRegistry } from '@/lib/galaxy/focus-registry';

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

  // Moving object focus & real-time tracking references
  const trackingTargetId = useRef<string | null>(null);
  const isTransitioning = useRef(false);
  const transitionProgress = useRef(0);
  const transitionDuration = useRef(2.0);

  const startCamPos = useRef(new THREE.Vector3());
  const startControlsTarget = useRef(new THREE.Vector3());
  const prevTargetPos = useRef(new THREE.Vector3());
  const currentTargetPos = useRef(new THREE.Vector3());
  const targetOffset = useRef(new THREE.Vector3(0, 0, 0));

  // Resolves the current real-time world position of any celestial target
  const getTargetPosition = useCallback(
    (id: string | null, out: THREE.Vector3): boolean => {
      if (!id) return false;

      // 1. Check real-time moving body registry (planets revolving in Keplerian orbits, moons)
      if (movingObjectRegistry.has(id)) {
        movingObjectRegistry.getWorldPosition(id, out);
        return true;
      }

      // 2. Solar system center in system view
      if (id === 'sol' && viewLevel === 'system') {
        out.set(0, 0, 0);
        return true;
      }

      // 3. Fallback for solar system planets if not yet mounted
      if (viewLevel === 'system') {
        const pDef = SOLAR_SYSTEM_PLANETS.find((p) => p.id === id);
        if (pDef) {
          out.set(pDef.orbitalRadius, 0, 0);
          return true;
        }
      }

      // 4. Galaxy celestial objects
      const obj = celestialObjects.find((o) => o.id === id);
      if (obj) {
        out.set(...obj.position);
        return true;
      }

      return false;
    },
    [viewLevel, celestialObjects]
  );

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
        },
      });

      TOUR_STOPS.forEach((stop, index) => {
        tl.to(
          {},
          {
            duration: 0.1,
            onStart: () => setCurrentTourStop(stop.name),
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

  // Handle Cinematic Tour Pause / Resume
  useEffect(() => {
    if (!cinematicTimelineRef.current) return;
    if (isCinematicPaused) {
      cinematicTimelineRef.current.pause();
    } else {
      cinematicTimelineRef.current.resume();
    }
  }, [isCinematicPaused]);

  // Setup Smooth Focus Approach on target change
  useEffect(() => {
    if (isCinematicMode || !controlsRef.current) return;

    if (focusedObjectId) {
      trackingTargetId.current = focusedObjectId;
      isTransitioning.current = true;
      transitionProgress.current = 0;
      transitionDuration.current = 2.0;
      setIsAnimating(true);

      startCamPos.current.copy(camera.position);
      startControlsTarget.current.copy(controlsRef.current.target);

      // Determine framing distance and cinematic view angle based on body type
      if (viewLevel === 'system') {
        if (focusedObjectId === 'sol') {
          targetOffset.current.set(0, 35, 75);
        } else {
          const planetDef = SOLAR_SYSTEM_PLANETS.find((p) => p.id === focusedObjectId);
          const planetRadius = planetDef?.radius ?? 1.0;
          const camDistance = Math.max(planetRadius * 3.6 + 1.2, 3.2);

          // 3/4 sun-lit viewpoint reveals terminator relief and atmosphere glow
          targetOffset.current.set(camDistance * 0.7, camDistance * 0.35, camDistance * 0.8);
        }
      } else {
        const obj = celestialObjects.find((o) => o.id === focusedObjectId);
        const size = obj?.size ?? 5.0;
        const camDistance = Math.max(size * 7.5, 20);
        targetOffset.current.set(camDistance * 0.5, camDistance * 0.3, camDistance);
      }

      const temp = new THREE.Vector3();
      if (getTargetPosition(focusedObjectId, temp)) {
        prevTargetPos.current.copy(temp);
        setTargetPosition([temp.x, temp.y, temp.z]);
      }
    } else {
      // Transition back to default overview
      trackingTargetId.current = null;
      isTransitioning.current = true;
      transitionProgress.current = 0;
      transitionDuration.current = 1.8;
      setIsAnimating(true);
      setTargetPosition(null);

      startCamPos.current.copy(camera.position);
      startControlsTarget.current.copy(controlsRef.current.target);

      if (viewLevel === 'system') {
        targetOffset.current.set(0, 45, 95);
        prevTargetPos.current.set(0, 0, 0);
      } else {
        targetOffset.current.set(...DEFAULT_POSITION);
        prevTargetPos.current.set(...DEFAULT_TARGET);
      }
    }
  }, [
    focusedObjectId,
    viewLevel,
    isCinematicMode,
    camera,
    celestialObjects,
    getTargetPosition,
    setIsAnimating,
    setTargetPosition,
  ]);

  // Real-time tracking loop (executed each frame outside React render)
  useFrame((_, delta) => {
    if (isCinematicMode || !controlsRef.current) return;

    const id = trackingTargetId.current;

    // 1. Moving or static object active tracking
    if (id) {
      const hasPos = getTargetPosition(id, currentTargetPos.current);
      if (!hasPos) return;

      if (isTransitioning.current) {
        // Smooth cubic ease-in-out approach to moving target
        transitionProgress.current += delta / transitionDuration.current;
        const rawT = Math.min(transitionProgress.current, 1);
        const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        const desiredCamPos = currentTargetPos.current.clone().add(targetOffset.current);

        controlsRef.current.target.lerpVectors(startControlsTarget.current, currentTargetPos.current, t);
        camera.position.lerpVectors(startCamPos.current, desiredCamPos, t);
        controlsRef.current.update();

        prevTargetPos.current.copy(currentTargetPos.current);

        if (rawT >= 1) {
          isTransitioning.current = false;
          setIsAnimating(false);
        }
      } else {
        // Continuous Real-Time Tracking Lock on Moving Planet / Moon:
        // Compute delta vector of planet's movement since previous frame
        const deltaMove = currentTargetPos.current.clone().sub(prevTargetPos.current);

        // Displace camera by the exact displacement of the planet
        camera.position.add(deltaMove);
        controlsRef.current.target.copy(currentTargetPos.current);
        controlsRef.current.update();

        prevTargetPos.current.copy(currentTargetPos.current);
      }
    } else if (isTransitioning.current) {
      // Transitioning back to default overview
      transitionProgress.current += delta / transitionDuration.current;
      const rawT = Math.min(transitionProgress.current, 1);
      const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      const destTarget = viewLevel === 'system' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(...DEFAULT_TARGET);
      const destCam = viewLevel === 'system' ? new THREE.Vector3(0, 45, 95) : new THREE.Vector3(...DEFAULT_POSITION);

      controlsRef.current.target.lerpVectors(startControlsTarget.current, destTarget, t);
      camera.position.lerpVectors(startCamPos.current, destCam, t);
      controlsRef.current.update();

      if (rawT >= 1) {
        isTransitioning.current = false;
        setIsAnimating(false);
      }
    }
  });

  // WASD camera movement (manual flight cancels focus lock)
  useEffect(() => {
    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      keys.add(e.key.toLowerCase());

      // If user uses manual navigation keys, release active focus lock
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(e.key.toLowerCase())) {
        if (useGalaxyStore.getState().focusedObjectId) {
          useGalaxyStore.getState().focusObject(null);
        }
      }
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
