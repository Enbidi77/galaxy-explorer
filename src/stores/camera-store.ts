import { create } from 'zustand';
import { CameraMode } from '../types/astronomy';

interface CameraState {
  cameraMode: CameraMode;
  targetPosition: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  isAnimating: boolean;
  cinematicProgress: number;
  
  setCameraMode: (mode: CameraMode) => void;
  setTargetPosition: (pos: [number, number, number] | null) => void;
  setTargetLookAt: (lookAt: [number, number, number] | null) => void;
  setIsAnimating: (animating: boolean) => void;
  setCinematicProgress: (progress: number) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  cameraMode: 'free',
  targetPosition: null,
  targetLookAt: null,
  isAnimating: false,
  cinematicProgress: 0,

  setCameraMode: (mode) => set({ cameraMode: mode }),
  setTargetPosition: (pos) => set({ targetPosition: pos }),
  setTargetLookAt: (lookAt) => set({ targetLookAt: lookAt }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  setCinematicProgress: (progress) => set({ cinematicProgress: progress }),
}));
