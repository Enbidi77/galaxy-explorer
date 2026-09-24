import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  VisualizationSettings, 
  CameraSettings, 
  AnimationSettings, 
  PerformanceMode, 
  ThemeMode 
} from '../types/astronomy';

interface SettingsState {
  visualizationSettings: VisualizationSettings;
  cameraSettings: CameraSettings;
  animationSettings: AnimationSettings;
  performanceMode: PerformanceMode;
  theme: ThemeMode;
  soundEnabled: boolean;
  
  setVisualizationSettings: (settings: Partial<VisualizationSettings>) => void;
  setCameraSettings: (settings: Partial<CameraSettings>) => void;
  setAnimationSettings: (settings: Partial<AnimationSettings>) => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const defaultState = {
  visualizationSettings: {
    showStarField: true,
    showNebula: true,
    showGalaxyArms: true,
    showLabels: true,
    showOrbits: true,
    showGrid: false,
    bloomIntensity: 0.7,
    exposure: 1.0,
    particleDensity: 1.0,
  },
  cameraSettings: {
    sensitivity: 1.0,
    smoothness: 0.1,
  },
  animationSettings: {
    speed: 1.0,
  },
  performanceMode: 'auto' as PerformanceMode,
  theme: 'deep-space' as ThemeMode,
  soundEnabled: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      setVisualizationSettings: (settings) => set((state) => ({
        visualizationSettings: { ...state.visualizationSettings, ...settings }
      })),
      
      setCameraSettings: (settings) => set((state) => ({
        cameraSettings: { ...state.cameraSettings, ...settings }
      })),
      
      setAnimationSettings: (settings) => set((state) => ({
        animationSettings: { ...state.animationSettings, ...settings }
      })),
      
      setPerformanceMode: (mode) => set({ performanceMode: mode }),
      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      
      resetToDefaults: () => set({ ...defaultState }),
    }),
    {
      name: 'galaxy-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
