import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PerformanceMode } from '../types/astronomy';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(ly: number): string {
  if (ly === 0) return '0 LY';
  if (ly < 1) {
    // Convert to AU or millions of km if less than 1 LY?
    return `${(ly * 63241.077).toFixed(2)} AU`; // 1 LY = ~63,241 AU
  }
  if (ly >= 1000000) {
    return `${(ly / 1000000).toFixed(2)} M LY`;
  }
  return `${ly.toLocaleString(undefined, { maximumFractionDigits: 2 })} LY`;
}

export function formatTemperature(k: number): string {
  return `${k.toLocaleString()} K`;
}

export function formatCoordinates(pos: [number, number, number]): string {
  return `X: ${pos[0].toFixed(2)}, Y: ${pos[1].toFixed(2)}, Z: ${pos[2].toFixed(2)}`;
}

// Right Ascension (RA) from x, z
export function formatRA(x: number, z: number): string {
  let hours = (Math.atan2(z, x) * 12) / Math.PI;
  if (hours < 0) hours += 24;
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = ((hours - h - m / 60) * 3600).toFixed(2);
  return `${h}h ${m}m ${s}s`;
}

// Declination (DEC) from y, distance
export function formatDEC(y: number): string {
  // Simple approximation for visualization based on arbitrary scale
  const r = Math.sqrt(y * y + 100); // 100 is dummy radius in xy plane
  const deg = (Math.asin(y / r) * 180) / Math.PI;
  const sign = deg < 0 ? '-' : '+';
  const absDeg = Math.abs(deg);
  const d = Math.floor(absDeg);
  const m = Math.floor((absDeg - d) * 60);
  const s = ((absDeg - d - m / 60) * 3600).toFixed(1);
  return `${sign}${d}° ${m}' ${s}"`;
}

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function detectPerformanceLevel(): PerformanceMode {
  // Simple heuristic. In a real app we might benchmark
  const cores = navigator.hardwareConcurrency || 4;
  if (cores >= 8) return 'high';
  if (cores >= 4) return 'balanced';
  return 'low';
}
