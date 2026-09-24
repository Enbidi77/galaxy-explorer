export type CelestialObjectType = 'star' | 'planet' | 'nebula' | 'black-hole' | 'galaxy' | 'moon' | 'asteroid';

export interface CelestialObject {
  id: string;
  name: string;
  type: CelestialObjectType;
  position: [number, number, number];
  size: number;
  color?: string;
  description?: string;
  distance?: number; // in light years
  temperature?: number; // in Kelvin
  mass?: number; // in solar masses
  magnitude?: number;
  spectralClass?: string;
  discovered?: string;
  parentId?: string; // for planets orbiting stars
  orbitalRadius?: number;
  orbitalPeriod?: number; // in Earth years
  rotationPeriod?: number; // in Earth days
  metadata?: Record<string, unknown>;
}

export interface PlanetarySystem {
  starId: string;
  planets: CelestialObject[];
  asteroids?: CelestialObject[];
}

export type ViewLevel = 'galaxy' | 'system' | 'object';
export type CameraMode = 'free' | 'focus' | 'cinematic';
export type PerformanceMode = 'auto' | 'high' | 'balanced' | 'low';
export type ThemeMode = 'deep-space' | 'scientific';

export interface GalaxyConfig {
  starCount: number;
  spiralArms: number;
  spiralTightness: number;
  galaxyRadius: number;
  coreRadius: number;
  thickness: number;
  armWidth: number;
}

export interface VisualizationSettings {
  showStarField: boolean;
  showNebula: boolean;
  showGalaxyArms: boolean;
  showLabels: boolean;
  showOrbits: boolean;
  showGrid: boolean;
  bloomIntensity: number;
  exposure: number;
  particleDensity: number;
}

export interface CameraSettings {
  sensitivity: number;
  smoothness: number;
}

export interface AnimationSettings {
  speed: number; // 0.5, 1, 2, 4
}
